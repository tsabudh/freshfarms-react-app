import { useEffect, useState } from 'react';

const fetchCustomers = () => {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                let response = JSON.parse(xhttp.responseText);
                resolve(response.data);
            }
        };

        xhttp.open('GET', `http://127.0.0.1:3000/api/v1/customers/`);
        xhttp.setRequestHeader(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6IjY0NjlhM2IxMzkwM2EwZmE1ZjUyMjMzYiIsImlzc3VlZEF0IjoxNjg0NjczMzAwMTk2LCJpYXQiOjE2ODQ2NzMzMDB9.26JLp_lg3UB862q3MUNgYIxIGyMwZtXW3uDhlyaTEBs'
        );
        xhttp.send();
    });
};

const useHttp = () => {
    let customers;
    useEffect(() => {
        async () => {
            let results = await fetchCustomers();
            customers = results;
        };
    }, []);

    return customers;
};

export default useHttp;
