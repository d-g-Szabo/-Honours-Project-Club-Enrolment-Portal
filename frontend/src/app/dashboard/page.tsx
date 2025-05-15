"use client";
import { useEffect, useState } from "react";
import UserDashboard from "./UserDashboard";
import ClubDashboard from "./ClubDashboard";

export default function DashboardPage() {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
  const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        setUserType(parsed.type);
      }
    }
  }, []);

  if (!userType) return <div>Loading...</div>;

  if (userType === "user") {
    return <UserDashboard />;
  }
  else if (userType === "club") {
    return <ClubDashboard />;
  }
  return <div>No Sessions</div>;
} 