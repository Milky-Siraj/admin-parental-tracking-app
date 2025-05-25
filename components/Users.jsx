"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";

export default function Users() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.status}`);
        }
        const data = await res.json();
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

  const filteredUsers = users.filter(
    (user) =>
      user.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.createdAt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-900 pt-20 text-white">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex-1 ml-0 lg:ml-72 p-6">
        <h1 className="text-2xl font-semibold text-gray-100">Users</h1>
        <p className="text-sm text-gray-400 mt-2">
          Manage and monitor all users as of 1:38 AM EAT, May 22, 2025
        </p>
        {error && <div className="text-red-500 mt-4 mb-4">Error: {error}</div>}
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
                {filteredUsers.map((user) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
