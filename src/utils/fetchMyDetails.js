import API_ROUTE from '../assets/globals/baseRoute';
export const fetchMyDetails = async (jwtToken, userRole) => {
    try {
        const apiRoute = `${API_ROUTE}/api/v1/${userRole}s/getMyDetails`;

        const response = await fetch(apiRoute, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.log(error.message);
    }
};

export default fetchMyDetails;
