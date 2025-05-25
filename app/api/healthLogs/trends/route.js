import { query } from "@/config/db";
import { format } from "date-fns";

export async function GET(request) {
  try {
    console.log("Health log trends request received:", {
      timestamp: new Date().toISOString(),
    });

    // Fetch health log counts for the past 7 days
    const result = await query(
      `
      SELECT 
        DATE(generated_at) AS log_date,
        COUNT(*) AS log_count
      FROM public.report_report
      WHERE generated_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(generated_at)
      ORDER BY log_date
      `,
      []
    );

    const labels = result.map((r) => format(new Date(r.log_date), "MMMM d"));
    const data = result.map((r) => parseInt(r.log_count, 10));

    console.log("Fetched health log trends:", { labels, data });

    return new Response(JSON.stringify({ labels, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Health log trends API error:", {
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
