export async function postTransaction(transactionObject) {
    return new Promise(async (resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            let apiRoute = `http://127.0.0.1:3000/api/v1/transactions/`;
            
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    console.log('Request COmpleted')
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response.data);
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
            xhttp.setRequestHeader(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6IjY0NjlhM2IxMzkwM2EwZmE1ZjUyMjMzYiIsImlzc3VlZEF0IjoxNjg0NjczMzAwMTk2LCJpYXQiOjE2ODQ2NzMzMDB9.26JLp_lg3UB862q3MUNgYIxIGyMwZtXW3uDhlyaTEBs'
            );

            console.log(JSON.stringify(transactionObject));
            let requestBody = JSON.stringify(transactionObject);
            xhttp.send(requestBody);
        } catch (error) {
            console.log(error);
        }
    });
}

export default postTransaction;
