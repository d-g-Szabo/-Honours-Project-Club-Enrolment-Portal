import { Button } from "@/components/ui/button";
import React from "react";

export default function MessagesPage() {
  return (
    <div className="flex h-[70vh] border rounded-lg overflow-hidden animate-fade-in">
      <aside className="w-1/3 border-r p-4 bg-muted">
        <h2 className="font-semibold mb-4">Conversations</h2>
        <div className="space-y-2">
          {[1, 2, 3].map((id) => (
            <div key={id} className="h-10 bg-white rounded px-2 flex items-center shadow hover:shadow-lg transition-shadow cursor-pointer">User {id}</div>
          ))}
        </div>
      </aside>
      <section className="flex-1 flex flex-col">
        <header className="p-4 border-b font-semibold">Conversation</header>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-white">
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className={`p-2 rounded-lg ${id % 2 ? 'bg-muted self-start' : 'bg-primary text-primary-foreground self-end'} max-w-xs`}>Message {id}</div>
          ))}
        </div>
        <form className="flex p-4 border-t gap-2">
          <input className="flex-1 border rounded px-3 py-2" placeholder="Type a message" />
          <Button type="submit" className="transition-transform hover:scale-105">Send</Button>
        </form>
      </section>
    </div>
  );
} 