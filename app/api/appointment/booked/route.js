import { query } from "@/config/db";

export async function GET(request) {
  try {
    const result = await query(
      `
      SELECT COUNT(*) AS total
      FROM public.appointment_appointment
      WHERE status = 'booked'
      `,
      []
    );
    return new Response(JSON.stringify({ total: result[0].total }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
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
