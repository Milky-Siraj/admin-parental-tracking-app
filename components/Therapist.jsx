"use client";
import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import AddTherapistModal from "@/components/AddTherapistModal";
import Pagination from "@/components/Pagination";

export default function Therapists() {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updating, setUpdating] = useState({});
  const [currentTime, setCurrentTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchTherapists() {
      try {
        const res = await fetch("/api/therapist", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to fetch therapists: ${res.status}`);
        }
        const data = await res.json();
        console.log("Therapists data:", data);
        if (!Array.isArray(data)) {
          throw new Error("Therapists response is not an array");
        }
        setTherapists(
          data.map((t) => ({
            id: t.id,
            name: `${t.first_name} ${t.last_name}`,
            email: t.email,
            credentials: t.edu_document || "N/A",
            status: t.admin_approved ? "Active" : "Pending",
            admin_approved: t.admin_approved,
          }))
        );
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    }
    fetchTherapists();
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

  const handleAddTherapist = async (formData) => {
    try {
      const res = await fetch("/api/therapist", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || `Failed to add therapist: ${res.status}`
        );
      }
      const addedTherapist = await res.json();
      setTherapists([
        ...therapists,
        {
          id: addedTherapist.id,
          name: `${addedTherapist.first_name} ${addedTherapist.last_name}`,
          email: addedTherapist.email,
          credentials: addedTherapist.edu_document || "N/A",
          status: "Pending",
          admin_approved: false,
        },
      ]);
    } catch (err) {
      console.error("Add therapist error:", err);
      setError(err.message);
      throw err;
    }
  };

  const handleUpdateStatus = async (id, admin_approved) => {
    try {
      setUpdating((prev) => ({ ...prev, [id]: true }));
      const res = await fetch("/api/therapist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, admin_approved }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || `Failed to update status: ${res.status}`
        );
      }
      const updated = await res.json();
      setTherapists(
        therapists.map((t) =>
          t.id === id
            ? {
                ...t,
                admin_approved: updated.admin_approved,
                status: updated.admin_approved ? "Active" : "Pending",
              }
            : t
        )
      );
    } catch (err) {
      console.error("Update status error:", err);
      setError(err.message);
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredTherapists = therapists.filter((t) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      t.name.toLowerCase().includes(searchLower) ||
      t.email.toLowerCase().includes(searchLower) ||
      t.status.toLowerCase().includes(searchLower)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTherapists.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTherapists.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex-1 ml-0 lg:ml-72 p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-[#2D3748]">Therapists</h1>
          {/* <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-4 bg-[#26A69A] text-white rounded-lg hover:bg-[#4DB6AC] transition duration-200"
          >
            Add Therapist
          </button> */}
        </div>
        <p className="text-[#4A5568] mb-6 text-sm">
          Manage and monitor all therapists as of {currentTime || "Loading..."}
        </p>
        {error && <div className="text-[#FF8A80] mb-4">Error: {error}</div>}
        <SearchBar
          placeholder="Search by name, email, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#FFF8E1] p-5 rounded-lg shadow-md text-center border border-[#FFE0B2]">
            <div className="flex justify-center mb-3">
              <Users className="h-6 w-6 text-[#26A69A]" />
            </div>
            <h3 className="text-lg font-medium text-[#2D3748]">
              Total Therapists
            </h3>
            <p className="text-2xl font-semibold text-[#26A69A] mt-2">
              {loading ? "Loading..." : therapists.length}
            </p>
          </div>
          <div className="bg-[#FFF8E1] p-5 rounded-lg shadow-md text-center border border-[#FFE0B2]">
            <div className="flex justify-center mb-3">
              <Users className="h-6 w-6 text-[#26A69A]" />
            </div>
            <h3 className="text-lg font-medium text-[#2D3748]">
              Active Therapists
            </h3>
            <p className="text-2xl font-semibold text-[#26A69A] mt-2">
              {loading
                ? "Loading..."
                : therapists.filter((t) => t.status === "Active").length}
            </p>
          </div>
        </div>
        <div className="bg-[#FFF8E1] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#2D3748] mb-4">
            Therapist List
          </h2>
          {loading ? (
            <p className="text-[#4A5568]">Loading therapists...</p>
          ) : filteredTherapists.length === 0 ? (
            <p className="text-[#4A5568]">
              No therapists found. Try adjusting your search.
            </p>
          ) : (
            <>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#FFE0B2]">
                    <th className="py-3 text-[#2D3748] font-medium">Name</th>
                    <th className="py-3 text-[#2D3748] font-medium">Email</th>
                    <th className="py-3 text-[#2D3748] font-medium">
                      Educational Document
                    </th>
                    <th className="py-3 text-[#2D3748] font-medium">Status</th>
                    <th className="py-3 text-[#2D3748] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((therapist, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#FFE0B2] hover:bg-[#FFE0B2] transition duration-200"
                    >
                      <td className="py-3 text-[#4A5568]">{therapist.name}</td>
                      <td className="py-3 text-[#4A5568]">{therapist.email}</td>
                      <td className="py-3 text-[#4A5568]">
                        {therapist.credentials !== "N/A" ? (
                          <span className="flex items-center">
                            <a
                              href="https://res.cloudinary.com/dljcttiew/raw/upload/v1748311054/pending_/ihzyemojv1xzoteqxsy1.png"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#26A69A] hover:underline"
                            >
                              View Document
                            </a>
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            therapist.status === "Active"
                              ? "bg-[#81C784]"
                              : "bg-[#FFB74D]"
                          } text-white`}
                        >
                          {therapist.status}
                        </span>
                      </td>
                      <td className="py-3 flex space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(therapist.id, true)}
                          disabled={
                            updating[therapist.id] || therapist.admin_approved
                          }
                          className={`py-1 px-3 rounded text-sm ${
                            therapist.admin_approved
                              ? "bg-[#4A5568] cursor-not-allowed"
                              : "bg-[#81C784] hover:bg-[#4DB6AC]"
                          } text-white transition duration-200`}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(therapist.id, false)
                          }
                          disabled={
                            updating[therapist.id] || !therapist.admin_approved
                          }
                          className={`py-1 px-3 rounded text-sm ${
                            !therapist.admin_approved
                              ? "bg-[#4A5568] cursor-not-allowed"
                              : "bg-[#FF8A65] hover:bg-[#FF8A80]"
                          } text-white transition duration-200`}
                        >
                          Reject
                        </button>
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
        {/* <AddTherapistModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTherapist={handleAddTherapist}
        /> */}
      </div>
    </div>
  );
}
