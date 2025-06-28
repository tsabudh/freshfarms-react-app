import type { UserProfile } from 'types/user.interface';
import API_ROUTE from '../assets/globals/baseRoute';

export async function updateAdmin(id: string, adminDetails: UserProfile, jwtToken: string) {
  try {
    const apiRoute = `${API_ROUTE}/api/v1/admins/updateMe`;

    const response = await fetch(apiRoute, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(adminDetails),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Update failed');
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Update admin error:', error.message);
      throw error;
    } else {
      throw new Error('Unknown error occurred during admin update');
    }
  }
}

export default updateAdmin;
