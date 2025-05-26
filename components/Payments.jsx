"use client";
import React, { useState } from "react";
import { DollarSign, MessageSquare } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Payments() {
  const [open, setOpen] = useState(false);
  const [parentPayments, setParentPayments] = useState([
    {
      parent: "Sarah Thompson",
      booked: 6,
      paid: 50,
      systemFee: 1,
      net: 49,
      month: "May 2025",
      status: "Paid",
    },
    {
      parent: "Jane Doe",
      booked: 4,
      paid: 0,
      systemFee: 0,
      net: 0,
      month: "May 2025",
      status: "Within Limit",
    },
    {
      parent: "Michael Chen",
      booked: 7,
      paid: 100,
      systemFee: 2,
      net: 98,
      month: "May 2025",
      status: "Paid",
    },
  ]);
  const [therapistPayments, setTherapistPayments] = useState([
    {
      therapist: "Dr. Sarah Johnson",
      completed: 6,
      earned: 50,
      systemFeeOnWithdraw: 1,
      withdrawn: 0,
      netWithdrawn: 0,
      month: "May 2025",
      status: "Eligible",
    },
    {
      therapist: "Dr. Michael Chen",
      completed: 3,
      earned: 0,
      systemFeeOnWithdraw: 0,
      withdrawn: 0,
      netWithdrawn: 0,
      month: "May 2025",
      status: "Not Eligible",
    },
    {
      therapist: "Dr. Emily Rodriguez",
      completed: 7,
      earned: 100,
      systemFeeOnWithdraw: 1,
      withdrawn: 50,
      netWithdrawn: 49,
      month: "May 2025",
      status: "Eligible",
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTherapistPage, setCurrentTherapistPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination for parent payments
  const totalParentPages = Math.ceil(parentPayments.length / itemsPerPage);
  const indexOfLastParentItem = currentPage * itemsPerPage;
  const indexOfFirstParentItem = indexOfLastParentItem - itemsPerPage;
  const currentParentItems = parentPayments.slice(
    indexOfFirstParentItem,
    indexOfLastParentItem
  );

  // Calculate pagination for therapist payments
  const totalTherapistPages = Math.ceil(therapistPayments.length / itemsPerPage);
  const indexOfLastTherapistItem = currentTherapistPage * itemsPerPage;
  const indexOfFirstTherapistItem = indexOfLastTherapistItem - itemsPerPage;
  const currentTherapistItems = therapistPayments.slice(
    indexOfFirstTherapistItem,
    indexOfLastTherapistItem
  );

  const handleParentPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTherapistPageChange = (pageNumber) => {
    setCurrentTherapistPage(pageNumber);
  };

  // Calculate total system earnings (sum of fees from parents and therapists)
  const totalSystemEarnings =
    parentPayments.reduce((sum, p) => sum + p.systemFee, 0) +
    therapistPayments.reduce((sum, t) => sum + t.systemFeeOnWithdraw, 0);

  // Data for visualizing payment breakdown
  const paymentBreakdownData = {
    labels: [
      "Parent Payments",
      "System Fee (Parents)",
      "Therapist Earnings",
      "System Fee (Therapists)",
    ],
    datasets: [
      {
        label: "Amount ($)",
        data: [
          parentPayments.reduce((sum, p) => sum + p.paid, 0), // Total parent payments
          parentPayments.reduce((sum, p) => sum + p.systemFee, 0), // Total parent system fees
          therapistPayments.reduce((sum, t) => sum + t.earned, 0), // Total therapist earnings
          therapistPayments.reduce((sum, t) => sum + t.systemFeeOnWithdraw, 0), // Total therapist system fees
        ],
        backgroundColor: ["#4B5EFC", "#EF4444", "#10B981", "#F59E0B"],
        borderColor: ["#4B5EFC", "#EF4444", "#10B981", "#F59E0B"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#D1D5DB" } },
      title: { display: true, text: "Payment Breakdown", color: "#D1D5DB" },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#D1D5DB" } },
      x: { ticks: { color: "#D1D5DB" } },
    },
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 ml-0 lg:ml-72 p-8">
        <h1 className="text-3xl font-semibold text-[#2D3748] mb-6">Payments</h1>
        <p className="text-[#4A5568] mb-8 text-sm">
          Monitor and manage payment transactions
        </p>

        <SearchBar placeholder="Search payments..." />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#FFF8E1] p-5 rounded-lg shadow-md text-center border border-[#FFE0B2]">
            <div className="flex justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-[#26A69A]" />
            </div>
            <h3 className="text-lg font-medium text-[#2D3748]">
              Total Parent Payments
            </h3>
            <p className="text-2xl font-semibold text-[#26A69A] mt-2">
              ${parentPayments.reduce((sum, p) => sum + p.paid, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-[#FFF8E1] p-5 rounded-lg shadow-md text-center border border-[#FFE0B2]">
            <div className="flex justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-[#26A69A]" />
            </div>
            <h3 className="text-lg font-medium text-[#2D3748]">
              Total Therapist Earnings
            </h3>
            <p className="text-2xl font-semibold text-[#26A69A] mt-2">
              ${therapistPayments.reduce((sum, t) => sum + t.earned, 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#FFF8E1] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-[#2D3748] mb-4">
              Parent Payments
            </h2>
            <div className="h-64">
              {loading ? (
                <p className="text-[#4A5568] text-center h-full flex items-center justify-center">
                  Loading...
                </p>
              ) : (
                <Bar data={parentPaymentData} options={chartOptions} />
              )}
            </div>
          </div>
          <div className="bg-[#FFF8E1] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-[#2D3748] mb-4">
              Therapist Earnings
            </h2>
            <div className="h-64">
              {loading ? (
                <p className="text-[#4A5568] text-center h-full flex items-center justify-center">
                  Loading...
                </p>
              ) : (
                <Bar data={therapistPaymentData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#FFF8E1] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#2D3748] mb-4">
            Payment Breakdown
          </h2>
          <div className="h-64">
            {loading ? (
              <p className="text-[#4A5568] text-center h-full flex items-center justify-center">
                Loading...
              </p>
            ) : (
              <Pie data={paymentBreakdownData} options={chartOptions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
