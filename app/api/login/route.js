import { query } from "@/config/db";

export async function POST(request) {
  try {
    console.log("API request received:", {
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });

    const { email, password } = await request.json();
    console.log("Login attempt:", {
      email,
      timestamp: new Date().toISOString(),
    });

    if (!email) {
      console.log("Missing email in request");
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (password !== "milkysiraj124@gmail.com") {
      console.log("Invalid password:", { email });
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const users = await query(
      "SELECT id, email, is_superuser, first_name, last_name, role " +
        "FROM core_customuser WHERE email = $1",
      [email]
    );

    if (users.length === 0) {
      console.log("User not found:", { email });
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = users[0];

    if (!user.is_superuser) {
      console.log("Non-superuser attempted login:", { email, id: user.id });
      return new Response(
        JSON.stringify({
          error: "Access denied: Superuser privileges required",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Superuser login successful:", { email, id: user.id });
    return new Response(
      JSON.stringify({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Login API error:", {
      message: error.message,
      stack: error.stack,
      email: email || "unknown",
      url: request.url,
    });
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
