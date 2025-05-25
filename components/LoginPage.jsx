"use client";
import React, { useState } from "react";
import { BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", {
      email,
      timestamp: new Date().toISOString(),
    });
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error("JSON parsing error:", {
          message: jsonError.message,
          status: res.status,
          statusText: res.statusText,
        });
        throw new Error("Server error: Invalid response format");
      }

      console.log("API response:", { status: res.status, data });

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("Login successful:", data);
      router.push("/dashboard");
    } catch (err) {
      // console.error("Login error:", { message: err.message, email });
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    console.log("Email input changed:", { value: e.target.value });
    setEmail(e.target.value);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0d0e2b] to-[#0a0b1f]">
      <div className="bg-black rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <BrainCircuit className="h-12 w-12 text-indigo-500" />
        </div>

        <h2 className="text-white text-2xl font-semibold text-center mb-1">
          Admin Login
        </h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Enter your email and password to access the admin dashboard as of 7:20
          AM EAT, May 22, 2025
        </p>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">
            {error}
            <button
              onClick={resetForm}
              className="ml-2 text-indigo-500 underline text-sm"
            >
              Try again
            </button>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
