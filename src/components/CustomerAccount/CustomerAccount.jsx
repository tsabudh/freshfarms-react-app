import React, { useContext, useState } from 'react';
import styles from './CustomerAccount.module.scss';
import Button from '../UI/Button/Button';

import CustomerProfile from '../CustomerProfile/CustomerProfile';
import { AuthContext } from '../../context/AuthContext';
import ErrorFormFooter from '../UI/Error/ErrorFormFooter';
import useAPI from '../../hooks/useAPI';

const failuresObject = {
    name: false,
    nameMessage: '',
    address: false,
    addressMessage: '',
    phone: true,
    phoneMessage: '',
    tab: false,
    purchase: false,
    paid: false,
};

function CustomerAccount() {
    const { token } = useContext(AuthContext);
    const [dueAmount, setDueAmount] = useState('');
    const [tabOptions, setTabOptions] = useState(false);
    const [failures, setFailures] = useState(failuresObject);

    const [posting, setPosting] = useState(''); // sending '' success failure
    // const [errorMessage, setErrorMessage] = useState(null);
    let requestBody;
    //- Custom Hook
    const [pendingStatus, data, errorMessage, sendRequest, setRequestBody] =
        useAPI({
            url: '/customers',
            method: 'POST',
            token: token,
            body: requestBody,
        });
    // console.log(pendingStatus);
    // console.log(data);

    const handleDueAmount = (e) => {
        let purchaseAmount = Number(document.getElementById('purchase').value);
        let paidAmount = Number(document.getElementById('paid').value);

        let dueAmount = purchaseAmount - paidAmount;
        setDueAmount(dueAmount);
    };
    const handleTab = () => {
        setDueAmount('');
        setTabOptions((tabOptions) => !tabOptions);
    };
    const handleForm = async (e) => {
        e.preventDefault();
        let form = document.getElementById('createCustomerForm');
        let formData = new FormData(form);
        let details = {};
        formData.forEach((value, key) => (details[key] = value));
        let json = JSON.stringify(details);

        // console.log(Object.entries(failures).find((item) => item[1] == true));

        for (const [key, value] of Object.entries(failures)) {
            // console.log(key, value);
        }
        // console.log(Object.entries(failures));
        // let result = await createCustomer(details, token);
        // console.log(result);

        // console.log(requestBody);
        sendRequest(details);
        return;
    };

    return (
        <div className={styles['container']}>
            <div className={styles['form-container']}>
                <h3>Add a new customer</h3>
                <form action="" id="createCustomerForm">
                    <div className={styles['input-group']}>
                        <label
                            htmlFor="customerName"
                            className={styles['input-label']}
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="customerName"
                            name="name"
                            className={styles['input-field']}
                            placeholder="Customer's Name"
                        />
                    </div>
                    <div className={styles['input-group']}>
                        <label
                            htmlFor="customerAddress"
                            className={styles['input-label']}
                        >
                            Address
                        </label>

                        <input
                            type="text"
                            id="customerAddress"
                            name="address"
                            className={styles['input-field']}
                            placeholder="Street, City, District, Province, Country"
                        />
                    </div>
                    <div className={styles['input-group']}>
                        <label
                            htmlFor="customerPhone"
                            className={styles['input-label']}
                        >
                            Phone
                        </label>
                        <input
                            id="customerPhone"
                            type="text"
                            name="phone"
                            className={styles['input-field']}
                            placeholder="Phone numbers separated by commas"
                        />
                    </div>
                    {/* //- Advanced options for customer tab */}
                    <div className={styles['advanced-container']}>
                        <div
                            className={`${styles['input-group']} ${styles['input-group--check']}`}
                        >
                            <label
                                htmlFor="customerTab"
                                className={styles['input-label--check']}
                            >
                                More Options
                            </label>
                            <input
                                type="checkbox"
                                className={styles['input-field--check']}
                                id="customerTab"
                                name="tab"
                                value={tabOptions}
                                onChange={handleTab}
                            />
                        </div>
                        {tabOptions && (
                            <div className={styles['advanced-group']}>
                                <div
                                    className={`${styles['input-group']} ${styles['input-group--tab']}`}
                                >
                                    <label
                                        htmlFor="purchase"
                                        className={styles['input-label']}
                                    >
                                        Purchased
                                    </label>
                                    <input
                                        id="purchase"
                                        name="purchase"
                                        type="text"
                                        className={styles['input-field']}
                                        placeholder="Purchased Amount"
                                        onChange={handleDueAmount}
                                    />
                                </div>
                                <div
                                    className={`${styles['input-group']} ${styles['input-group--tab']}`}
                                >
                                    <label
                                        htmlFor="paid"
                                        className={styles['input-label']}
                                    >
                                        Paid
                                    </label>
                                    <input
                                        id="paid"
                                        name="paid"
                                        type="text"
                                        className={styles['input-field']}
                                        placeholder="Paid Amount"
                                        onChange={handleDueAmount}
                                    />
                                </div>
                                <div
                                    className={`${styles['input-group']} ${styles['input-group--tab']}`}
                                >
                                    <label
                                        htmlFor="due"
                                        className={styles['input-label']}
                                    >
                                        Due
                                    </label>
                                    <input
                                        id="due"
                                        name="due"
                                        type="text"
                                        value={dueAmount}
                                        className={`${styles['input-field']} ${styles['input-field--due']}`}
                                        placeholder="Due Amount"
                                        readOnly={true}
                                        // disabled={true}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <Button className="action01 go" onClick={handleForm}>
                        Add customer
                    </Button>
                </form>
                <ErrorFormFooter
                    pendingStatus={pendingStatus}
                    errorMessage={errorMessage}
                />
            </div>
            <div className={styles["profile-container"]} >
                {data && <CustomerProfile customer={data} />}
            </div>
        </div>
    );
}
export default CustomerAccount;
