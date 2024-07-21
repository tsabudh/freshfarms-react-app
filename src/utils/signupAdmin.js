import API_ROUTE from '../assets/globals/baseRoute';
export const signupAdmin = (customerDetails) => {
    return new Promise((resolve, reject) => {
        try {
            const xhttp = new XMLHttpRequest();
            const apiRoute = `${API_ROUTE}/api/v1/admins/login`;

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response);
                }
            };
            xhttp.open('POST', apiRoute);
            xhttp.setRequestHeader('Content-Type', 'application/json');

            //todo MAKE BEARER TOKEN STORED AND WITHDRAW FROM COOKIES
            let requestBody = JSON.stringify(customerDetails);
            xhttp.send(requestBody);
        } catch (error) {
            console.log(error);
            return;
        }
    });
};

export default signupAdmin;
