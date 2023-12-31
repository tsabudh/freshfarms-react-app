export const fetchTransactions = (filterObject) => {
    return new Promise(async function (resolve, reject) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = async() => {
            if (xhttp.readyState === XMLHttpRequest.DONE) {
                let responseReceived =await  JSON.parse(xhttp.responseText);
                resolve(responseReceived.data);
            }
        };

        const filterString = JSON.stringify(filterObject);
        const filterParam = btoa(filterString);
        console.log(filterParam);
        xhttp.open(
            'GET',
            `http://127.0.0.1:3000/api/v1/transactions/?filter=${filterParam}`
        );

        //* Hard coded authorization for Sachin Paudel(admin)
        xhttp.setRequestHeader(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6IjY0NjlhM2IxMzkwM2EwZmE1ZjUyMjMzYiIsImlzc3VlZEF0IjoxNjg0NjczMzAwMTk2LCJpYXQiOjE2ODQ2NzMzMDB9.26JLp_lg3UB862q3MUNgYIxIGyMwZtXW3uDhlyaTEBs'
        );
        xhttp.send();
    });
};