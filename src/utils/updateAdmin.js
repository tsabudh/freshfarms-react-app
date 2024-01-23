import API_ROUTE from '../assets/globals/baseRoute';
export const updateAdmin = (id, adminDetails, token) => {
    return new Promise((resolve, reject) => {
        try {
            const xhttp = new XMLHttpRequest();
            const apiRoute = `${API_ROUTE}/api/v1/admins/updateMe`;

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response);
                }
            };
            xhttp.open('PATCH', apiRoute);
            xhttp.setRequestHeader('Content-Type', 'application/json');

            xhttp.setRequestHeader('Authorization', `Bearer ${token}`);

            console.log(JSON.stringify(adminDetails));
            let requestBody = JSON.stringify(adminDetails);
            xhttp.send(requestBody);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

export default updateAdmin;
