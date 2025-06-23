import API_ROUTE from '../assets/globals/baseRoute';
export const fetchMessages = (jwtToken:string) => {
    return new Promise((resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            let apiRoute;
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    if (response.status == 'success') {
                        resolve(response.data);
                    } else {
                        reject(response);
                    }
                }
            };

            apiRoute = `${API_ROUTE}/api/v1/messages/getMyMessages`;

            xhttp.open('GET', apiRoute);
            xhttp.setRequestHeader('Authorization', `Bearer ${jwtToken}`);

            xhttp.send();
        } catch (error:Error | any) {
            console.log(error.message);
        }
    });
};

export default fetchMessages;
