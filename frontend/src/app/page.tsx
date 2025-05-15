import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 animate-bounce-once">Club Enrollment Portal</h1>
        <p className="mb-6 text-muted-foreground">Join clubs, set your availability, and manage your bookings easily.</p>
        <div className="flex gap-4 justify-center">
          <Button asChild className="transition-transform hover:scale-105"><a href="/join">Join a Club</a></Button>
          <Button asChild variant="outline" className="transition-transform hover:scale-105"><a href="/availability">Set Availability</a></Button>
        </div>
      </div>
    </div>
  );
}
