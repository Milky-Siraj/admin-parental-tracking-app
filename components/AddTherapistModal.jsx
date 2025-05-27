"use client";
import React, { useState } from "react";

export default function AddTherapistModal({ isOpen, onClose, onAddTherapist }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "", // Added phone_number to state
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (file && !file.name.match(/\.(pdf|png|jpg|jpeg)$/i)) {
      setError("Please upload a PDF, PNG, or JPG file.");
      return;
    }
    // Add basic phone number validation (e.g., at least 7 digits, allowing international formats)
    if (!/^\+?[1-9]\d{6,14}$/.test(formData.phone_number)) {
      setError("Please enter a valid phone number (e.g., +1234567890).");
      return;
    }

    try {
      const data = new FormData();
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("email", formData.email);
      data.append("phone_number", formData.phone_number); // Added phone_number to FormData
      if (file) {
        data.append("edu_document", file);
      }

      await onAddTherapist(data);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "", // Reset phone_number
      });
      setFile(null);
      onClose();
    } catch (err) {
      setError(
        err.message.includes("Only PDF, PNG, or JPG files")
          ? "Please upload a valid PDF, PNG, or JPG file."
          : err.message.includes("Missing required fields")
          ? "Please fill in all required fields."
          : err.message || "Failed to add therapist."
      );
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-[#1A1A1A] p-6 rounded-lg text-white w-full max-w-md">
        <h2 id="modal-title" className="text-xl font-semibold mb-4">
          Add New Therapist
        </h2>
        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-gray-300 mb-1">
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-indigo-500"
              required
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-gray-300 mb-1">
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone_number" className="block text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              id="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              placeholder="+1234567890"
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="edu_document" className="block text-gray-300 mb-1">
              Educational Document (PDF, PNG, JPG)
            </label>
            <input
              id="edu_document"
              type="file"
              accept="application/pdf,image/png,image/jpeg"
              onChange={handleFileChange}
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-600 text-white rounded mr-2 hover:bg-gray-500 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition duration-200"
            >
              Add Therapist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
