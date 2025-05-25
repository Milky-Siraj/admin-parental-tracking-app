// app/api/users/route.js
import { query } from "@/config/db";

export async function GET() {
  try {
    const users = await query(
      "SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.date_joined, COALESCE(t.admin_approved, false) as admin_approved " +
        "FROM core_customuser u " +
        "LEFT JOIN core_therapist t ON u.id = t.user_id"
    );
    console.log("Fetched users:", users);
    return new Response(JSON.stringify(users || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error:", {
      message: error.message,
      stack: error.stack,
      query: "SELECT users",
    });
    return new Response(
      JSON.stringify({
        error: "Failed to fetch users",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
