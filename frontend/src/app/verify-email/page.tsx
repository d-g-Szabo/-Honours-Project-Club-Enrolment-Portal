"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/lib/api";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("access_token");
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the URL.");
      return;
    }
    setStatus("verifying");
    verifyEmail(token)
      .then(() => {
        setStatus("success");
        setMessage("Your email has been verified successfully! You can now log in.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Verification failed. Please try again or contact support.");
      });
  }, [searchParams]);

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 24, border: "1px solid #eee", borderRadius: 8, textAlign: "center" }}>
      <h2>Email Verification</h2>
      {status === "verifying" && <p>Verifying your email, please wait...</p>}
      {status === "success" && 
        <p style={{ color: "green" }}>
          {message}
          <div className="text-center mt-4">
            <Link href="/login" className="text-black hover:underline">Continue to login</Link>
          </div>
        </p>
      }
      {status === "error" && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}
