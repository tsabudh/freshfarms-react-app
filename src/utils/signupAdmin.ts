import type { CustomerProfile } from 'types/customer.interface';
import API_ROUTE from '../assets/globals/baseRoute';

export async function signupAdmin(customerDetails: CustomerProfile) {
  try {
    const response = await fetch(`${API_ROUTE}/api/v1/admins/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerDetails),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Admin signup failed');
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Signup failed:', error.message);
      throw error;
    } else {
      throw new Error('Unknown error during admin signup');
    }
  }
}

export default signupAdmin;
