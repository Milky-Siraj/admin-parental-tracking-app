import { query } from "@/config/db";
import { format } from "date-fns";

export async function GET(request) {
  try {
    console.log("Appointments request received:", {
      url: request.url,
      timestamp: new Date().toISOString(),
    });

    // Join appointment_appointment with appointment_availability and core_customuser
    const result = await query(
      `
      SELECT 
        aa.id,
        aa.status,
        aa.requested_at,
        aa.parent_id,
        aa.availability_id,
        av.start_time,
        av.end_time,
        av.therapist_id,
        t.first_name AS therapist_first_name,
        t.last_name AS therapist_last_name,
        p.first_name AS parent_first_name,
        p.last_name AS parent_last_name
      FROM public.appointment_appointment aa
      LEFT JOIN public.appointment_availability av ON aa.availability_id = av.id
      LEFT JOIN public.core_customuser t ON av.therapist_id = t.id
      LEFT JOIN public.core_customuser p ON aa.parent_id = p.id
      `,
      []
    );

    const appointments = result.map((row) => ({
      therapist: `${row.therapist_first_name || "Unknown"} ${
        row.therapist_last_name || "Therapist"
      }`,
      parent: `${row.parent_first_name || "Unknown"} ${
        row.parent_last_name || "Parent"
      }`,
      date: format(new Date(row.start_time), "MMMM d, yyyy"),
      time: format(new Date(row.start_time), "h:mm a"),
      status: row.status,
    }));

    console.log("Fetched appointments:", { count: appointments.length });

    return new Response(JSON.stringify(appointments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Appointments API error:", {
      message: error.message,
      stack: error.stack,
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
