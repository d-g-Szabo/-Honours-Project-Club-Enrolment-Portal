// PaymentsPage: Displays the user's payment history by fetching booking/payment records from the backend.
// Shows date, amount, status, currency, and session title for each payment.

'use client';
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { getUserBookings } from "@/lib/api";

export default function PaymentsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || '{}') : {};
      if (!user.id) return;
      setLoading(true);
      const res = await getUserBookings(user.id);
      setBookings(res.data || []);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold">Payments</h1>
      <section>
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        <table className="w-full border rounded-lg overflow-hidden shadow">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Currency</th>
              <th className="p-2 text-left">Session</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-2 text-center">Loading...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={5} className="p-2 text-center">No payments found.</td></tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-t">
                  <td className="p-2">{booking.created_at ? new Date(booking.created_at).toLocaleDateString() : '-'}</td>
                  <td className="p-2">${booking.amount ?? '-'}</td>
                  <td className="p-2">{booking.status ?? '-'}</td>
                  <td className="p-2">{booking.currency ?? '-'}</td>
                  <td className="p-2">{booking.sessions?.title ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
} 