"use client";
import React, { useState, useEffect } from "react";
import { Users, Calendar, MessageCircle, FileText } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { format } from "date-fns";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Reusable components
function MetricCard({ title, value, change, icon }) {
  return (
    <div className="bg-[#FFF8E1] p-5 rounded-lg shadow-md text-center border border-[#FFE0B2] hover:bg-[#FFE0B2] transition duration-200">
      <div className="flex justify-center mb-3">{icon}</div>
      <h3 className="text-lg font-medium text-[#2D3748]">{title}</h3>
      <p className="text-2xl font-semibold text-[#26A69A] mt-2">{value}</p>
      <p className="text-[#81C784] text-sm mt-1">{change} from last month</p>
    </div>
  );
}

function ActivityItem({ user, action, time }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#FFE0B2] hover:bg-[#FFE0B2] transition duration-200">
      <span className="text-[#4A5568] text-sm">
        {user} {action}
      </span>
      <span className="text-[#4DB6AC] text-xs">{time}</span>
    </div>
  );
}

// Main Dashboard component
export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [parentCount, setParentCount] = useState("0");
  const [childCount, setChildCount] = useState("0");
  const [therapistCount, setTherapistCount] = useState("0");
  const [healthLogCount, setHealthLogCount] = useState("0");
  const [bookedAppointmentsCount, setBookedAppointmentsCount] = useState("0");
  const [healthLogTrends, setHealthLogTrends] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]); // New state for recent activities
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("");

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch parents
        const parentRes = await fetch("/api/parent", { cache: "no-store" });
        if (!parentRes.ok) throw new Error("Failed to fetch parents");
        const parents = await parentRes.json();
        setParentCount(parents.length.toString());

        // Fetch children
        const childRes = await fetch("/api/child", { cache: "no-store" });
        if (!childRes.ok) throw new Error("Failed to fetch children");
        const children = await childRes.json();
        setChildCount(children.length.toString());

        // Fetch therapists
        const therapistRes = await fetch("/api/therapist", {
          cache: "no-store",
        });
        if (!therapistRes.ok) throw new Error("Failed to fetch therapists");
        const therapists = await therapistRes.json();
        setTherapistCount(therapists.length.toString());

        // Fetch health logs
        const healthLogRes = await fetch("/api/healthLogs", {
          cache: "no-store",
        });
        if (!healthLogRes.ok) throw new Error("Failed to fetch health logs");
        const { total } = await healthLogRes.json();
        setHealthLogCount(total.toString());

        // Fetch booked appointments
        const bookedRes = await fetch("/api/appointment/booked", {
          cache: "no-store",
        });
        if (!bookedRes.ok)
          throw new Error("Failed to fetch booked appointments");
        const { total: bookedTotal } = await bookedRes.json();
        setBookedAppointmentsCount(bookedTotal.toString());

        // Fetch health log trends
        const trendsRes = await fetch("/api/healthLogs/trends", {
          cache: "no-store",
        });
        if (!trendsRes.ok) throw new Error("Failed to fetch health log trends");
        const trendsData = await trendsRes.json();
        setHealthLogTrends(trendsData);

        // Fetch appointment data by therapist
        const appointmentRes = await fetch(
          "/api/appointment/booked/byTherapist",
          { cache: "no-store" }
        );
        if (!appointmentRes.ok)
          throw new Error("Failed to fetch appointment data");
        const fetchedAppointmentData = await appointmentRes.json();
        setAppointmentData(fetchedAppointmentData);

        // Fetch recent activities
        const activitiesRes = await fetch("/api/recent-activities", {
          cache: "no-store",
        });
        if (!activitiesRes.ok)
          throw new Error("Failed to fetch recent activities");
        const activitiesData = await activitiesRes.json();
        setRecentActivities(activitiesData);

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
    setCurrentTime(format(new Date(), "hh:mm a 'EAT', MMMM d, yyyy"));
  }, []);

  const metrics = [
    {
      title: "Total Parents",
      value: loading ? "Loading..." : error ? "Error" : parentCount,
      change: "+0%",
      icon: <Users className="h-6 w-6 text-gray-400" />,
    },
    {
      title: "Active Therapists",
      value: loading ? "Loading..." : error ? "Error" : therapistCount,
      change: "+0%",
      icon: <Users className="h-6 w-6 text-gray-400" />,
    },
    {
      title: "Registered Children",
      value: loading ? "Loading..." : error ? "Error" : childCount,
      change: "+0%",
      icon: <Users className="h-6 w-6 text-gray-400" />,
    },
    // {
    //   title: "Active Sessions",
    //   value: "89",
    //   change: "+5.4%",
    //   icon: <Calendar className="h-6 w-6 text-gray-400" />,
    // },
    {
      title: "Health Logs Submitted",
      value: loading ? "Loading..." : error ? "Error" : healthLogCount,
      change: "+0%",
      icon: <FileText className="h-6 w-6 text-gray-400" />,
    },
    {
      title: "Appointment Bookings",
      value: loading ? "Loading..." : error ? "Error" : bookedAppointmentsCount,
      change: "+0%",
      icon: <Calendar className="h-6 w-6 text-gray-400" />,
    },
    // {
    //   title: "Chat Messages",
    //   value: "320",
    //   change: "+0",
    //   icon: <MessageCircle className="h-6 w-6 text-gray-400" />,
    // },
  ];

  const healthLogData = healthLogTrends
    ? {
        labels: healthLogTrends.labels || [],
        datasets: [
          {
            label: "Health Logs Submitted",
            data: healthLogTrends.data || [],
            borderColor: "#4B5EFC",
            backgroundColor: "rgba(75, 94, 252, 0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      }
    : null;

  const appointmentChartData = appointmentData
    ? {
        labels: appointmentData.labels || [],
        datasets: [
          {
            label: "Appointments Booked",
            data: appointmentData.data || [],
            backgroundColor: "#10B981",
            borderColor: "#10B981",
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#D1D5DB" } },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#D1D5DB" } },
      x: { ticks: { color: "#D1D5DB" } },
    },
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex-1 ml-0 lg:ml-72 p-8">
        <h1 className="text-3xl font-semibold text-[#2D3748] mb-6">
          Dashboard
        </h1>
        <p className="text-[#4A5568] mb-8 text-sm">
          Overview of the platform's key metrics and activities as of{" "}
          {currentTime || "Loading..."}
        </p>
        {error && <div className="text-[#FF8A80] mb-4">Error: {error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#FFF8E1] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-[#2D3748] mb-4">
              Health Log Trends
            </h2>
            <div className="h-64">
              {loading || !currentTime || !healthLogData ? (
                <p className="text-[#4A5568] text-center h-full flex items-center justify-center">
                  {loading || !currentTime ? "Loading..." : "No data available"}
                </p>
              ) : (
                <Line data={healthLogData} options={chartOptions} />
              )}
            </div>
          </div>
          <div className="bg-[#FFF8E1] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-[#2D3748] mb-4">
              Appointment Bookings by Therapist
            </h2>
            <div className="h-64">
              {loading || !currentTime || !appointmentChartData ? (
                <p className="text-[#4A5568] text-center h-full flex items-center justify-center">
                  {loading || !currentTime ? "Loading..." : "No data available"}
                </p>
              ) : (
                <Bar data={appointmentChartData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>
        {/* <div className="bg-[#FFF8E1] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#2D3748] mb-4">
            Recent Activities
          </h2>
          {loading || !currentTime ? (
            <p className="text-[#4A5568]">Loading activities...</p>
          ) : error ? (
            <p className="text-[#FF8A80]">Failed to load activities</p>
          ) : recentActivities.length === 0 ? (
            <p className="text-[#4A5568]">No recent activities found</p>
          ) : (
            recentActivities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))
          )}
        </div> */}
      </div>
    </div>
  );
}
