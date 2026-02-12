/**
 * Auth API - Phase 1
 */

import httpClient from '../http';

interface LoginResponse {
  token: string;
  user?: {
    id: number;
    email: string;
    name?: string;
    role?: string;
  };
}

/**
 * Sign in with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse | null> {
  try {
    const response = await httpClient.post<LoginResponse>('/auth/signin', {
      email,
      password,
    });

    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('admin_token', response.token);
    }

    return response;
  } catch (error: any) {
    console.error('[Auth API] Login failed:', error);
    throw error;
  }
}

/**
 * Sign out (clear token)
 */
export function logout(): void {
  localStorage.removeItem('admin_token');
  window.location.href = '/connect-admin#login';
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem('admin_token'));
}

/**
 * Get current auth token
 */
export function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

export const authApi = {
  login,
  logout,
  isAuthenticated,
  getToken,
};
