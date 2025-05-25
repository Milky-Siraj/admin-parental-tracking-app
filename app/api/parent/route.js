// app/api/users/route.js
import { query } from "@/config/db";

export async function GET() {
  try {
    const users = await query("SELECT * FROM core_customuser WHERE role = $1", [
      "parent",
    ]);
    return new Response(JSON.stringify(users), {
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
