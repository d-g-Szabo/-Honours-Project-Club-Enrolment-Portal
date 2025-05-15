// api.ts: Contains utility functions for making API requests to the backend.
// Includes authentication, session, booking, payment, conversation, and messaging endpoints.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Helper to handle API responses and throw errors if needed
function handleResponse(response: Response) {
  return response.json().then((data) => {
    if (!response.ok || data?.error) {
      const error = data?.error || 'An error occurred';
      throw new Error(error);
    }
    return data;
  });
}

// Register a new user or club
export async function register({ full_name, email, password, type }: { full_name: string; email: string; password: string; type: 'user' | 'club' }) {
  if (!full_name || !email || !password || !type) throw new Error('All fields are required');
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name, email, password, type }),
  });
  return handleResponse(res);
}

// Login a user
export async function login({ email, password }: { email: string; password: string }) {
  if (!email || !password) throw new Error('Email and password are required');
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  return handleResponse(res);
}

// Send a password reset email
export async function forgotPassword(email: string) {
  if (!email) throw new Error('Email is required');
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

// Reset a user's password
export async function resetPassword({ access_token, new_password }: { access_token: string; new_password: string }) {
  if (!access_token || !new_password) throw new Error('Token and new password are required');
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token, new_password }),
  });
  return handleResponse(res);
}

// Logout the current user
export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  return handleResponse(res);
}

// Update the user's profile picture
export async function updateProfilePicture({ user_id, avatar_url }: { user_id: string; avatar_url: string }) {
  if (!user_id || !avatar_url) throw new Error('User ID and avatar URL are required');
  const res = await fetch(`${API_URL}/auth/update-profile-picture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, avatar_url }),
    credentials: 'include',
  });
  return handleResponse(res);
}

// Verify a user's email
export async function verifyEmail(access_token: string) {
  if (!access_token) throw new Error('Token is required');
  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token }),
  });
  return handleResponse(res);
}

// Get the current user's profile
export async function getProfile() {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(res);
}

// Update the user's profile (name, description)
export async function updateProfile({ full_name, description }: { full_name: string; description: string }) {
  if (!full_name) throw new Error('Full name is required');
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ full_name, description }),
    credentials: 'include',
  });
  return handleResponse(res);
}

// Create a new session (with place)
export async function createSession(session: any, place: any) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ session, place }),
    credentials: 'include',
  });
  return handleResponse(res);
}

// Get all sessions for a user (with pagination)
export async function getSessions({ userId, page = 1, limit = 8 }: { userId: string, page?: number, limit?: number }) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const params = new URLSearchParams({ page: String(page), limit: String(limit), user_id: userId });
  const res = await fetch(`${API_URL}/sessions?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(res);
}

// Update a session by ID
export async function updateSession(id: string, session: any) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/sessions/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(session),
    credentials: 'include',
  });
  return handleResponse(res);
}

// Update a place by ID
export async function updatePlace(id: string, place: any) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/places/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(place),
    credentials: 'include',
  });
  return handleResponse(res);
}

// Get a session with its place info
export async function getSessionWithPlace(sessionId: string) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/sessions/${sessionId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(res);
}

// Get a place by its ID
export async function getPlaceById(placeId: string) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/places/${placeId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(res);
}

// Soft-delete a session (marks as deleted)
export async function deleteSession(id: string) {
  return updateSession(id, { is_delete: true });
}

// Soft-delete a place (marks as deleted)
export async function deletePlace(id: string) {
  return updatePlace(id, { is_delete: true });
}

// Get all conversations for a user
export async function getConversations({ userId, page = 1, limit = 20 }: { userId: string, page?: number, limit?: number }) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const params = new URLSearchParams({ user_id: userId, page: String(page), limit: String(limit) });
  const res = await fetch(`${API_URL}/conversations?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(res);
}

// Get all messages for a conversation
export async function getMessages({ conversationId, page = 1, limit = 50 }: { conversationId: string, page?: number, limit?: number }) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const params = new URLSearchParams({ conversation_id: conversationId, page: String(page), limit: String(limit) });
  const res = await fetch(`${API_URL}/messages?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(res);
}

// Get all available sessions (for public listing)
export async function getAllAvailableSessions({ page = 1, limit = 8, search = "" }: { page?: number, limit?: number, search?: string }) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const params = new URLSearchParams({ page: String(page), limit: String(limit), status: 'Available' });
  if (search) params.append('search', search);
  const res = await fetch(`${API_URL}/sessions?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(res);
}

// Create a booking for a session
export async function createBooking({ sessionId, placeId, userId, paymentId }: { sessionId: string, placeId: string, userId: string, paymentId?: string }) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const body: any = { session_id: sessionId, place_id: placeId, user_id: userId };
  if (paymentId) body.payment_id = paymentId;
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  return handleResponse(res);
}

// Get all bookings for a user
export async function getUserBookings(userId: string) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/bookings?user_id=${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(res);
}

// Get all bookings for a club (sessions owned by the user)
export async function getUserBookingsForClub(userId: string) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/bookings/booking-for-club?user_id=${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(res);
}

// Create a new conversation between two users
export async function createConversation({ userId, otherUserId }: { userId: string, otherUserId?: string }) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/conversations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user1_id: userId, user2_id: otherUserId }),
    credentials: 'include',
  });
  return handleResponse(res);
}

// Send a message in a conversation
export async function sendMessage({ conversation_id, sender_id, content }: { conversation_id: string, sender_id: string, content: string }) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ conversation_id, sender_id, content }),
    credentials: 'include',
  });
  return handleResponse(res);
}

// Get all payments for a user
export async function getUserPayments(userId: string) {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!access_token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/payments?user_id=${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(res);
} 