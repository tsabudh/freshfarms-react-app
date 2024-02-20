import API_ROUTE from '../assets/globals/baseRoute';
export async function postTransaction(transactionObject, token) {
    return new Promise(async (resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            let apiRoute = `${API_ROUTE}/api/v1/transactions/`;

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response);
                }
            };

            xhttp.open('POST', apiRoute, true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.setRequestHeader('Authorization', `Bearer ${token}`);

            let requestBody = JSON.stringify(transactionObject);
            xhttp.send(requestBody);
        } catch (error) {
            console.log(error);
        }
    });
}

export default postTransaction;
