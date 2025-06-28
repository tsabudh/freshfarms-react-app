import API_ROUTE from '../assets/globals/baseRoute';

export async function loginUser(
  loginDetails: string,
  userRole: 'customer' | 'admin'
) {
  try {
    const apiRoute = `${API_ROUTE}/api/v1/${userRole}s/login`;

    const response = await fetch(apiRoute, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: loginDetails, // assumed to be already stringified
    });

    const data = await response.json();

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error:', error);
    }

    return {
      status: 'failure',
      message: 'Something went wrong. Please try again later.',
    };
  }
}

export default loginUser;
