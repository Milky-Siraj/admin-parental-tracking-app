"use client";
import React, { useState } from "react";
import { DollarSign } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

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
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 ml-0 lg:ml-72 p-8">
        <h1 className="text-3xl font-semibold text-gray-100 mb-4">
          Admin - Payments
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          Manage payment transactions for parents and therapists as of 05:56 PM
          EAT, May 20, 2025
        </p>

        <SearchBar placeholder="Search payments..." />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1A1A1A] p-5 rounded-lg shadow-md text-center border border-gray-800">
            <div className="flex justify-center mb-3">
              <DollarSign className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-200">
              Total Parent Payments
            </h3>
            <p className="text-2xl font-semibold text-white mt-2">$150</p>
          </div>
          <div className="bg-[#1A1A1A] p-5 rounded-lg shadow-md text-center border border-gray-800">
            <div className="flex justify-center mb-3">
              <DollarSign className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-200">
              Total Therapist Earnings
            </h3>
            <p className="text-2xl font-semibold text-white mt-2">$150</p>
          </div>
          <div className="bg-[#1A1A1A] p-5 rounded-lg shadow-md text-center border border-gray-800">
            <div className="flex justify-center mb-3">
              <DollarSign className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-200">
              Total System Earnings
            </h3>
            <p className="text-2xl font-semibold text-white mt-2">
              ${totalSystemEarnings}
            </p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Payment Breakdown Visualization
          </h2>
          <div className="h-64">
            <Bar data={paymentBreakdownData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Parent Payment Summary
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Parents can book up to 5 appointments per month for free. Additional
            appointments are charged $50 each. System deducts 2% as a fee.
          </p>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 text-gray-200 font-medium">Parent</th>
                <th className="py-3 text-gray-200 font-medium">Booked</th>
                <th className="py-3 text-gray-200 font-medium">Paid ($)</th>
                <th className="py-3 text-gray-200 font-medium">
                  System Fee ($)
                </th>
                <th className="py-3 text-gray-200 font-medium">Net ($)</th>
                <th className="py-3 text-gray-200 font-medium">Month</th>
                <th className="py-3 text-gray-200 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {parentPayments.map((payment, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
                >
                  <td className="py-3 text-gray-300">{payment.parent}</td>
                  <td className="py-3 text-gray-300">{payment.booked}</td>
                  <td className="py-3 text-gray-300">{payment.paid}</td>
                  <td className="py-3 text-gray-300">{payment.systemFee}</td>
                  <td className="py-3 text-gray-300">{payment.net}</td>
                  <td className="py-3 text-gray-300">{payment.month}</td>
                  <td className="py-3 text-gray-300">{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Therapist Payment Summary
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Therapists are paid $50 per appointment after completing 5 free
            appointments per month. System deducts 2% on withdrawals.
          </p>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 text-gray-200 font-medium">Therapist</th>
                <th className="py-3 text-gray-200 font-medium">Completed</th>
                <th className="py-3 text-gray-200 font-medium">Earned ($)</th>
                <th className="py-3 text-gray-200 font-medium">
                  System Fee ($)
                </th>
                <th className="py-3 text-gray-200 font-medium">
                  Withdrawn ($)
                </th>
                <th className="py-3 text-gray-200 font-medium">
                  Net Withdrawn ($)
                </th>
                <th className="py-3 text-gray-200 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {therapistPayments.map((payment, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
                >
                  <td className="py-3 text-gray-300">{payment.therapist}</td>
                  <td className="py-3 text-gray-300">{payment.completed}</td>
                  <td className="py-3 text-gray-300">{payment.earned}</td>
                  <td className="py-3 text-gray-300">
                    {payment.systemFeeOnWithdraw}
                  </td>
                  <td className="py-3 text-gray-300">{payment.withdrawn}</td>
                  <td className="py-3 text-gray-300">{payment.netWithdrawn}</td>
                  <td className="py-3 text-gray-300">{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
