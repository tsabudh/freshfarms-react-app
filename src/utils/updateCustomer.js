import API_ROUTE from '../assets/globals/baseRoute';
export const updateCustomer = (id, customerDetails, jwtToken) => {
    return new Promise((resolve, reject) => {
        try {
            const xhttp = new XMLHttpRequest();
            const apiRoute = `${API_ROUTE}/api/v1/customers/${id.toString()}`;

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response);
                }
            };
            xhttp.open('PATCH', apiRoute);
            xhttp.setRequestHeader('Content-Type', 'application/json');

            xhttp.setRequestHeader('Authorization', `Bearer ${jwtToken}`);

            let requestBody = JSON.stringify(customerDetails);
            xhttp.send(requestBody);
        } catch (error) {
            console.log(error);
            return;
        }
    });
};

export default updateCustomer;
