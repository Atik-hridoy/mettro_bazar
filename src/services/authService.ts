import { apiClient } from './apiClient';
import type { User } from '../types/user';

interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface UserAddressItem {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
}

export const authService = {
  async login(phone: string, password: string): Promise<{ user: User }> {
    try {
      const response = await apiClient<AuthResponse>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
      });

      if (response.access) {
        localStorage.setItem('access_token', response.access);
      }
      if (response.refresh) {
        localStorage.setItem('refresh_token', response.refresh);
      }

      return { user: response.user };
    } catch (err) {
      console.warn('Backend login error:', err);
      throw new Error(err instanceof Error ? err.message : 'Invalid phone number or password.');
    }
  },

  async register(name: string, phone: string, password: string): Promise<{ user: User }> {
    try {
      const response = await apiClient<AuthResponse>('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({ name, phone, password }),
      });

      if (response.access) {
        localStorage.setItem('access_token', response.access);
      }
      if (response.refresh) {
        localStorage.setItem('refresh_token', response.refresh);
      }

      return { user: response.user };
    } catch (err) {
      console.warn('Backend registration error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to create account.');
    }
  },

  async sendOtp(_phone: string): Promise<void> {
    // Simulate sending OTP
    return Promise.resolve();
  },

  async verifyOtp(phone: string, otp: string): Promise<{ user: User }> {
    // In a real app, this would verify OTP. Here we simulate it by using the OTP as a password.
    if (phone === '12345678901' && otp !== '123456') {
      throw new Error('Invalid OTP for admin test account. Please use 123456.');
    } else if (phone !== '12345678901' && otp !== '1234') {
      throw new Error('Invalid OTP. Please use 1234.');
    }
    try {
      // Try logging in first
      return await this.login(phone, otp);
    } catch (err) {
      // If login fails (e.g. user not found), register them automatically
      return await this.register('New User', phone, otp);
    }
  },

  async getProfile(): Promise<User> {
    const user = await apiClient<User>('/auth/profile/');
    return user;
  },

  async updateProfile(data: Partial<User> | FormData): Promise<User> {
    const token = localStorage.getItem('access_token');
    const isFormData = data instanceof FormData;

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch('http://localhost:8000/api/auth/profile/', {
      method: 'PUT',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile.');
    }
    return response.json();
  },

  async getAddresses(): Promise<UserAddressItem[]> {
    return apiClient<UserAddressItem[]>('/auth/addresses/');
  },

  async addAddress(addressData: Omit<UserAddressItem, 'id'>): Promise<UserAddressItem> {
    return apiClient<UserAddressItem>('/auth/addresses/', {
      method: 'POST',
      body: JSON.stringify({
        label: addressData.label,
        fullName: addressData.fullName,
        phone: addressData.phone,
        address: addressData.address,
        city: addressData.city || 'Dhaka',
        isDefault: addressData.isDefault || false,
      }),
    });
  },

  async deleteAddress(id: string): Promise<void> {
    const token = localStorage.getItem('access_token');
    await fetch(`http://localhost:8000/api/auth/addresses/${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getAllCustomers(): Promise<User[]> {
    return apiClient<User[]>('/admin/customers/');
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};
