import type { CustomerProfile } from 'types/customer.interface';
import API_ROUTE from '../assets/globals/baseRoute';

export const updateCustomer = async (
  id: string,
  customerDetails: Partial<CustomerProfile>,
  jwtToken: string,
  userRole: 'admin' | 'customer'
) => {
  const apiRoute =
    userRole === 'customer'
      ? `${API_ROUTE}/api/v1/customers/updateMyDetails`
      : `${API_ROUTE}/api/v1/customers/one/${id}`;

  const response = await fetch(apiRoute, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify(customerDetails),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update customer');
  }

  return data;
};

export default updateCustomer;
