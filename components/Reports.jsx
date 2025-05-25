"use client";
import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { format } from "date-fns";

export default function Reports() {
  const [open, setOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data and set timestamp on mount
  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch("/api/reports", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();
        setReports(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    }
    fetchReports();
    // Set timestamp after mount to avoid server-client mismatch
    setCurrentTime(format(new Date(), "hh:mm a 'EAT', MMMM d, yyyy"));
  }, []);

  // Filter reports based on search term
  const filteredReports = reports.filter((report) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      report.child.toLowerCase().includes(searchLower) ||
      report.parent.toLowerCase().includes(searchLower) ||
      report.type.toLowerCase().includes(searchLower) ||
      report.date.toLowerCase().includes(searchLower) ||
      report.healthMetrics.heartRate.toString().includes(searchLower) ||
      report.healthMetrics.sleep.toString().includes(searchLower) ||
      report.healthMetrics.behavior.toString().includes(searchLower) ||
      report.insight.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 ml-0 lg:ml-72 p-8">
        <h1 className="text-3xl font-semibold text-gray-100 mb-6">Reports</h1>
        <p className="text-gray-400 mb-8 text-sm">
          View and analyze generated reports as of {currentTime || "Loading..."}
        </p>

        {error && <div className="text-red-500 mb-4">Error: {error}</div>}

        <SearchBar
          placeholder="Search by child, parent, type, date, or metrics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1A1A1A] p-5 rounded-lg shadow-md text-center border border-gray-800">
            <div className="flex justify-center mb-3">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-200">Daily Reports</h3>
            <p className="text-2xl font-semibold text-white mt-2">
              {loading
                ? "Loading..."
                : error
                ? "Error"
                : reports.filter((r) => r.type === "Daily").length}
            </p>
          </div>
          <div className="bg-[#1A1A1A] p-5 rounded-lg shadow-md text-center border border-gray-800">
            <div className="flex justify-center mb-3">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-200">
              Weekly Reports
            </h3>
            <p className="text-2xl font-semibold text-white mt-2">
              {loading
                ? "Loading..."
                : error
                ? "Error"
                : reports.filter((r) => r.type === "Weekly").length}
            </p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Report Summary
          </h2>
          {loading || !currentTime ? (
            <p className="text-gray-400">Loading reports...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load reports</p>
          ) : filteredReports.length === 0 ? (
            <p className="text-gray-400">
              No reports found. Try adjusting your search.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3 text-gray-200 font-medium w-1/6">
                      Child
                    </th>
                    <th className="py-3 text-gray-200 font-medium w-1/6">
                      Parent
                    </th>
                    <th className="py-3 text-gray-200 font-medium w-1/6">
                      Type
                    </th>
                    <th className="py-3 text-gray-200 font-medium w-1/6">
                      Date
                    </th>
                    <th className="py-3 text-gray-200 font-medium w-2/6">
                      Health Metrics
                    </th>
                    <th className="py-3 text-gray-200 font-medium w-1/6">
                      AI Insight
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report, index) => (
                    <tr key={index} className="border-b border-gray-700 ">
                      <td className="py-3 text-gray-300 font-normal break-words">
                        {report.child}
                      </td>
                      <td className="py-3 text-gray-300 font-normal break-words">
                        {report.parent}
                      </td>
                      <td className="py-3 text-gray-300 font-normal break-words">
                        {report.type}
                      </td>
                      <td className="py-3 text-gray-300 font-normal break-words">
                        {report.date}
                      </td>
                      <td className="py-3 text-gray-300 font-normal break-words">
                        Heart Rate: {report.healthMetrics.heartRate}, Sleep:{" "}
                        {report.healthMetrics.sleep}, Behavior:{" "}
                        {report.healthMetrics.behavior}
                      </td>
                      <td className="py-3 text-gray-300 font-normal break-words">
                        {report.insight}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
