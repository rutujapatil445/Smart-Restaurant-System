export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: 'admin' | 'user';
}

const API_URL = '/api/auth';

export const loginUser = async (email: string, password: string): Promise<AuthUser> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const { token, user } = await response.json();
  localStorage.setItem('auth_token', token);
  
  const authUser: AuthUser = {
    uid: user.id.toString(),
    email: user.email,
    displayName: user.name,
    role: user.role,
  };
  
  window.dispatchEvent(new Event('auth-state-change'));
  return authUser;
};

export const registerUser = async (name: string, email: string, password: string): Promise<AuthUser> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  // After registration, we automatically log them in
  return loginUser(email, password);
};

export const logoutUser = async () => {
  localStorage.removeItem('auth_token');
  window.dispatchEvent(new Event('auth-state-change'));
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      localStorage.removeItem('auth_token');
      return null;
    }

    const user = await response.json();
    return {
      uid: user.id.toString(),
      email: user.email,
      displayName: user.name,
      role: user.role,
    };
  } catch (e) {
    localStorage.removeItem('auth_token');
    return null;
  }
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  // Simple mock for now as we don't have a backend route for this yet
  console.log(`Password reset requested for ${email}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
};
