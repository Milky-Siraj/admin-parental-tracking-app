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
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 ml-0 lg:ml-72 p-8">
        <h1 className="text-3xl font-semibold text-gray-100 mb-6">Users</h1>
        <p className="text-gray-400 mb-8 text-sm">
          Manage and monitor all users in the system
        </p>

        {error && <div className="text-red-500 mb-4">Error: {error}</div>}

        <div className="bg-[#1A1A1A] p-4 rounded-lg mt-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-300">All Users</h2>
            <p className="text-sm text-gray-400">
              Monitor user activity and roles in the system.
            </p>
          </div>
          <SearchBar
            placeholder="Search by name, email, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading ? (
            <p className="text-gray-400 mt-4">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-gray-400 mt-4">No users found.</p>
          ) : (
            <>
              <table className="w-full text-left mt-4">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-4 text-gray-200 font-medium">User</th>
                    <th className="py-4 text-gray-200 font-medium">Role</th>
                    <th className="py-4 text-gray-200 font-medium">Status</th>
                    <th className="py-4 text-gray-200 font-medium">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
                    >
                      <td className="py-4 text-gray-300">
                        {user.user}
                        <div className="text-gray-400 text-sm">{user.email}</div>
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-gray-600 text-white rounded-full text-sm">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            user.status === "Active"
                              ? "bg-green-600"
                              : "bg-yellow-600"
                          } text-white`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400 text-sm">
                        {user.createdAt}
                      </td>
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
