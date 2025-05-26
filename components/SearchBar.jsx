"use client";
import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
}) {
  return (
    <div className="relative w-full max-w-md mb-6">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full py-2 px-4 pr-10 bg-white text-[#2D3748] border border-[#FFE0B2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26A69A] placeholder-[#4A5568]"
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#4A5568]" />
    </div>
  );
}
