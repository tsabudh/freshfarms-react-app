export async function loginAdmin(loginDetails) {
    return new Promise(async (resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            let apiRoute = `http://127.0.0.1:3000/api/v1/admins/login`;

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    console.log('Request COmpleted');
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response);
                }
            };

            xhttp.open('POST', apiRoute);
            xhttp.setRequestHeader('Content-Type', 'application/json');

            console.log(JSON.stringify(loginDetails));
            let requestBody = JSON.stringify(loginDetails);
            xhttp.send(requestBody);
        } catch (error) {
            console.log(error);
        }
    });
}

export default loginAdmin;
