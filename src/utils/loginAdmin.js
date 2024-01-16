import baseRoute from "../assets/globals/baseRoute";
export async function loginAdmin(loginDetails) {
    return new Promise(async (resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            let apiRoute = `${baseRoute}/api/v1/admins/login`;

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response);
                }
            };

            xhttp.open('POST', apiRoute);
            xhttp.setRequestHeader('Content-Type', 'application/json');

            let requestBody = JSON.stringify(loginDetails);
            xhttp.send(requestBody);
        } catch (error) {
            console.log(error);
        }
    });
}

export default loginAdmin;
