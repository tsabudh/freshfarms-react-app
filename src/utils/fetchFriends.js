import API_ROUTE from '../assets/globals/baseRoute';

async function fetchFriends(jwtToken, userRole) {
    const adminsUrl = `${API_ROUTE}/api/v1/admins/all`;
    const customersUrl = `${API_ROUTE}/api/v1/customers/all`;

    try {
        // Initialize return array
        const returnArray = new Array();

        const fetchOptions = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        };

        // Initialize an array with the first fetch request
        const fetchRequests = [fetch(adminsUrl, fetchOptions)];

        // Conditionally add the second fetch request if userRole is 'admin'
        if (userRole === 'admin') {
            fetchRequests.push(fetch(customersUrl, fetchOptions));
        }

        // Await both fetch calls at once using Promise.all
        let [adminFriendsResponse, customerFriendsResponse] = await Promise.all(
            fetchRequests
        );

        // Check if request was successful
        if (!adminFriendsResponse.ok)
            throw new Error('Fetching admin friends failed.');

        const adminFriendsResponseObject = await adminFriendsResponse.json();
        const adminFriends = adminFriendsResponseObject.data;
        returnArray.push(adminFriends);

        // If customer friends is requested, pass it as second parameter
        if (customerFriendsResponse) {
            if (!customerFriendsResponse.ok) {
                throw new Error('Fetching customer friends failed.');
            }

            let customerFriendsResponseObject =
                await customerFriendsResponse.json();

            const customerFriends = customerFriendsResponseObject.data;

            returnArray.push(customerFriends);
        }

        return returnArray;
    } catch (error) {
        console.error('Error fetching friends:', error);
    }
}

export default fetchFriends;
