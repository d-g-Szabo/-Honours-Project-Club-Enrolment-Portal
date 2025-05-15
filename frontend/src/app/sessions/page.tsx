"use client";
import React, { useEffect, useState } from "react";
import { getAllAvailableSessions, createBooking } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Simple Modal implementation
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">&times;</button>
        {children}
      </div>
    </div>
  );
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bookingMessage, setBookingMessage] = useState("");
  const limit = 8;

  useEffect(() => {
    setLoading(true);
    getAllAvailableSessions({ page, limit })
      .then(res => {
        setSessions(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
      })
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [page]);

  // Dummy booking handler for free events
  const handleBook = async () => {
    setBookingStatus("loading");
    setBookingMessage("");
    try {
      const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || '{}') : {};
      if (!user.id || !selectedSession) throw new Error("User or session not found");
      const placeId = selectedSession.place?.id || selectedSession.place_id;
      await createBooking({
        sessionId: selectedSession.id,
        placeId,
        userId: user.id,
        paymentId: undefined,
      });
      setBookingStatus("success");
      setBookingMessage("Booking successful!");
      setTimeout(() => {
        setSelectedSession(null);
        setBookingStatus("idle");
        setBookingMessage("");
      }, 1500);
    } catch (err: any) {
      setBookingStatus("error");
      setBookingMessage(err.message || "Booking failed.");
    }
  };

  // Dummy PayPal approve handler
  const handleApprove = async () => {
    setBookingStatus("loading");
    setBookingMessage("");
    await new Promise(resolve => setTimeout(resolve, 1000));
    setBookingStatus("success");
    setBookingMessage("Payment and booking successful!");
    setTimeout(() => {
      setSelectedSession(null);
      setBookingStatus("idle");
      setBookingMessage("");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Available Sessions</h1>
      {loading ? (
        <div>Loading...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center text-muted-foreground">No sessions found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sessions.map(session => (
            <div key={session.id} className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between">
              <div>
                <div className="font-semibold text-lg mb-1">{session.title}</div>
                <div className="text-sm text-muted-foreground mb-1">{session.date} {session.time}</div>
                <div className="text-xs mb-1">Duration: {session.duration} min</div>
                <div className="text-xs mb-1">Price: ${session.price}</div>
                <div className="text-xs mb-1">Booked: {session.booked_slots || 0} / {session.capacity}</div>
              </div>
              <Button className="mt-2" onClick={() => setSelectedSession(session)}>View Details</Button>
            </div>
          ))}
        </div>
      )}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</Button>
          <span>Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</Button>
        </div>
      )}
      {/* Modal for session details */}
      <Modal open={!!selectedSession} onClose={() => setSelectedSession(null)}>
        {selectedSession && (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold mb-2">{selectedSession.title}</h2>
            <div className="mb-2 text-muted-foreground">{selectedSession.date} {selectedSession.time}</div>
            <div className="mb-2">{selectedSession.description}</div>
            <div className="mb-2 flex flex-col md:flex-row gap-2">
              <span className="bg-muted px-2 py-1 rounded">Duration: {selectedSession.duration} min</span>
              <span className="bg-muted px-2 py-1 rounded">Price: {selectedSession.price === 0 ? 'Free' : `$${selectedSession.price}`}</span>
              <span className="bg-muted px-2 py-1 rounded">Booked: {selectedSession.booked_slots || 0} / {selectedSession.capacity}</span>
            </div>
            {selectedSession.place && (
              <div className="mb-2">
                <div className="font-semibold">Location:</div>
                {selectedSession.place.type === 'Virtual' ? (
                  <div>Virtual Event - <a href={selectedSession.place.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Join Link</a></div>
                ) : (
                  <div>
                    {selectedSession.place.address1}<br />
                    {selectedSession.place.city}, {selectedSession.place.state} {selectedSession.place.postal_code}<br />
                    {selectedSession.place.country}
                  </div>
                )}
              </div>
            )}
            {selectedSession.price === 0 ? (
              <Button className="mt-4 w-full" onClick={handleBook} disabled={bookingStatus === "loading"}>
                {bookingStatus === "loading" ? "Booking..." : "Book (Free)"}
              </Button>
            ) : (
              <PayPalScriptProvider options={{ clientId: "YOUR_CLIENT_ID" }}>
                <PayPalButtons
                  createOrder={(data: any, actions: any) => {
                    return actions.order.create({
                      purchase_units: [{
                        amount: { value: selectedSession.price.toString() }
                      }]
                    });
                  }}
                  onApprove={handleApprove}
                />
              </PayPalScriptProvider>
            )}
            {bookingMessage && (
              <div className={`mt-2 text-center font-semibold ${bookingStatus === "success" ? "text-green-600" : "text-red-600"}`}>{bookingMessage}</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
} 