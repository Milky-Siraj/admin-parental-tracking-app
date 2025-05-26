"use client";
import React, { useState, useEffect } from "react";
import { Users as UsersIcon } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

export default function Users() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        console.log("Fetched users:", data);
        if (!Array.isArray(data)) {
          throw new Error("Users response is not an array");
        }
        const mappedUsers = data.map((user) => ({
          id: user.id,
          user:
            `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
            "Unknown",
          email: user.email || "N/A",
          role:
            user.role.charAt(0).toUpperCase() + user.role.slice(1) || "Unknown",
          status: user.admin_approved ? "Active" : "Pending",
          createdAt: user.date_joined
            ? new Date(user.date_joined).toLocaleString("en-US", {
                dateStyle: "short",
                timeStyle: "short",
              })
            : "N/A",
        }));
        console.log("Mapped users:", mappedUsers);
        setUsers(mappedUsers);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    }
    fetchUsers();
    setCurrentTime(
      new Date().toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Africa/Nairobi",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.user.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      user.status.toLowerCase().includes(searchLower)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 ml-0 lg:ml-72 p-8">
        <h1 className="text-3xl font-semibold text-[#2D3748] mb-6">Users</h1>
        <p className="text-[#4A5568] mb-8 text-sm">
          Manage and monitor all users as of {currentTime || "Loading..."}
        </p>

        {error && <div className="text-[#FF8A80] mb-4">Error: {error}</div>}

        <SearchBar
          placeholder="Search by name, email, role, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="bg-[#FFF8E1] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#2D3748] mb-4">
            User List
          </h2>
          {loading ? (
            <p className="text-[#4A5568]">Loading users...</p>
          ) : error ? (
            <p className="text-[#FF8A80]">Failed to load users</p>
          ) : users.length === 0 ? (
            <p className="text-[#4A5568]">No users found</p>
          ) : (
            <>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#FFE0B2]">
                    <th className="py-3 text-[#2D3748] font-medium">Name</th>
                    <th className="py-3 text-[#2D3748] font-medium">Email</th>
                    <th className="py-3 text-[#2D3748] font-medium">Role</th>
                    <th className="py-3 text-[#2D3748] font-medium">Status</th>
                    <th className="py-3 text-[#2D3748] font-medium">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#FFE0B2] hover:bg-[#FFE0B2] transition duration-200"
                    >
                      <td className="py-3 text-[#4A5568]">{user.user}</td>
                      <td className="py-3 text-[#4A5568]">{user.email}</td>
                      <td className="py-3 text-[#4A5568]">{user.role}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            user.status === "Active"
                              ? "bg-[#81C784]"
                              : "bg-[#FFB74D]"
                          } text-white`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 text-[#4A5568]">{user.createdAt}</td>
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
