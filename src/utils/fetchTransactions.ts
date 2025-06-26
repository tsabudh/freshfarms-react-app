import { FilterObject } from 'types/filter.types';
import API_ROUTE from '../assets/globals/baseRoute';

export const fetchTransactions = async (filterObject:FilterObject, jwtToken:string) => {
    try {
        const filterString = JSON.stringify(filterObject);
        const filterParam = btoa(filterString);

        const response = await fetch(
            `${API_ROUTE}/api/v1/transactions/?filter=${filterParam}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`, // If needed
                },
                credentials: 'include', // Important: includes cookies (like refresh token/session)
            }
        );

        const data = await response.json();

        if (data.status === 'success') {
            return data.data;
        } else {
            throw data;
        }
    } catch (error) {
        throw error;
    }
};
