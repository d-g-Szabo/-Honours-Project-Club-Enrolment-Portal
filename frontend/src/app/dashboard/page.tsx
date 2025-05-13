"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Link from "next/link";
import { createSession } from "@/lib/api";

export default function ClubDashboard() {
  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;

  const clubName = userData.full_name || "Club Name";
  const clubDescription = userData.description || "Club Description";

  const [eventType, setEventType] = useState("physical");
  const [address, setAddress] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    link: ""
  });
  const [form, setForm] = useState({
    date: "",
    time: "",
    capacity: "",
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | '', message: string }>({ type: '', message: '' });

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEventType(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      // Prepare session and place objects
      const session: any = {
        date: form.date,
        time: form.time,
        capacity: form.capacity,
        type: eventType,
        // Add other required session fields here (title, description, etc.)
      };
      const place: any = {
        type: eventType === 'virtual' ? 'Virtual' : 'Physical',
        // Add club_id if needed
        ...(
          eventType === 'virtual'
            ? { link: address.link }
            : {
                address1: address.address1,
                address2: address.address2,
                city: address.city,
                state: address.state,
                country: address.country,
                postal_code: address.postal_code,
              }
        ),
        // Add fee_type if needed
      };
      await createSession(session, place);
      setStatus({ type: 'success', message: 'Session created successfully!' });
      setForm({ date: "", time: "", capacity: "" });
      setAddress({ address1: "", address2: "", city: "", state: "", country: "", postal_code: "", link: "" });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Failed to create session.' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Club Dashboard</h1>
        <Link href="/dashboard/profile">
          <Button variant="outline" className="transition-transform hover:scale-105">Profile</Button>
        </Link>
      </div>
      <section className="border rounded-lg p-4 mb-6">
        <div className="h-20 bg-muted rounded mb-2">
          <div className="flex justify-between items-center h-full px-4">
            <h2 className="text-xl font-semibold">{clubName}</h2>
            <div className="text-sm text-muted-foreground">{clubDescription}</div>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Add Session</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-xl" onSubmit={handleSubmit}>
          <input className="border rounded px-3 py-2" type="date" name="date" placeholder="Date" value={form.date} onChange={handleFormChange} />
          <input className="border rounded px-3 py-2" type="time" name="time" placeholder="Time" value={form.time} onChange={handleFormChange} />
          <input className="border rounded px-3 py-2" type="number" name="capacity" placeholder="Capacity" value={form.capacity} onChange={handleFormChange} />
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Event Type</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={eventType}
              onChange={handleTypeChange}
              name="eventType"
            >
              <option value="physical">Physical</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>
          {eventType === "virtual" ? (
            <div className="md:col-span-2">
              <input
                className="border rounded px-3 py-2 w-full"
                type="text"
                name="link"
                placeholder="Event Link"
                value={address.link}
                onChange={handleAddressChange}
              />
            </div>
          ) : (
            <>
              <input
                className="border rounded px-3 py-2"
                type="text"
                name="address1"
                placeholder="Address Line 1"
                value={address.address1}
                onChange={handleAddressChange}
              />
              <input
                className="border rounded px-3 py-2"
                type="text"
                name="address2"
                placeholder="Address Line 2"
                value={address.address2}
                onChange={handleAddressChange}
              />
              <input
                className="border rounded px-3 py-2"
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleAddressChange}
              />
              <input
                className="border rounded px-3 py-2"
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleAddressChange}
              />
              <input
                className="border rounded px-3 py-2"
                type="text"
                name="country"
                placeholder="Country"
                value={address.country}
                onChange={handleAddressChange}
              />
              <input
                className="border rounded px-3 py-2"
                type="text"
                name="postal_code"
                placeholder="Postal Code"
                value={address.postal_code}
                onChange={handleAddressChange}
              />
            </>
          )}
          {status.type && (
            <div className={`md:col-span-2 text-${status.type === 'success' ? 'green' : 'red'}-600 font-medium`}>{status.message}</div>
          )}
          <div className="md:col-span-2 flex justify-start mt-2">
            <Button type="submit" className="transition-transform hover:scale-105">Add</Button>
          </div>
        </form>
        <div className="grid grid-cols-4 gap-2 border rounded-lg p-4 min-h-[120px]">
          {/* Placeholder for sessions grid */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded shadow hover:shadow-lg transition-shadow cursor-pointer" />
          ))}
        </div>
      </section>
    </div>
  );
} 