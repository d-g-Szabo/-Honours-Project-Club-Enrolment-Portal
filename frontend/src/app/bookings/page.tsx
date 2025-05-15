"use client";
import { useEffect, useState } from "react";
import { getUserBookingsForClub } from "@/lib/api";

interface Booking {
  id: string;
  sessionTitle: string;
  date: string;
  status: string;
  sessions: {
    title: string;
    date: string;
    users: {
      full_name: string;
    };
  };
  places: {
    type: string;
    link: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  users: {
    full_name: string;
    email: string;
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const user = localStorage.getItem("user");
      if (!user) return;
      const userId = JSON.parse(user).id;
      const data = await getUserBookingsForClub(userId);
      setBookings(data.data);
    };
    fetchBookings();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>All Bookings</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {bookings.map((booking) => (
          <li key={booking.id} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{booking.sessions.title}</h3>
            <p style={{ margin: '0 0 10px 0', color: '#555' }}><b>Booked By:</b> {booking.users.full_name} ({booking.users.email})</p>
            <p style={{ margin: '0 0 10px 0', color: '#555' }}><b>Date:</b> {booking.sessions.date}</p>
            <p style={{ margin: '0 0 10px 0', color: '#777' }}><b>Status:</b> {booking.status}</p>
            <p style={{ margin: '0 0 10px 0', color: '#555' }}><b>Place:</b> {
              booking.places.type == "Virtual" ? 
                <p>{booking.places.link}</p>
                : <>
                  <p><b>Address1:</b> {booking.places.address1 ?? booking.places.address1}</p>
                  <p><b>Address2:</b> {booking.places.address2 ?? booking.places.address2}</p>
                  <p><b>City:</b> {booking.places.city ?? booking.places.city}</p>
                  <p><b>State:</b> {booking.places.state ?? booking.places.state}</p>
                  <p><b>Country:</b> {booking.places.country ?? booking.places.country}</p>
                  <p><b>Postal Code:</b> {booking.places.postal_code ?? booking.places.postal_code}</p>
                </>
              }</p>
          </li>
        ))}
      </ul>
    </div>
  );
} 