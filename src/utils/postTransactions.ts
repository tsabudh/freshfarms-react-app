import type { Transaction } from 'types/transaction.type.js';
import API_ROUTE from '../assets/globals/baseRoute';

export async function postTransaction(transactionObject: Transaction, jwtToken: string) {
  try {
    const response = await fetch(`${API_ROUTE}/api/v1/transactions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(transactionObject),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Transaction failed');
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      throw error;
    } else {
      throw new Error('An unknown error occurred while posting the transaction.');
    }
  }
}

export default postTransaction;
