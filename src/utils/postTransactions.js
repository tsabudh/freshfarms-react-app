import baseRoute from "../assets/globals/baseRoute";
export async function postTransaction(transactionObject,token) {
    return new Promise(async (resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            let apiRoute = `${baseRoute}/api/v1/transactions/`;
            
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    console.log('Request COmpleted')
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response);
                }
                if(xhttp.readyState == 0 ){
                    console.log('Open not called')
                }
                if(xhttp.readyState == 2 ){
                    console.log('Headers received')
                }
                if(xhttp.readyState == 3 ){
                    console.log('Loading ResponseText')
                }
            };

            xhttp.open('POST', apiRoute, true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.setRequestHeader('Authorization', `Bearer ${token}`);


            console.log(JSON.stringify(transactionObject));
            let requestBody = JSON.stringify(transactionObject);
            xhttp.send(requestBody);
        } catch (error) {
            console.log(error);
        }
    });
}

export default postTransaction;
