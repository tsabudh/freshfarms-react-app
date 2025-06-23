import API_ROUTE from '../assets/globals/baseRoute.js';

export async function refreshToken(jwtToken:string, userRole: 'admin' | 'customer') {
    const apiRoute = `${API_ROUTE}/api/v1/${userRole}s/refreshToken`;

    try {
        const response = await fetch(apiRoute, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`${( await response.json()).message}`);
        }

        const data = await response.json();
        return data;
    } catch (error:any) {
        console.error('Error:', error.message);
        throw error;
    }
}

export default refreshToken;
