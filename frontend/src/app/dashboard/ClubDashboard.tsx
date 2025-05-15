"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Link from "next/link";
import { createSession, getSessions } from "@/lib/api";

export default function ClubDashboard() {
  // Get club user data from localStorage
  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;

  const clubName = userData.full_name || "Club Name";
  const clubDescription = userData.description || "Club Description";
  const clubId = userData.id;

  // State for event type (virtual/physical), address, form fields, etc.
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
    title: "",
    description: "",
    date: "",
    time: "",
    capacity: "",
    price: 0,
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | '', message: string }>({ type: '', message: '' });
  const [sessions, setSessions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Fetch sessions for the club (with pagination)
  const fetchSessions = async (pageNum = 1) => {
    try {
      const res = await getSessions({ userId: clubId, page: pageNum, limit });
      setSessions(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      setSessions([]);
      setTotalPages(1);
    }
  };

  React.useEffect(() => {
    if (clubId) fetchSessions(page);
    // eslint-disable-next-line
  }, [clubId, page]);

  // Handle event type (virtual/physical) change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEventType(e.target.value);
  };

  // Handle address field changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission for creating a session
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setFormErrors({});
    // Validation for required fields
    let errors: { [key: string]: string } = {};
    if (eventType === 'virtual') {
      if (!address.link) errors.link = 'Event link is required for virtual events.';
    } else {
      if (!address.address1) errors.address1 = 'Address Line 1 is required.';
      if (!address.city) errors.city = 'City is required.';
      if (!address.postal_code) errors.postal_code = 'Postal Code is required.';
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setStatus({ type: 'error', message: 'Please fill all required fields.' });
      return;
    }
    try {
      // Prepare session and place objects
      const session: any = {
        date: form.date,
        time: form.time,
        capacity: form.capacity,
        user_id: clubId,
        title: form.title,
        description: form.description,
        price: form.price,
        booked_slots: 0,
        status: "Available",
        duration: 60, // Default duration, can be changed as needed
      };
      const place: any = {
        type: eventType === 'virtual' ? 'Virtual' : 'Physical',
        club_id: clubId, // Add club_id if needed
        fee_type: (form.price > 0 ? 'Paid' : 'Free'), // Add fee_type if needed
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
      setForm({ date: "", time: "", capacity: "", price: 0, title: "", description: "" });
      setAddress({ address1: "", address2: "", city: "", state: "", country: "", postal_code: "", link: "" });
      fetchSessions(1); // Refresh to first page
      setPage(1);
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
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Title</label>
            <input className="border rounded px-3 py-2 w-full" type="text" name="title" placeholder="Title" value={form.title} onChange={handleFormChange} />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Date & Time</label>
            <div className="grid grid-cols-2 gap-4">
              <input className="border rounded px-3 py-2" type="date" name="date" placeholder="Date" value={form.date} onChange={handleFormChange} />
              <input className="border rounded px-3 py-2" type="time" name="time" placeholder="Time" value={form.time} onChange={handleFormChange} />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <label className="block mb-1 font-medium">Capacity</label>  
              <label className="block mb-1 font-medium">Price</label>  
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input className="border rounded px-3 py-2" type="number" name="capacity" placeholder="Capacity" value={form.capacity} onChange={handleFormChange} />
              <input className="border rounded px-3 py-2" type="number" name="price" placeholder="Price" value={form.price} onChange={handleFormChange} />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <textarea className="border rounded px-3 py-2 w-full" name="description" placeholder="Description" value={form.description} onChange={handleFormChange} />
          </div>
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
              {formErrors.link && <div className="text-red-600 text-sm mt-1">{formErrors.link}</div>}
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
              {formErrors.address1 && <div className="text-red-600 text-sm mt-1 md:col-span-2">{formErrors.address1}</div>}
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
              {formErrors.city && <div className="text-red-600 text-sm mt-1 md:col-span-2">{formErrors.city}</div>}
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
              {formErrors.postal_code && <div className="text-red-600 text-sm mt-1 md:col-span-2">{formErrors.postal_code}</div>}
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
          {sessions.length === 0 ? (
            <div className="col-span-4 text-center text-muted-foreground">No sessions found.</div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="h-24 bg-muted rounded shadow hover:shadow-lg transition-shadow cursor-pointer p-4 flex flex-col justify-between">
                <div className="font-semibold">{session.title}</div>
                <div className="text-xs text-muted-foreground">{session.date} {session.time}</div>
                <div className="text-xs">Capacity: {session.capacity}</div>
                <div className="text-xs">Price: ${session.price}</div>
              </div>
            ))
          )}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</Button>
            <span>Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</Button>
          </div>
        )}
      </section>
    </div>
  );
} 