"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Montserrat } from "next/font/google";
import SearchBar from "@/components/SearchBar";
import { format } from "date-fns";

// Initialize Montserrat font
const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export default function ParentsList() {
  const [open, setOpen] = useState(false);
  const [parents, setParents] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  useEffect(() => {
    async function fetchParents() {
      try {
        const response = await fetch("/api/parents", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch parents");
        const data = await response.json();
        setParents(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    }
    fetchParents();
    setCurrentTime(format(new Date(), "hh:mm a 'EAT', MMMM d, yyyy"));
  }, []);

  const toggleRow = (parentId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  // Filter parents based on search term
  const filteredParents = parents.filter((parent) => {
    const searchLower = searchTerm.toLowerCase();
    // Check parent fields
    const matchesParent =
      parent.firstName.toLowerCase().includes(searchLower) ||
      parent.lastName.toLowerCase().includes(searchLower) ||
      parent.email.toLowerCase().includes(searchLower) ||
      parent.role.toLowerCase().includes(searchLower);

    // Check child fields
    const matchesChild = parent.children.some(
      (child) =>
        child.firstName.toLowerCase().includes(searchLower) ||
        child.lastName.toLowerCase().includes(searchLower) ||
        child.gender.toLowerCase().includes(searchLower) ||
        child.dateOfBirth.toLowerCase().includes(searchLower) ||
        child.healthMetrics.heartRate.toString().includes(searchLower) ||
        child.healthMetrics.sleep.toString().includes(searchLower) ||
        child.healthMetrics.behavior.toString().includes(searchLower)
    );

    return matchesParent || matchesChild;
  });

  return (
    <div
      className={`flex min-h-screen bg-gray-900 text-white ${montserrat.className}`}
    >
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 ml-0 lg:ml-72 p-8">
        <h1 className="text-3xl font-semibold text-gray-100 mb-6">
          Parents List
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          View all parents and their children as of{" "}
          {currentTime || "Loading..."}
        </p>

        {error && <div className="text-red-500 mb-4">Error: {error}</div>}

        <SearchBar
          placeholder="Search by parent, email, role, or child details..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Parents Overview
          </h2>
          {loading || !currentTime ? (
            <p className="text-gray-400">Loading parents...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load parents</p>
          ) : filteredParents.length === 0 ? (
            <p className="text-gray-400">
              No parents found. Try adjusting your search.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3 text-gray-200 font-medium w-1/5">
                      Parent Name
                    </th>
                    <th className="py-3 text-gray-200 font-medium w-2/5">
                      Email
                    </th>
                    <th className="py-3 text-gray-200 font-medium w-1/5">
                      Role
                    </th>
                    <th className="py-3 text-gray-200 font-medium w-1/5">
                      Number of Children
                    </th>
                    <th className="py-3 text-gray-200 font-medium w-1/10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParents.map((parent) => (
                    <React.Fragment key={parent.id}>
                      <tr
                        className="border-b border-gray-700 hover:bg-gray-800 transition duration-200 cursor-pointer"
                        onClick={() => toggleRow(parent.id)}
                      >
                        <td className="py-3 text-gray-300 font-normal break-words">
                          {parent.firstName} {parent.lastName}
                        </td>
                        <td className="py-3 text-gray-300 font-normal break-words">
                          {parent.email}
                        </td>
                        <td className="py-3 text-gray-300 font-normal break-words">
                          {parent.role}
                        </td>
                        <td className="py-3 text-gray-300 font-normal break-words">
                          {parent.children.length}
                        </td>
                        <td className="py-3 text-gray-300 font-normal break-words">
                          {expandedRows[parent.id] ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </td>
                      </tr>
                      {expandedRows[parent.id] && (
                        <tr>
                          <td colSpan="5" className="p-0">
                            <div className="bg-gray-800 p-4">
                              <h3 className="text-lg font-medium text-gray-200 mb-3">
                                Children of {parent.firstName} {parent.lastName}
                              </h3>
                              {parent.children.length === 0 ? (
                                <p className="text-gray-400">
                                  No children found
                                </p>
                              ) : (
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="border-b border-gray-700">
                                      <th className="py-2 text-gray-200 font-medium w-1/5">
                                        Child Name
                                      </th>
                                      <th className="py-2 text-gray-200 font-medium w-1/5">
                                        Gender
                                      </th>
                                      <th className="py-2 text-gray-200 font-medium w-1/5">
                                        Date of Birth
                                      </th>
                                      <th className="py-2 text-gray-200 font-medium w-2/5">
                                        Latest Health Metrics
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {parent.children.map((child) => (
                                      <tr
                                        key={child.id}
                                        className="border-b border-gray-700 hover:bg-gray-700 transition duration-200"
                                      >
                                        <td className="py-2 text-gray-300 font-normal break-words">
                                          {child.firstName} {child.lastName}
                                        </td>
                                        <td className="py-2 text-gray-300 font-normal break-words">
                                          {child.gender}
                                        </td>
                                        <td className="py-2 text-gray-300 font-normal break-words">
                                          {child.dateOfBirth}
                                        </td>
                                        <td className="py-2 text-gray-300 font-normal break-words">
                                          Heart Rate:{" "}
                                          {child.healthMetrics.heartRate},
                                          Sleep: {child.healthMetrics.sleep},
                                          Behavior:{" "}
                                          {child.healthMetrics.behavior}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
