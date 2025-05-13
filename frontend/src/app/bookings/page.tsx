import { Button } from "@/components/ui/button";
import React from "react";

export default function BookingsPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4">Available Sessions</h2>
      <div className="space-y-4">
        {[1, 2, 3].map((id) => (
          <div key={id} className="flex items-center justify-between border rounded-lg p-4 shadow hover:shadow-lg transition-shadow cursor-pointer">
            <div>
              <div className="h-4 bg-muted rounded w-32 mb-2" />
              <div className="h-3 bg-muted rounded w-24" />
            </div>
            <Button className="transition-transform hover:scale-105">Book</Button>
          </div>
        ))}
      </div>
    </div>
  );
} 