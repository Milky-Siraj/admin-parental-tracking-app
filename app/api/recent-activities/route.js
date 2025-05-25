// app/api/recent-activities/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Mock data for recent activities
    const activities = [
      {
        user: "Sarah T.",
        action: "registered a new child",
        time: "1 hour ago",
      },
      {
        user: "Dr. Emily R.",
        action: "accepted an appointment",
        time: "2 hours ago",
      },
      {
        user: "Michael C.",
        action: "submitted a health log",
        time: "3 hours ago",
      },
      { user: "Anna B.", action: "booked an appointment", time: "4 hours ago" },
      { user: "John D.", action: "sent a chat message", time: "5 hours ago" },
    ];

    // In a real application, you would fetch this from a database, e.g.:
    // const activities = await query("SELECT user, action, timestamp FROM activities ORDER BY timestamp DESC LIMIT 5");

    return new Response(JSON.stringify(activities), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API route error:", {
      message: error.message,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({
        error: "Failed to fetch recent activities",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
