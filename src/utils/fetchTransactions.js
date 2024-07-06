import API_ROUTE from '../assets/globals/baseRoute';
export const fetchTransactions = (filterObject, jwtToken) => {
    return new Promise(async function (resolve, reject) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = async () => {
            if (xhttp.readyState === XMLHttpRequest.DONE) {
                let responseReceived = await JSON.parse(xhttp.responseText);
                if (responseReceived.status == 'success') {
                    resolve(responseReceived.data);
                } else reject(responseReceived);
            }
        };

        const filterString = JSON.stringify(filterObject);
        console.log(filterString);
        const filterParam = btoa(filterString);
        xhttp.open(
            'GET',
            `${API_ROUTE}/api/v1/transactions/?filter=${filterParam}`
        );

        //* Hard coded authorization for Sachin Paudel(admin)
        xhttp.setRequestHeader('Authorization', `Bearer ${jwtToken}`);

        xhttp.send();
    });
};
