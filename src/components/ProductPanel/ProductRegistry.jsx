import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './ProductRegistry.module.scss';
import { AuthContext } from '../../context/AuthContext';

import ProductCard from './ProductCard';
import Button from '../UI/Button/Button';
import ErrorFormFooter from '../UI/Error/ErrorFormFooter';
import useAPI from '../../hooks/useAPI';

const cx = classNames.bind(styles);

const failuresObject = {
    name: false,
    nameMessage: '',
    address: false,
    addressMessage: '',
    stock: true,
    stockMessage: '',
    tab: false,
    purchase: false,
    paid: false,
};

function ProductRegistry() {
    const { jwtToken } = useContext(AuthContext);
    const [dueAmount, setDueAmount] = useState('');
    const [purchaseAmount, setPurchaseAmount] = useState('');
    const [paidAmount, setPaidAmount] = useState('');
    const [tabOptions, setTabOptions] = useState(false);
    const [failures, setFailures] = useState(failuresObject);

    const [error, setError] = useState(null);

    const [posting, setPosting] = useState(''); // sending '' success failure

    const createProductFormRef = useRef(null);

    let requestBody;
    const [pendingStatus, data, errorMessage, sendRequest, setRequestBody] =
        useAPI({
            url: '/products',
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
            let form = createProductFormRef.current;
            let formData = new FormData(form);

            let details = {};
            formData.forEach((value, key) => {
                switch (key) {
                    case 'name':
                        if (value.length < 3) {
                            throw new Error(
                                'Product name must have at least three characters.'
                            );
                        }

                        const nameRegex = /^[a-zA-Z]+$/;
                        if (!nameRegex.test(value))
                            throw new Error(
                                'Please enter a valid name for product.'
                            );
                        break;

                    case 'type':
                        const typeRegex = /^[a-zA-Z]+$/;
                        if (!typeRegex.test(value))
                            throw new Error(
                                'Please enter a valid type for product.'
                            );
                        break;

                    case 'stock':
                    case 'price':
                        if (value.length == 0)
                            throw new Error(`Please enter a number in ${key} field.`);
                        const stockRegex = /^\D.*$/;
                        if (stockRegex.test(value)) {
                            throw new Error(`Please enter a valid number in ${key} field.`);
                        }
                        break;
                }

                details[key] = value;
            });
            sendRequest(details);
            return;
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('form-container')}>
                <h3>Add a new product</h3>
                <form
                    action=""
                    id="createProductForm"
                    ref={createProductFormRef}
                >
                    <InputGroup
                        inputName="name"
                        fieldName="Name"
                        placeholder="Product's Name"
                        inputId="productName"
                    />
                    <InputGroup
                        inputName="price"
                        fieldName="Price"
                        inputId="productPrice"
                        placeholder="Price"
                    />

                    <InputGroup
                        inputName="stock"
                        fieldName="Stock"
                        inputId="productStock"
                        placeholder="Stock"
                    />
                    <InputGroup
                        inputName="type"
                        fieldName="Type"
                        inputId="productType"
                        placeholder="Cow, Buffalo, Mixed, Imported"
                    />
                    <InputGroup
                        inputName="code"
                        fieldName="Product Code"
                        inputId="productCode"
                        placeholder="'cm' for cow milk!"
                    />
                    <InputGroup
                        inputName="unit"
                        fieldName="Unit of measurement"
                        inputId="productUnit"
                        placeholder="kg or litre or any"
                    />

                    <Button className="action01 go" onClick={handleForm}>
                        Add product
                    </Button>
                </form>

                <div>{error}</div>
                <ErrorFormFooter
                    pendingStatus={pendingStatus}
                    errorMessage={errorMessage}
                />
            </div>
            <div className={cx('profile-container')}>
                {data && <ProductCard product={data} />}
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

export default ProductRegistry;
