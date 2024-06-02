import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './CustomerRegistry.module.scss';
import { AuthContext } from '../../context/AuthContext';

import Button from '../UI/Button/Button';
import CustomerProfile from '../CustomerProfile/CustomerProfile';
import ErrorFormFooter from '../UI/Error/ErrorFormFooter';

import useAPI from '../../hooks/useAPI';

const cx = classNames.bind(styles);

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

function CustomerRegistry() {
    const { jwtToken } = useContext(AuthContext);
    const [dueAmount, setDueAmount] = useState('');
    const [purchaseAmount, setPurchaseAmount] = useState('');
    const [paidAmount, setPaidAmount] = useState('');
    const [tabOptions, setTabOptions] = useState(false);
    const [failures, setFailures] = useState(failuresObject);

    const [posting, setPosting] = useState(''); // sending '' success failure
    let requestBody;
    const [pendingStatus, data, errorMessage, sendRequest, setRequestBody] =
        useAPI({
            url: '/customers',
            method: 'POST',
            jwtToken: jwtToken,
            body: requestBody,
        });

    useEffect(() => {
        setDueAmount(purchaseAmount - paidAmount);
    }, [purchaseAmount, paidAmount]);

    const handleTab = () => {
        setTabOptions((tabOptions) => !tabOptions);
    };

    const handleForm = async (e) => {
        e.preventDefault();
        
        let form = document.getElementById('createCustomerForm');
        let formData = new FormData(form);
        let details = {};
        formData.forEach((value, key) => (details[key] = value));
        sendRequest(details);
        return;
    };

    return (
        <div className={cx('container')}>
            <div className={cx('form-container')}>
                <h3>Add a new customer</h3>
                <form action="" id="createCustomerForm">
                    <InputGroup
                        inputName="name"
                        fieldName="Name"
                        placeholder="Customer's Name"
                        inputId="customerName"
                    />
                    <InputGroup
                        inputName="address"
                        fieldName="Address"
                        inputId="customerAddress"
                        placeholder="Street, City, District, Province, Country"
                    />
                    <InputGroup
                        inputName="phone"
                        fieldName="Phone Number"
                        inputId="customerPhone"
                        placeholder="Phone numbers separated by commas."
                    />

                    <CustomerTabOptions
                        tabOptions={tabOptions}
                        handleTab={handleTab}
                        dueAmount={dueAmount}
                        setPaidAmount={setPaidAmount}
                        setPurchaseAmount={setPurchaseAmount}
                    />
                    <Button className="action01 go" onClick={handleForm}>
                        Add customer
                    </Button>
                </form>
                <ErrorFormFooter
                    pendingStatus={pendingStatus}
                    errorMessage={errorMessage}
                />
            </div>
            <div className={cx('profile-container')}>
                {data && <CustomerProfile customer={data} />}
            </div>
        </div>
    );
}

function InputGroup({ fieldName, inputName, inputId, placeholder }) {
    return (
        <div className={cx('input-group')}>
            <label htmlFor={inputId} className={cx('input-label')}>
                {fieldName}
            </label>
            <input
                type="text"
                id={inputId}
                name={inputName}
                className={cx('input-field')}
                placeholder={placeholder}
            />
        </div>
    );
}

function CustomerTabOptions({
    tabOptions,
    handleTab,
    dueAmount,
    setPurchaseAmount,
    setPaidAmount,
}) {
    return (
        <div className={cx('advanced-container')}>
            <div className={cx('input-group', 'input-group--check')}>
                <label
                    htmlFor="customerTab"
                    className={cx('input-label--check')}
                >
                    More Options
                </label>
                <input
                    type="checkbox"
                    className={cx('input-field--check')}
                    id="customerTab"
                    name="tab"
                    value={tabOptions}
                    onChange={handleTab}
                />
            </div>

            {tabOptions && (
                <div className={cx('advanced-group')}>
                    <CustomerTabInputGroup
                        labelName={'Purchased'}
                        inputId={'purchase'}
                        inputName={'purchase'}
                        placeholder={'Purchased Amount'}
                        onChangeFunction={(e) =>
                            setPurchaseAmount(e.target.value)
                        }
                        classNameModifier={'input-field--purchase'}
                    />

                    <CustomerTabInputGroup
                        labelName={'paid'}
                        inputId={'paid'}
                        inputName={'paid'}
                        placeholder={'Paid Amount'}
                        onChangeFunction={(e) => setPaidAmount(e.target.value)}
                        classNameModifier={'input-field--paid'}
                    />

                    <CustomerTabInputGroup
                        labelName={'Due'}
                        inputId={'due'}
                        inputName={'due'}
                        placeholder={'Due Amount'}
                        readOnly={true}
                        classNameModifier={'input-field--due'}
                        inputValue={dueAmount}
                    />
                </div>
            )}
        </div>
    );
}

function CustomerTabInputGroup({
    labelName,
    inputId,
    inputName,
    placeholder,
    onChangeFunction,
    classNameModifier,
    ...otherProps
}) {
    const { readOnly, inputValue } = otherProps;
    return (
        <div className={cx(['input-group', 'input-group--tab'])}>
            <label htmlFor={inputId} className={cx('input-label')}>
                {labelName}
            </label>
            <input
                id={inputId}
                name={inputName}
                type="text"
                className={cx('input-field', classNameModifier)}
                placeholder={placeholder}
                onChange={onChangeFunction}
                readOnly={readOnly}
                value={inputValue}
            />
        </div>
    );
}

export default CustomerRegistry;
