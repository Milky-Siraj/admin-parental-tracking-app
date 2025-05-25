import { query } from "@/config/db";

export async function GET(request) {
  try {
    console.log("Appointment bookings by therapist request received:", {
      timestamp: new Date().toISOString(),
    });

    const result = await query(
      `
      SELECT 
        cu.first_name || ' ' || cu.last_name AS therapist_name,
        COUNT(*) AS appointment_count
      FROM public.appointment_availability
      JOIN public.core_customuser cu ON appointment_availability.therapist_id = cu.id
      WHERE appointment_availability.is_booked = 'true' -- Corrected alias
      GROUP BY cu.id, cu.first_name, cu.last_name
      `,
      []
    );

    const labels = result.map((r) => r.therapist_name);
    const data = result.map((r) => parseInt(r.appointment_count, 10));

    console.log("Fetched appointment bookings:", { labels, data });

    return new Response(JSON.stringify({ labels, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Appointment bookings API error:", {
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
