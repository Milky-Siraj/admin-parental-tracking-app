"use client";
import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-[#4A5568]">
        Showing {itemsPerPage} items per page
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? "bg-[#FFE0B2] text-[#4A5568] cursor-not-allowed"
              : "bg-[#FFF8E1] text-[#2D3748] hover:bg-[#FFE0B2]"
          }`}
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? "bg-[#26A69A] text-white"
                : "bg-[#FFF8E1] text-[#2D3748] hover:bg-[#FFE0B2]"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? "bg-[#FFE0B2] text-[#4A5568] cursor-not-allowed"
              : "bg-[#FFF8E1] text-[#2D3748] hover:bg-[#FFE0B2]"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
} 