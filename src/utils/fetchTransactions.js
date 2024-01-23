import API_ROUTE from '../assets/globals/baseRoute';
export const fetchTransactions = (filterObject, token) => {
    return new Promise(async function (resolve, reject) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = async () => {
            if (xhttp.readyState === XMLHttpRequest.DONE) {
                let responseReceived = await JSON.parse(xhttp.responseText);
                // console.log('Fetching transactions....');
                resolve(responseReceived.data);
            }
        };

        const filterString = JSON.stringify(filterObject);
        const filterParam = btoa(filterString);
        xhttp.open(
            'GET',
            `${API_ROUTE}/api/v1/transactions/?filter=${filterParam}`
        );

        //* Hard coded authorization for Sachin Paudel(admin)
        xhttp.setRequestHeader('Authorization', `Bearer ${token}`);

        xhttp.send();
    });
};
