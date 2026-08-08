import type { User } from '../types/user';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    await delay(500);
    if (!phone || phone.length < 10) {
      throw new Error('Please enter a valid phone number');
    }
    return { success: true, message: 'OTP sent successfully. Use code 1234' };
  },

  async verifyOtp(phone: string, otp: string): Promise<{ user: User }> {
    await delay(600);
    if (otp !== '1234') {
      throw new Error('Invalid OTP code. Try 1234');
    }

    return {
      user: {
        id: 'usr-' + Date.now(),
        phone,
        name: 'Gourmet Chef',
        address: 'House 42, Road 11, Banani, Dhaka',
      },
    };
  },
};
