import API_ROUTE from '../assets/globals/baseRoute';
export async function loginUser(loginDetails, userRole) {
    return new Promise(async (resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            let apiRoute = `${API_ROUTE}/api/v1/${userRole}s/login`;

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    if (xhttp.responseText) {
                        let response = JSON.parse(xhttp.responseText);
                        resolve(response);
                    } else {
                        console.error('No response from the server.');
                        resolve({
                            status: 'failure',
                            message:
                                'No response from the server. net::ERR_CONNECTION_REFUSED',
                        });
                    }
                }
            };

            xhttp.open('POST', apiRoute);
            xhttp.setRequestHeader('Content-Type', 'application/json');

            let requestBody = JSON.stringify(loginDetails);
            xhttp.send(requestBody);
        } catch (error) {
            console.log(error.message);
            reject('Something went wrong.');
        }
    });
}

export default loginUser;
