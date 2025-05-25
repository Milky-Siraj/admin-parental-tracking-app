import { query } from "@/config/db";
import { format } from "date-fns";

export async function GET(request) {
  try {
    console.log("Parents list request received:", {
      timestamp: new Date().toISOString(),
    });

    // Fetch all parents with role 'parent'
    const parentsResult = await query(
      `
      SELECT 
        id,
        first_name,
        last_name,
        email,
        role
      FROM public.core_customuser
      WHERE role = 'parent'
      `,
      []
    );

    // For each parent, fetch their children and latest health metrics
    const parents = await Promise.all(
      parentsResult.map(async (parent) => {
        // Fetch children for this parent
        const childrenResult = await query(
          `
          SELECT 
            cp.id,
            cp.first_name,
            cp.last_name,
            cp.gender,
            cp.date_of_birth
          FROM public.child_profile cp
          WHERE cp.parent_Id = $1
          `,
          [parent.id]
        );

        // Fetch latest health metrics for each child
        const children = await Promise.all(
          childrenResult.map(async (child) => {
            const latestReport = await query(
              `
              SELECT insight
              FROM public.report_report
              WHERE child_id = $1
              ORDER BY generated_at DESC
              LIMIT 1
              `,
              [child.id]
            );

            const insight =
              latestReport.length > 0 ? latestReport[0].insight || {} : {};
            return {
              id: child.id,
              firstName: child.first_name,
              lastName: child.last_name,
              gender: child.gender,
              dateOfBirth: format(
                new Date(child.date_of_birth),
                "MMMM d, yyyy"
              ),
              healthMetrics: {
                heartRate: insight.heartbeat
                  ? insight.heartbeat[0].replace("Average heart rate: ", "") ||
                    "N/A"
                  : "N/A",
                sleep: insight.sleep
                  ? "Avg " +
                    (insight.sleep[0].match(/\d+\.?\d*/g) || ["N/A"])[0] +
                    " hrs"
                  : "N/A",
                behavior: insight.behavior
                  ? insight.behavior[0]
                      .match(/happy|calm|mixed/gi)
                      ?.join(", ") || "N/A"
                  : "N/A",
              },
            };
          })
        );

        return {
          id: parent.id,
          firstName: parent.first_name,
          lastName: parent.last_name,
          email: parent.email,
          role: parent.role,
          children,
        };
      })
    );

    console.log("Fetched parents list:", {
      parentCount: parents.length,
      totalChildren: parents.reduce((sum, p) => sum + p.children.length, 0),
    });

    return new Response(JSON.stringify(parents), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Parents list API error:", {
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
