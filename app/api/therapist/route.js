import { pool, query } from "@/config/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary"; // Add Cloudinary SDK

// Configure Cloudinary with your credentials (move to a config file in production)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request) {
  const url = new URL(request.url);
  const pathName = url.pathname;

  if (pathName.startsWith("/api/therapist/file")) {
    const fileName = decodeURIComponent(pathName.split("/file/")[1]);
    try {
      // Query the database to get the Cloudinary URL for the file
      const result = await query(
        "SELECT t.edu_document FROM core_therapist t JOIN core_customuser u ON t.user_id = u.id WHERE u.email = $1 AND t.edu_document IS NOT NULL",
        [fileName] // Assuming fileName is the email or a unique identifier
      );

      if (!result.rows.length || !result.rows[0].edu_document) {
        return new Response(JSON.stringify({ error: "File not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const cloudinaryUrl = result.rows[0].edu_document;
      const response = await fetch(cloudinaryUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch file from Cloudinary");
      }

      const buffer = await response.arrayBuffer();
      return new Response(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${fileName}.pdf"`,
        },
      });
    } catch (error) {
      console.error("File serve error:", {
        fileName,
        error: error.message,
        stack: error.stack,
      });
      return new Response(JSON.stringify({ error: "File not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  try {
    const therapists = await query(
      "SELECT u.id, u.email, u.first_name, u.last_name, u.phone_number, u.role, t.edu_document, COALESCE(t.admin_approved, false) as admin_approved " +
        "FROM core_customuser u " +
        "LEFT JOIN core_therapist t ON u.id = t.user_id " +
        "WHERE u.role = $1 " +
        "UNION " +
        "SELECT p.id, p.email, p.first_name, p.last_name, p.phone_number, p.role, p.edu_document, false as admin_approved " +
        "FROM core_pendinguser p " +
        "WHERE p.role = $1 AND p.id NOT IN (SELECT id FROM core_customuser WHERE role = $1)",
      ["therapist"]
    );
    console.log("Fetched therapists:", therapists);
    return new Response(JSON.stringify(therapists || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API route error:", {
      message: error.message,
      stack: error.stack,
      query: "SELECT therapists",
    });
    return new Response(
      JSON.stringify({
        error: "Failed to fetch therapists",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request) {
  try {
    let first_name, last_name, email, file;
    const contentType =
      request.headers.get("content-type")?.toLowerCase() || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      first_name = formData.get("first_name");
      last_name = formData.get("last_name");
      email = formData.get("email");
      file = formData.get("edu_document");
    } else if (contentType.includes("application/json")) {
      const json = await request.json();
      first_name = json.first_name;
      last_name = json.last_name;
      email = json.email;
    } else {
      return new Response(
        JSON.stringify({ error: "Unsupported or missing Content-Type" }),
        {
          status: 415,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!first_name || !last_name || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const type = await (await import("file-type")).fileTypeFromBuffer(buffer);
      if (!type || type.mime !== "application/pdf") {
        return new Response(
          JSON.stringify({ error: "Only PDF files are allowed" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const userResult = await client.query(
        "INSERT INTO core_customuser (first_name, last_name, email, role, is_active, date_joined) " +
          "VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, email",
        [
          first_name,
          last_name,
          email,
          "therapist",
          false,
          new Date().toISOString(),
        ]
      );
      const user = userResult.rows[0];

      let edu_document = null;
      if (file) {
        const uploadResponse = await cloudinary.v2.uploader.upload(
          Buffer.from(await file.arrayBuffer()),
          {
            resource_type: "raw", // For PDFs
            folder: "therapists/edu_documents",
            public_id: `${user.id}_${Date.now()}`,
          }
        );
        edu_document = uploadResponse.secure_url; // Store the Cloudinary URL
      }

      await client.query(
        "INSERT INTO core_therapist (user_id, edu_document, admin_approved, created_at, updated_at, is_verified) " +
          "VALUES ($1, $2, $3, $4, $5, $6)",
        [
          user.id,
          edu_document,
          false,
          new Date().toISOString(),
          new Date().toISOString(),
          false,
        ]
      );

      await client.query("COMMIT");

      return new Response(
        JSON.stringify({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          edu_document,
          admin_approved: false,
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      await client.query("ROLLBACK");
      if (edu_document) {
        try {
          await cloudinary.v2.uploader.destroy(
            path.basename(edu_document, ".pdf"), // Extract public_id
            { resource_type: "raw" }
          );
        } catch (cleanupError) {
          console.error("Failed to cleanup Cloudinary file:", cleanupError);
        }
      }
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("API route error:", {
      message: error.message,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PATCH(request) {
  try {
    const { id, admin_approved } = await request.json();
    if (!id || typeof admin_approved !== "boolean") {
      return new Response(
        JSON.stringify({ error: "Missing id or admin_approved" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Check if the therapist exists in core_pendinguser
      const pendingResult = await client.query(
        "SELECT id, email, first_name, last_name, phone_number, role, edu_document " +
          "FROM core_pendinguser " +
          "WHERE id = $1 AND role = $2",
        [id, "therapist"]
      );

      let therapist;
      let source = "pending";
      let tempPassword = null;

      if (pendingResult.rowCount > 0) {
        // Therapist found in core_pendinguser
        therapist = pendingResult.rows[0];
        const originalEduDocument = therapist.edu_document;

        if (admin_approved) {
          // Generate a temporary password
          tempPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(tempPassword, 10);

          // Approve: Move to core_customuser and core_therapist
          const userResult = await client.query(
            "INSERT INTO core_customuser (id, email, first_name, last_name, phone_number, role, password, is_active, date_joined, is_superuser, is_staff) " +
              "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, email, first_name, last_name",
            [
              therapist.id,
              therapist.email,
              therapist.first_name,
              therapist.last_name,
              therapist.phone_number || null,
              therapist.role,
              hashedPassword,
              true,
              new Date().toISOString(),
              false,
              false,
            ]
          );

          therapist = userResult.rows[0];

          await client.query(
            "INSERT INTO core_therapist (user_id, edu_document, admin_approved, created_at, updated_at, is_verified) " +
              "VALUES ($1, $2, $3, $4, $5, $6)",
            [
              therapist.id,
              originalEduDocument,
              true,
              new Date().toISOString(),
              new Date().toISOString(),
              true,
            ]
          );

          // Delete from core_pendinguser
          await client.query(
            "DELETE FROM core_pendinguser WHERE id = $1 AND role = $2",
            [id, "therapist"]
          );
        } else {
          // Reject: Delete from core_pendinguser
          if (originalEduDocument) {
            try {
              await cloudinary.v2.uploader.destroy(
                path.basename(originalEduDocument, ".pdf"), // Extract public_id
                { resource_type: "raw" }
              );
            } catch (cleanupError) {
              console.error("Failed to cleanup Cloudinary file:", cleanupError);
            }
          }
          await client.query(
            "DELETE FROM core_pendinguser WHERE id = $1 AND role = $2",
            [id, "therapist"]
          );
        }
      } else {
        // Therapist not in core_pendinguser, check core_customuser
        source = "customuser";
        const therapistResult = await client.query(
          "SELECT u.email, u.first_name, u.last_name " +
            "FROM core_customuser u " +
            "WHERE u.id = $1 AND u.role = $2",
          [id, "therapist"]
        );

        if (therapistResult.rowCount === 0) {
          throw new Error("Therapist not found");
        }

        therapist = therapistResult.rows[0];

        // Update the therapist's admin_approved status in core_therapist
        const result = await client.query(
          "UPDATE core_therapist SET admin_approved = $1 WHERE user_id = $2 RETURNING user_id, admin_approved",
          [admin_approved, id]
        );

        if (result.rowCount === 0) {
          throw new Error("Therapist not found in core_therapist");
        }
      }

      // Send email based on status
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      if (admin_approved) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: therapist.email,
          subject: "Therapist Account Accepted",
          text: `Dear ${therapist.first_name} ${
            therapist.last_name
          },\n\nYour therapist account has been accepted. You can now log in using your email and the temporary password: ${
            tempPassword || "N/A"
          }.\n\nPlease reset your password after logging in for security purposes.\n\nBest regards,\nThe Admin Team`,
        };
        await transporter.sendMail(mailOptions);
      } else {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: therapist.email,
          subject: "Therapist Account Rejected",
          text: `Dear ${therapist.first_name} ${therapist.last_name},\n\nWe sincerely regret to inform you that your therapist account has not been approved at this time. We understand this may be disappointing, and we truly appreciate the effort you put into your application. If you have any questions or would like further clarification, please don't hesitate to reach out to our support team—we're here to assist you.\n\nThank you for your interest in joining our platform.\n\nWarm regards,\nThe Admin Team`,
        };
        await transporter.sendMail(mailOptions);
      }

      await client.query("COMMIT");

      return new Response(JSON.stringify({ id, admin_approved }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("PATCH error:", {
      message: error.message,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({
        error: "Failed to update therapist status",
        details: error.message,
      }),
      {
        status: error.message.includes("Therapist not found") ? 404 : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
