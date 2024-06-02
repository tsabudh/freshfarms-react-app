import API_ROUTE from '../assets/globals/baseRoute.js';

export async function refreshToken(jwtToken) {
    return new Promise(async (resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            let apiRoute = `${API_ROUTE}/api/v1/admins/refreshToken`;

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response);
                }
            };

            xhttp.open('GET', apiRoute, true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.setRequestHeader('Authorization', `Bearer ${jwtToken}`);

            xhttp.send();
        } catch (error) {
            console.log(error);
        }
    });
}

export default refreshToken;
