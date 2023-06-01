import React, { useEffect, useRef, useState } from 'react';
import Calender from '../Calender/Calender';

let global;

const fetchCustomers = () => {
    return new Promise((resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response.data);
                }
            };

            xhttp.open('GET', `http://127.0.0.1:3000/customers/`);
            xhttp.setRequestHeader(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6IjY0NjlhM2IxMzkwM2EwZmE1ZjUyMjMzYiIsImlzc3VlZEF0IjoxNjg0NjczMzAwMTk2LCJpYXQiOjE2ODQ2NzMzMDB9.26JLp_lg3UB862q3MUNgYIxIGyMwZtXW3uDhlyaTEBs'
            );
            xhttp.send();
        } catch (error) {
            console.log(error.message);
        }
    });
};

const CustomerPane = () => {
    const [currentCustomer, setCurrentCustomer] = useState(null);

    let customers = useRef([]);

    let asyncWrapper = async () => {
        try {
            let results = await fetchCustomers();
            customers.current = results;
            setCurrentCustomer(customers.current[0]);
        } catch (error) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        asyncWrapper();
    }, []);

    const handleCustomer = (method, e) => {
        switch (method) {
            case 'selectCustomer': {
                console.dir(e.target.value);
                let current = customers.current.find(
                    (customer) => customer._id == e.target.value
                );
                setCurrentCustomer(current);
                break;
            }
        }
    };
    console.log(customers);
    return (
        <React.Fragment>
            <div>
                <label htmlFor="customer">Select Customer</label>
                <select
                    name="customer"
                    id="customer"
                    onChange={(e) => handleCustomer('selectCustomer', e)}
                    // value={'currentCustomer'}
                >
                    {customers.current.map((item, index) => {
                        return (
                            <option
                                key={index}
                                name="currentCustomer"
                                value={item._id}
                            >
                                {item.name}
                            </option>
                        );
                    })}
                </select>
            </div>
            <Calender currentCustomer={currentCustomer} />
        </React.Fragment>
    );
};

export default CustomerPane;
