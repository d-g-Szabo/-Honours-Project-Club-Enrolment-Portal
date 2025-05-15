"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { forgotPassword } from "@/lib/api";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      setSuccess(response.message || "Reset link sent to your email");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-24 p-8 bg-white rounded-lg shadow animate-fade-in">
      <h1 className="text-2xl font-bold mb-4 text-center">Forgot Password</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <Button className="w-full transition-transform hover:scale-110 bg-gray-500 text-white" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
        <div className="text-center mt-4">
          <Link href="/login" className="text-primary hover:underline">Back to login!</Link>
        </div>
      </form>
    </div>
  );
} 