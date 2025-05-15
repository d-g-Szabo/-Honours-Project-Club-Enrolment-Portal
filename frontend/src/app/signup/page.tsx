"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<'user' | 'club'>("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const res = await register({ full_name: name, email, password, type });
      console.log(res);
      if (res?.user) {
        // Assuming the API returns a user object on successful registration
        // show the user to verity the account 
        setSuccess("Account created successfully. Please verify your email.");
      } else {
        setError("Invalid response from server");
      }
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-24 p-8 bg-white rounded-lg shadow animate-fade-in">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={e => setName(e.target.value)}
        />
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
        <select
          className="w-full border rounded px-3 py-2"
          value={type}
          onChange={e => setType(e.target.value as 'user' | 'club')}
        >
          <option value="user">User</option>
          <option value="club">Club</option>
        </select>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}
        <Button className="w-full transition-transform hover:scale-110 bg-gray-500 text-white" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
      <div className="text-center mt-4">
        <Link href="/login" className="text-primary hover:underline">Already have an account? Login</Link>
      </div>
    </div>
  );
} 