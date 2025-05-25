// app/api/health-logs/route.js
import { query } from "@/config/db";

export async function GET() {
  try {
    const behaviourCount = await query("SELECT COUNT(*) FROM log_behavior", []);
    const foodCount = await query("SELECT COUNT(*) FROM log_food", []);
    const sleepCount = await query("SELECT COUNT(*) FROM log_sleep", []);
    const bloodpressureCount = await query(
      "SELECT COUNT(*) FROM log_bloodpressure",
      []
    );
    const heartbeatCount = await query(
      "SELECT COUNT(*) FROM log_heartbeat",
      []
    );
    const scratchnotesCount = await query(
      "SELECT COUNT(*) FROM log_scratchnotes",
      []
    );
    const total =
      parseInt(behaviourCount[0].count) +
      parseInt(foodCount[0].count) +
      parseInt(sleepCount[0].count) +
      parseInt(bloodpressureCount[0].count) +
      parseInt(heartbeatCount[0].count) +
      parseInt(scratchnotesCount[0].count);
    return new Response(JSON.stringify({ total }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API route error:", error);
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
