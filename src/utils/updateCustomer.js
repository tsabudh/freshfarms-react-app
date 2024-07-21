import API_ROUTE from '../assets/globals/baseRoute';
export const updateCustomer = async (id, customerDetails, jwtToken,userRole) => {
    try {

        let apiRoute = `${API_ROUTE}/api/v1/customers/one/${id.toString()}`;

        if(userRole && userRole==='customer'){
            apiRoute = `${API_ROUTE}/api/v1/customers/updateMyDetails`
        }
        const response = await fetch(apiRoute, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(customerDetails),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log(responseData);
        return responseData;
    } catch (error) {
        console.log(error);
    }
};

export default updateCustomer;
