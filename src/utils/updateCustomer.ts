import { CustomerProfile } from 'types/customer.interface';
import API_ROUTE from '../assets/globals/baseRoute';
export const updateCustomer = async (id:string, customerDetails:CustomerProfile, jwtToken:string,userRole: 'admin' | 'customer') => {
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
        return responseData;
    } catch (error:any) {
        console.log(error);
    }
};

export default updateCustomer;
