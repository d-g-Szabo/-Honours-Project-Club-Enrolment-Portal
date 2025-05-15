"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.access_token) {
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("user", JSON.stringify(res.user));
        router.push("/dashboard");
      } else {
        setError("Invalid response from server");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-24 p-8 bg-white rounded-lg shadow animate-fade-in">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button className="w-full transition-transform hover:scale-110 bg-gray-500 text-white" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <div className="text-center mt-4">
        <Link href="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
      </div>
      <div className="text-center mt-4">
        <Link href="/signup" className="text-primary hover:underline">Don't have an account? Sign Up!</Link>
      </div>
    </div>
  );
} 