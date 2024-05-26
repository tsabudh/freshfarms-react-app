import API_ROUTE from '../assets/globals/baseRoute';
export const fetchCustomers = (id, jwtToken) => {
    return new Promise((resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            let apiRoute;
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response.data);
                }
            };

            if (id) apiRoute = `${API_ROUTE}/api/v1/customers/${id.toString()}`;
            else apiRoute = `${API_ROUTE}/api/v1/customers/`;

            xhttp.open('GET', apiRoute);
            xhttp.setRequestHeader('Authorization', `Bearer ${jwtToken}`);

            xhttp.send();
        } catch (error) {
            console.log(error.message);
        }
    });
};

export default fetchCustomers;
