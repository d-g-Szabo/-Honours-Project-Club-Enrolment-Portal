"use client";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/lib/api";

export default function ClubProfilePage() {
  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProfile()
      .then((profile) => {
        setFullName(profile.full_name || "");
        setDescription(profile.description || "");
      })
      .catch(() => setMessage("Failed to load profile."));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await updateProfile({ full_name: fullName, description });
      setStatus("success");
      setMessage("Profile updated successfully.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to update profile.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2 className="text-xl font-bold mb-4">Edit Club Profile</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            rows={4}
          />
        </div>
        <button
          type="submit"
          style={{ width: "100%", padding: 10, borderRadius: 4, background: "#222", color: "#fff", border: "none" }}
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving..." : "Save Changes"}
        </button>
        {message && <p style={{ color: status === "error" ? "red" : "green", marginTop: 16 }}>{message}</p>}
      </form>
    </div>
  );
} 