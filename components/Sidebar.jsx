"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  Home,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Therapists", href: "/dashboard/therapists", icon: Users },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Parent", href: "/dashboard/parent", icon: Users },
  { name: "Payments", href: "/dashboard/payments", icon: MessageSquare },
];

function className(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ open, setOpen }) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={className(
          "fixed inset-0 z-50 bg-gray-900/80 lg:hidden",
          open ? "block" : "hidden"
        )}
        onClick={() => setOpen(false)}
      />

      <div
        className={className(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 lg:block",
          open ? "block" : "hidden"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center border-b border-gray-200 dark:border-gray-800 px-6">
            <BrainCircuit className="h-8 w-8 text-indigo-500" />
            <span className="ml-3 text-xl font-semibold">Admin Portal</span>
            <button
              type="button"
              className="ml-auto lg:hidden"
              onClick={() => setOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={className(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
