"use client";
import { useEffect, useState } from "react";
import { getAllAvailableSessions, createBooking } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from 'next/navigation';

interface Session {
  id: string;
  title: string;
  description: string;
  place_id: string;
  price: number;
  places: { id: string; name: string; type: 'virtual' | 'physical'; }[];
  booked_slots: number;
  capacity: number;
  user_id: string;
}

export default function UserDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bookingMessage, setBookingMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    getAllAvailableSessions({}).then((data) => {
      setSessions(data.data || data || []);
    });
  }, []);

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  const handleApprove = (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      const paymentId = details.id; // Use this as payment_id
      // Call your booking API with paymentId and other details
      handleBook(paymentId);
    }).catch((error: any) => {
      setBookingStatus("error");
      setBookingMessage("Payment failed. Please try again.");
    });
  };

  const handleBook = async (paymentId: string) => {
    if (!selectedSession) return;
    setBookingStatus("loading");
    setBookingMessage("");
    try {
      const user = localStorage.getItem("user");
      if (!user) throw new Error("User not found");
      const userId = JSON.parse(user).id;
      const placeId = selectedSession.places[0].id;
      const data = {
        sessionId: selectedSession.id,
        placeId,
        userId,
        paymentId,
      };
      await createBooking(data);
      setBookingStatus("success");
      setBookingMessage("Booking successful!");
      setTimeout(() => {
        setModalOpen(false);
        setBookingStatus("idle");
        setBookingMessage("");
      }, 1500);
    } catch (err: any) {
      setBookingStatus("error");
      setBookingMessage(err.message || "Booking failed.");
    }
  };

  const handleMessage = (session: Session) => {
    // Logic to create a new conversation with the session owner
    const ownerId = session.user_id; // Assuming owner_id is available
    // Redirect to messages page
    router.push(`/messages?conversationWith=${ownerId}`);
  };

  return (
    <PayPalScriptProvider options={{ clientId: "AQcjj28x7aqiOelSCPRaAIKmFEJcB0nQVoO9pISxO39XZvdNX1qG4X4zVL4apd7hS-uFPdCbz5IJPjEW" }}>
      <div style={{ padding: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Available Sessions</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {sessions.map((session) => (
            <li key={session.id} onClick={() => handleSessionClick(session)} style={{
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <h3 style={{ margin: '0 0 10px 0' }}><b>Name: </b>{session.title}</h3>
              <p style={{ margin: '0 0 10px 0', color: '#555' }}><b>Description: </b>{session.description}</p>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}><b>Price: </b>${session.price}</p>
              <p style={{ margin: '0 0 10px 0', color: '#777' }}>
                <b>Location: </b>{session.places[0].type === 'virtual' ? 'Virtual' : session.places[0].name}
              </p>
              <p style={{ margin: '0 0 10px 0', color: '#777' }}>
                <b>Spots: </b>{session.booked_slots} booked / {session.capacity} available
              </p>
              <button onClick={(e) => {
                e.stopPropagation();
                handleMessage(session);
              }} style={{
                padding: '8px 16px',
                backgroundColor: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}>Message Owner</button>
            </li>
          ))}
        </ul>
        {modalOpen && selectedSession && (
          <Modal onClose={() => setModalOpen(false)}>
            <h3><b>Name: </b>{selectedSession.title}</h3>
            <p><b>Description: </b>{selectedSession.description}</p>
            {selectedSession.price > 0 ? (
              <PayPalButtons
              createOrder={(data: any, actions: any) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: selectedSession.price.toString(),
                    }
                  }]
                });
              }}
              onApprove={handleApprove}
            />
            ) : (
              <>
                <p><b>Price: </b> Free</p>
                <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={() => handleBook("")}>Book</button>
              </>
            )}
            {bookingMessage && (
              <p style={{ color: bookingStatus === "error" ? "red" : "green", marginTop: 8 }}>{bookingMessage}</p>
            )}
          </Modal>
        )}
      </div>
    </PayPalScriptProvider>
  );
} 