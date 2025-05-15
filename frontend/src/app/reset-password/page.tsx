"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    let token = searchParams.get("token") || searchParams.get("access_token");
    if (!token && typeof window !== "undefined") {
      // Try to get from hash fragment
      const hash = window.location.hash.substring(1); // remove the '#'
      const params = new URLSearchParams(hash);
      token = params.get("access_token") || params.get("token");
    }
    setAccessToken(token);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setStatus("error");
      setMessage("No reset token found in the URL.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setStatus("error");
      setMessage("Please enter and confirm your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    setStatus("submitting");
    try {
      await resetPassword({ access_token: accessToken, new_password: newPassword });
      setStatus("success");
      setMessage("Your password has been reset successfully! You can now log in.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Password reset failed. Please try again or contact support.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 24, border: "1px solid #eee", borderRadius: 8, textAlign: "center" }}>
      <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>
      {status === "success" ? (
        <p style={{ color: "green" }}>{message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full transition-transform hover:scale-105 bg-gray-500 text-white"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Resetting..." : "Reset Password"}
          </Button>
          {status === "error" && <p style={{ color: "red", marginTop: 16 }}>{message}</p>}
          <div className="text-center mt-4">
            <Link href="/login" className="text-primary hover:underline">Continue to login!</Link>
          </div>
        </form>
      )}
    </div>
  );
}
