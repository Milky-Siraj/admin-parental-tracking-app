"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Users } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { format } from "date-fns";

export default function Appointments() {
  const [open, setOpen] = useState(false);
  const [totalAppointments, setTotalAppointments] = useState("0");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch booked appointments count
        const bookedRes = await fetch("/api/appointment/booked", {
          cache: "no-store",
        });
        if (!bookedRes.ok)
          throw new Error("Failed to fetch booked appointments");
        const { total } = await bookedRes.json();
        setTotalAppointments(total.toString());

        // Fetch appointment list
        const appointmentsRes = await fetch("/api/appointment", {
          cache: "no-store",
        });
        if (!appointmentsRes.ok)
          throw new Error("Failed to fetch appointments");
        const appointmentsData = await appointmentsRes.json();
        setAppointments(appointmentsData);

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 ml-0 lg:ml-72 p-8">
        <h1 className="text-3xl font-semibold text-gray-100 mb-4">
          Appointments
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          Manage and monitor all scheduled appointments as of{" "}
          {format(new Date(), "hh:mm a 'EAT', MMMM d, yyyy")}
        </p>

        {error && <div className="text-red-500 mb-4">Error: {error}</div>}

        <SearchBar placeholder="Search appointments..." />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1A1A1A] p-5 rounded-lg shadow-md text-center border border-gray-800">
            <div className="flex justify-center mb-3">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-200">
              Total Appointments
            </h3>
            <p className="text-2xl font-semibold text-white mt-2">
              {loading ? "Loading..." : error ? "Error" : appointments.length}
            </p>
          </div>
          <div className="bg-[#1A1A1A] p-5 rounded-lg shadow-md text-center border border-gray-800">
            <div className="flex justify-center mb-3">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-200">
              Active Therapists
            </h3>
            <p className="text-2xl font-semibold text-white mt-2">3</p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Appointment List
          </h2>
          {loading ? (
            <p className="text-gray-400">Loading appointments...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load appointments</p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-400">No appointments found</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 text-gray-200 font-medium">Therapist</th>
                  <th className="py-3 text-gray-200 font-medium">Parent</th>
                  <th className="py-3 text-gray-200 font-medium">Date</th>
                  <th className="py-3 text-gray-200 font-medium">Time</th>
                  <th className="py-3 text-gray-200 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
                  >
                    <td className="py-3 text-gray-300">
                      {appointment.therapist}
                    </td>
                    <td className="py-3 text-gray-300">{appointment.parent}</td>
                    <td className="py-3 text-gray-300">{appointment.date}</td>
                    <td className="py-3 text-gray-300">{appointment.time}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          appointment.status === "Confirmed"
                            ? "bg-green-600"
                            : appointment.status === "Pending"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        } text-white`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
