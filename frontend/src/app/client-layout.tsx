"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout as logoutApi } from "../lib/api";

const AUTH_ROUTES = ["/reset-password", "/verify-email", "/login", "/signup", "/forgot-password"];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      let authed = !!token;
      if (authed && isTokenExpired(token as string)) {
        authed = false;
        localStorage.removeItem("access_token");
        logoutApi();
        router.replace("/login");
      }
      setIsAuthenticated(authed);
      setLoading(false);
      if (!authed && !AUTH_ROUTES.includes(pathname)) {
        router.replace("/login");
      }
    }
  }, [router, pathname]);

  const isTokenExpired = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return true;
      // exp is in seconds, Date.now() is in ms
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
  
  if (isAuthenticated && AUTH_ROUTES.includes(pathname)) {
    if (typeof window !== "undefined") {
      router.replace("/dashboard");
    }
    return null;
  }

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {}
    localStorage.removeItem("access_token");
    router.replace("/login");
  };

  if (loading) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {isAuthenticated && 
        <aside className="w-64 bg-white border-r p-6 flex flex-col gap-2 justify-between">
          <nav className="flex flex-col gap-4">
            <Link href="/dashboard" className="font-semibold transition-colors hover:text-primary/80 active:text-primary">Sessions</Link>
            <Link href="/bookings" className="font-semibold transition-colors hover:text-primary/80 active:text-primary">Bookings</Link>
            <Link href="/messages" className="font-semibold transition-colors hover:text-primary/80 active:text-primary">Messages</Link>
            <Link href="/payments" className="font-semibold transition-colors hover:text-primary/80 active:text-primary">Payments</Link>
          </nav>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 mt-8 text-red-600 hover:text-red-800 font-semibold transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3H9m6 0l-3-3m3 3l-3 3" />
            </svg>
            Logout
          </button>
        </aside>
      }
      <main className="flex-1 p-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
} 