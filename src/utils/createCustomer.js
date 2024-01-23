import API_ROUTE from '../assets/globals/baseRoute';
export const createCustomer = (customerDetails, token) => {
    return new Promise((resolve, reject) => {
        try {
            const xhttp = new XMLHttpRequest();
            const apiRoute = `${API_ROUTE}/api/v1/customers/`;

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    console.log(response);
                    resolve(response.data);
                }
            };
            xhttp.open('POST', apiRoute);
            xhttp.setRequestHeader('Content-Type', 'application/json');

            //todo MAKE BEARER TOKEN STORED AND WITHDRAW FROM COOKIES
            xhttp.setRequestHeader('Authorization', `Bearer ${token}`);
            console.log(JSON.stringify(customerDetails));
            let requestBody = JSON.stringify(customerDetails);
            xhttp.send(requestBody);
        } catch (error) {
            console.log(error);
            return;
        }
    });
};

export default createCustomer;
