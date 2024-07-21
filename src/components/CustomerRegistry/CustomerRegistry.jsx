import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './CustomerRegistry.module.scss';
import { AuthContext } from '../../context/AuthContext';

import Button from '../UI/Button/Button';
import CustomerProfileCard from '../CustomerProfile/CustomerProfileCard';
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

    const [error, setError] = useState(null);

    const [posting, setPosting] = useState(''); // sending '' success failure

    const createCustomerFormRef = useRef(null);

    let requestBody;
    const [pendingStatus, data, errorMessage, sendRequest, setRequestBody] =
        useAPI({
            url: '/customers/all',
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

        try {
            let form = createCustomerFormRef.current;
            let formData = new FormData(form);
            console.log(
                formData.get('password') == formData.get('confirmPassword')
            );
            let details = {};
            formData.forEach((value, key) => {
                switch (key) {
                    case 'name':
                        if (value.length < 3)
                            throw new Error(
                                'Name must have at least three characters.'
                            );

                        const nameRegex = /^[a-zA-Zà-žÀ-Ž' -]+$/;
                        if (!nameRegex.test(value))
                            throw new Error('Please enter a valid name.');
                        break;
                    case 'username':
                        if (value.length < 3)
                            throw new Error(
                                'Username must have more than three characters.'
                            );
                        const regex = /^[^a-zA-Z]/;
                        if (regex.test(value))
                            throw new Error(
                                'Invalid username, please start username with [a-Z]'
                            );
                        break;
                    case 'password':
                        if (
                            formData.get('password') !=
                            formData.get('confirmPassword')
                        )
                            throw new Error(
                                'Password and ConfirmPassword did not match.'
                            );
                        break;
                    case 'address':
                        if (value.length == 0)
                            throw new Error('Address is required.');
                        break;
                }

                details[key] = value;
            });
            // sendRequest(details);
            return;
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('form-container')}>
                <h3>Add a new customer</h3>
                <form
                    action=""
                    id="createCustomerForm"
                    ref={createCustomerFormRef}
                >
                    <InputGroup
                        inputName="name"
                        fieldName="Name"
                        placeholder="Customer's Name"
                        inputId="customerName"
                    />
                    <InputGroup
                        inputName="username"
                        fieldName="Username"
                        inputId="customerUsername"
                        placeholder="Username"
                    />
                    <InputGroup
                        inputName="password"
                        fieldName="Password"
                        inputId="customerPassword"
                        placeholder="********"
                        type="password"
                    />
                    <InputGroup
                        inputName="confirmPassword"
                        fieldName="Confirm Password"
                        inputId="customerConfirmPassword"
                        placeholder="********"
                        type="password"
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

                <div>{error}</div>
                <ErrorFormFooter
                    pendingStatus={pendingStatus}
                    errorMessage={errorMessage}
                />
            </div>
            <div className={cx('profile-container')}>
                {data && <CustomerProfileCard customer={data} />}
            </div>
        </div>
    );
}

function InputGroup({
    fieldName,
    inputName,
    inputId,
    placeholder,
    type = 'text',
}) {
    return (
        <div className={cx('input-group')}>
            <label htmlFor={inputId} className={cx('input-label')}>
                {fieldName}
            </label>
            <input
                type={type}
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
