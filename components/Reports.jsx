"use client";
import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { format } from "date-fns";
import Pagination from "@/components/Pagination";

export default function Reports() {
  const [open, setOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 ml-0 lg:ml-72 p-8">
        <h1 className="text-3xl font-semibold text-[#2D3748] mb-6">Reports</h1>
        <p className="text-[#4A5568] mb-8 text-sm">
          View and analyze generated reports as of {currentTime || "Loading..."}
        </p>

        {error && <div className="text-[#FF8A80] mb-4">Error: {error}</div>}

        <SearchBar
          placeholder="Search by child, parent, type, date, or metrics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#FFF8E1] p-5 rounded-lg shadow-md text-center border border-[#FFE0B2]">
            <div className="flex justify-center mb-3">
              <FileText className="h-6 w-6 text-[#26A69A]" />
            </div>
            <h3 className="text-lg font-medium text-[#2D3748]">Daily Reports</h3>
            <p className="text-2xl font-semibold text-[#26A69A] mt-2">
              {loading
                ? "Loading..."
                : error
                ? "Error"
                : reports.filter((r) => r.type === "Daily").length}
            </p>
          </div>
          <div className="bg-[#FFF8E1] p-5 rounded-lg shadow-md text-center border border-[#FFE0B2]">
            <div className="flex justify-center mb-3">
              <FileText className="h-6 w-6 text-[#26A69A]" />
            </div>
            <h3 className="text-lg font-medium text-[#2D3748]">
              Weekly Reports
            </h3>
            <p className="text-2xl font-semibold text-[#26A69A] mt-2">
              {loading
                ? "Loading..."
                : error
                ? "Error"
                : reports.filter((r) => r.type === "Weekly").length}
            </p>
          </div>
        </div>

        <div className="bg-[#FFF8E1] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#2D3748] mb-4">
            Health Reports
          </h2>
          {loading ? (
            <p className="text-[#4A5568]">Loading reports...</p>
          ) : error ? (
            <p className="text-[#FF8A80]">Failed to load reports</p>
          ) : reports.length === 0 ? (
            <p className="text-[#4A5568]">No reports found</p>
          ) : (
            <>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#FFE0B2]">
                    <th className="py-3 text-[#2D3748] font-medium">Child</th>
                    <th className="py-3 text-[#2D3748] font-medium">Parent</th>
                    <th className="py-3 text-[#2D3748] font-medium">Type</th>
                    <th className="py-3 text-[#2D3748] font-medium">Date</th>
                    <th className="py-3 text-[#2D3748] font-medium">Metrics</th>
                    <th className="py-3 text-[#2D3748] font-medium">Insight</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((report, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#FFE0B2] hover:bg-[#FFE0B2] transition duration-200"
                    >
                      <td className="py-3 text-[#4A5568]">{report.child}</td>
                      <td className="py-3 text-[#4A5568]">{report.parent}</td>
                      <td className="py-3 text-[#4A5568]">{report.type}</td>
                      <td className="py-3 text-[#4A5568]">{report.date}</td>
                      <td className="py-3 text-[#4A5568]">
                        <div className="space-y-1">
                          <p>Heart Rate: {report.healthMetrics.heartRate}</p>
                          <p>Sleep: {report.healthMetrics.sleep}</p>
                          <p>Behavior: {report.healthMetrics.behavior}</p>
                        </div>
                      </td>
                      <td className="py-3 text-[#4A5568]">{report.insight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
