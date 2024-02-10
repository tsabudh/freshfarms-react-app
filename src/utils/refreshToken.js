import API_ROUTE from '../assets/globals/baseRoute';

export async function refreshToken(token) {
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
            xhttp.setRequestHeader('Authorization', `Bearer ${token}`);

            xhttp.send();
        } catch (error) {
            console.log(error);
        }
    });
}

export default refreshToken;
