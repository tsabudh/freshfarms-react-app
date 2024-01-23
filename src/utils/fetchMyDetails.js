import API_ROUTE from '../assets/globals/baseRoute';
export const fetchMyDetails = (token) => {
    return new Promise((resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            let apiRoute;
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response);
                }
            };

            apiRoute = `${API_ROUTE}/api/v1/admins/getMyDetails`;

            xhttp.open('GET', apiRoute);
            xhttp.setRequestHeader('Authorization', `Bearer ${token}`);

            xhttp.send();
        } catch (error) {
            console.log(error.message);
        }
    });
};

export default fetchMyDetails;
