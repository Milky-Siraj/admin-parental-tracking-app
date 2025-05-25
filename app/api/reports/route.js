import { query } from "@/config/db";
import { format } from "date-fns";

export async function GET(request) {
  try {
    console.log("Reports request received:", {
      url: request.url,
      timestamp: new Date().toISOString(),
    });

    // Join report_report with child_profile and core_customuser to get child and parent names
    const result = await query(
      `
      SELECT 
        rr.id,
        rr.report_type,
        rr.generated_at,
        rr.summary,
        rr.suggestion,
        rr.insight,
        rr.child_id,
        cp.first_name AS child_first_name,
        cp.last_name AS child_last_name,
        cu.first_name AS parent_first_name,
        cu.last_name AS parent_last_name
      FROM public.report_report rr
      LEFT JOIN public.child_profile cp ON rr.child_id = cp.id
      LEFT JOIN public.core_customuser cu ON cp.parent_Id = cu.id
      `,
      []
    );

    const reports = result.map((row) => {
      const insight = row.insight || {};
      return {
        child: `${row.child_first_name || "Unknown"} ${
          row.child_last_name || "Child"
        }`,
        parent: `${row.parent_first_name || "Unknown"} ${
          row.parent_last_name || "Parent"
        }`,
        type: row.report_type === "daily" ? "Daily" : "Weekly",
        date: format(
          new Date(row.generated_at),
          row.report_type === "daily" ? "MMMM d, yyyy" : "MMMM d'-'dd, yyyy"
        ),
        healthMetrics: {
          heartRate: insight.heartbeat
            ? insight.heartbeat[0].replace("Average heart rate: ", "") || "N/A"
            : "N/A",
          sleep: insight.sleep
            ? "Avg " +
              (insight.sleep[0].match(/\d+\.?\d*/g) || ["N/A"])[0] +
              " hrs"
            : "N/A",
          behavior: insight.behavior
            ? insight.behavior[0].match(/happy|calm|mixed/gi)?.join(", ") ||
              "N/A"
            : "N/A",
        },
        insight: row.suggestion || "No insight available",
      };
    });

    console.log("Fetched reports:", { count: reports.length });

    return new Response(JSON.stringify(reports), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Reports API error:", {
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
