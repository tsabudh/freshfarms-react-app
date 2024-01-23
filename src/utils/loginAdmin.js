import baseRoute from '../assets/globals/baseRoute';
export async function loginAdmin(loginDetails) {
    return new Promise(async (resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            let apiRoute = `${baseRoute}/api/v1/admins/login`;

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    if (xhttp.responseText) {
                        let response = JSON.parse(xhttp.responseText);
                        resolve(response);
                    } else {
                        console.error('No response from the server.');
                        resolve({
                            status: 'failure',
                            message: 'No response from the server. net::ERR_CONNECTION_REFUSED',
                        });
                    }
                }
            };

            xhttp.open('POST', apiRoute);
            xhttp.setRequestHeader('Content-Type', 'application/json');

            let requestBody = JSON.stringify(loginDetails);
            xhttp.send(requestBody);
        } catch (error) {
            console.log(error);
            reject('Something went wrong.');
        }
    });
}

export default loginAdmin;
