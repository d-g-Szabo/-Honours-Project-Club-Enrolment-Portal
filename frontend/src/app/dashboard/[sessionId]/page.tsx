import { Button } from "@/components/ui/button";
import React from "react";

export default function SessionDetailsPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Session Details</h1>
      <section className="border rounded-lg p-4 mb-4">
        <div className="font-semibold text-lg mb-2">Session Title</div>
        <div className="text-muted-foreground mb-1">Date</div>
        <div className="text-muted-foreground">Time</div>
      </section>
      <div className="w-full h-48 bg-muted rounded mb-4 flex items-center justify-center shadow hover:shadow-lg transition-shadow cursor-pointer">Image/Info</div>
      <div className="flex items-center justify-between">
        <div className="font-semibold">Spots Available</div>
        <Button className="transition-transform hover:scale-105">Book Now</Button>
      </div>
    </div>
  );
} 