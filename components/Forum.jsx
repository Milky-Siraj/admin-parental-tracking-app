"use client";
import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Montserrat } from "next/font/google";
import SearchBar from "@/components/SearchBar";
// Initialize Montserrat font
const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export default function Forum() {
  const [open, setOpen] = useState(false);

  const posts = [
    {
      title: "Tips for Managing Meltdowns",
      author: "Sarah Thompson",
      date: "May 19, 2025",
      replies: 5,
    },
    {
      title: "Best Foods for Sensory Issues",
      author: "Jane Doe",
      date: "May 18, 2025",
      replies: 3,
    },
    {
      title: "Therapy Techniques for Communication",
      author: "Dr. Emily Rodriguez",
      date: "May 17, 2025",
      replies: 8,
    },
  ];

  return (
    <div
      className={`flex min-h-screen bg-white text-gray-800 ${montserrat.className}`}
    >
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 ml-0 lg:ml-72 p-8">
        <h1 className="text-3xl font-semibold text-[#2D3748] mb-6">Forum</h1>
        <p className="text-[#4A5568] mb-8 text-sm">
          Monitor community discussions as of 01:48 PM EAT, May 20, 2025
        </p>
        <SearchBar placeholder="Search forum..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#FFF8E1] p-5 rounded-lg shadow-md text-center border border-[#FFE0B2]">
            <div className="flex justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-[#26A69A]" />
            </div>
            <h3 className="text-lg font-medium text-[#2D3748]">Total Posts</h3>
            <p className="text-2xl font-semibold text-[#26A69A] mt-2">3</p>
          </div>
          <div className="bg-[#FFF8E1] p-5 rounded-lg shadow-md text-center border border-[#FFE0B2]">
            <div className="flex justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-[#26A69A]" />
            </div>
            <h3 className="text-lg font-medium text-[#2D3748]">Total Replies</h3>
            <p className="text-2xl font-semibold text-[#26A69A] mt-2">16</p>
          </div>
        </div>

        <div className="bg-[#FFF8E1] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#2D3748] mb-4">
            Recent Posts
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#FFE0B2]">
                <th className="py-3 text-[#2D3748] font-medium">Title</th>
                <th className="py-3 text-[#2D3748] font-medium">Author</th>
                <th className="py-3 text-[#2D3748] font-medium">Date</th>
                <th className="py-3 text-[#2D3748] font-medium">Replies</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr
                  key={index}
                  className="border-b border-[#FFE0B2] hover:bg-[#FFE0B2] transition duration-200"
                >
                  <td className="py-3 text-[#4A5568]">{post.title}</td>
                  <td className="py-3 text-[#4A5568]">{post.author}</td>
                  <td className="py-3 text-[#4A5568]">{post.date}</td>
                  <td className="py-3 text-[#4A5568]">{post.replies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
