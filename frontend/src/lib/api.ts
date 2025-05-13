const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function handleResponse(response: Response) {
  return response.json().then((data) => {
    if (!response.ok || data?.error) {
      const error = data?.error || 'An error occurred';
      throw new Error(error);
    }
    return data;
  });
}

export async function register({ full_name, email, password, type }: { full_name: string; email: string; password: string; type: 'user' | 'club' }) {
  if (!full_name || !email || !password || !type) throw new Error('All fields are required');
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name, email, password, type }),
  });
  return handleResponse(res);
}

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

export async function forgotPassword(email: string) {
  if (!email) throw new Error('Email is required');
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

export async function resetPassword({ access_token, new_password }: { access_token: string; new_password: string }) {
  if (!access_token || !new_password) throw new Error('Token and new password are required');
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token, new_password }),
  });
  return handleResponse(res);
}

export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  return handleResponse(res);
}

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

export async function verifyEmail(access_token: string) {
  if (!access_token) throw new Error('Token is required');
  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token }),
  });
  return handleResponse(res);
}

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