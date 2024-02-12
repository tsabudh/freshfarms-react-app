import React, { Children, useContext, useEffect, useState } from 'react';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa6';

import Button from '../UI/Button/Button';
import styles from './RegisterBoard.module.scss';
import fetchCustomers from '../../utils/fetchCustomers';
import fetchProducts from '../../utils/fetchProducts';
import { postTransaction } from '../../utils/postTransactions';
import classNames from 'classnames';
import { AuthContext } from '../../context/AuthContext';

const RegisterBoard = (props) => {
    const { token } = useContext(AuthContext);
    const [posting, setPosting] = useState(''); // sending '' success failure
    const { customers, setCustomers, products, setProducts } = props;
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [transactionType, setTransactionType] = useState('purchase');
    const [transactionAmount, setTransactionAmount] = useState(0);
    const [paidInFull, setPaidInFull] = useState(true);
    const [paidAmount, setPaidAmount] = useState(0);

    useEffect(() => {
        let asyncFunc = async () => {
            let customerResults = await fetchCustomers(null, token);
            let productResults = await fetchProducts(null, token);
            console.log(productResults);
            setCustomers(customerResults);
            setProducts(productResults.data);
        };
        asyncFunc();
    }, []);

    useEffect(() => {
        handleTransactionAmount();
    }, [cart]);

    const addToCart = function (e) {
        e.preventDefault();
        setErrorMessage(null);
        const selected = document.getElementById('products');
        const selectedValue = selected.options[selected.selectedIndex].value;

        let selectedItem = products.find((item) => item._id == selectedValue);

        selectedItem.quantity = quantity;
        let newCart = [...cart];

        // Test if this product item is already in the cart
        let searchIndex = cart.findIndex((item) => item._id == selectedValue);

        // If found increase the quantity rather than adding new entry of same item
        if (searchIndex >= 0) {
            // returned index is -1 if not found
            newCart[searchIndex].quantity =
                Number(newCart[searchIndex].quantity) + Number(quantity);
        } else {
            // If product not found on cart, add new entry
            newCart.push({ ...selectedItem });
        }

        setCart(newCart);
    };

    const removeFromCart = (e) => {
        e.preventDefault();
        let elementItem = e.target.parentNode.parentNode.parentNode.parentNode;

        let newCart = [...cart];
        let found = newCart.findIndex((item) => {
            return item._id == elementItem.dataset._id;
        });
        newCart.splice(found, 1);
        setCart(newCart);
    };

    const addTransaction = async (e) => {
        e.preventDefault();
        setPosting('sending');
        setErrorMessage(null);
        let newTransaction = {};

        // Adding customer to transaction
        const selectCustomerEl = document.getElementById('customers');
        const selectedCustomer =
            selectCustomerEl.options[selectCustomerEl.selectedIndex].value;

        newTransaction.customer = {
            customerId: selectedCustomer,
        };

        if (transactionType == 'purchase') {
            // Adding items to transaction
            let items = cart.map((item) => {
                return { productId: item._id, quantity: item.quantity };
            });
            newTransaction.items = items;

            // Adding paidInFull to transaction
            newTransaction.paidInFull = paidInFull;

            // Adding transaction amount if paid in full
            if (paidInFull) {
                newTransaction.paid = transactionAmount;
            } else {
                newTransaction.paid = paidAmount;
            }

            // If not paid in full is selected 'No' but transaction amount equals paid in full
            if (paidAmount == transactionAmount)
                newTransaction.paidInFull = true;
        } else if (transactionType == 'payment') {
            newTransaction.type = 'payment';
            newTransaction.paid = paidAmount;
        }
        let result = await postTransaction(newTransaction, token);
        if (result.status == 'success') {
            setPosting('success');
            setErrorMessage(null);
            setPaidAmount(0);
            let productResponse = await fetchProducts(null, token);
            console.log(productResponse); //!    JWT MALFORMED
            setProducts(productResponse.data);
            props.setFilterObject({
                sortBy: {
                    issuedTime: -1,
                },
                limit: 5,
            });
        } else {
            setPosting('failure');
            setErrorMessage(result.message);
        }
    };

    const handlePaidAmount = (e) => {
        console.log(e.target.value);
        setPaidAmount(e.target.value);
    };
    const handleTransactionAmount = () => {
        let totalAmount = cart.reduce((accumulator, currentItem) => {
            return accumulator + currentItem.price * currentItem.quantity;
        }, 0);

        // If paidInFull is true, set paidAmount as totalAmount
        setTransactionAmount(totalAmount);
        // console.log(paidInFull);
        // console.log(transactionAmount);
        // console.log(paidAmount);

        // document.getElementById('transactionRegistrationForm').style.setProperty('--')
    };

    return (
        <>
            <div className={styles['form-container']}>
                <h3>Register new transaction {paidInFull}</h3>
                <form action="" id="transactionRegistrationForm">
                    <div className={styles['tab-container']}>
                        <div
                            className={`${styles['tab']} ${
                                transactionType == 'purchase'
                                    ? styles.active
                                    : ''
                            }`}
                            onClick={() => setTransactionType('purchase')}
                        >
                            Purchase
                        </div>
                        <div
                            className={`${styles['tab']} ${
                                transactionType == 'payment'
                                    ? styles.active
                                    : ''
                            }`}
                            onClick={() => setTransactionType('payment')}
                        >
                            Payment
                        </div>
                    </div>
                    {transactionType == 'purchase' ? (
                        <div className={styles['purchase']}>
                            <div className={styles['form-group']}>
                                <label htmlFor="customers">Customer :</label>
                                <select name="" id="customers">
                                    {customers.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles['form-group']}>
                                <label htmlFor="">Add Items:</label>
                                <select name="products" id="products">
                                    {products.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value)
                                    }
                                    min={1}
                                />
                                <Button
                                    className="stylish03"
                                    onClick={addToCart}
                                >
                                    add
                                </Button>
                            </div>

                            <div className={styles['cart']}>
                                {/* //* HEAD */}
                                {cart.length > 0 ? (
                                    <div
                                        className={`${styles['cart-item']} ${styles['cart-item--head']}`}
                                    >
                                        <div
                                            className={`${styles['cart-item-piece--head']} ${styles['cart-item-piece']} ${styles['cart-item-piece--id']}`}
                                        >
                                            <span
                                                className={
                                                    styles[
                                                        'cart-item-piece-label'
                                                    ]
                                                }
                                            >
                                                PID
                                            </span>
                                        </div>
                                        <div
                                            className={`${styles['cart-item-piece--head']} ${styles['cart-item-piece']} ${styles['cart-item-piece--name']}`}
                                        >
                                            <span
                                                className={
                                                    styles[
                                                        'cart-item-piece-label'
                                                    ]
                                                }
                                            >
                                                Item
                                            </span>
                                        </div>
                                        <div
                                            className={`${styles['cart-item-piece--head']} ${styles['cart-item-piece']} ${styles['cart-item-piece--price']}`}
                                        >
                                            <span
                                                className={
                                                    styles[
                                                        'cart-item-piece-label'
                                                    ]
                                                }
                                            >
                                                Price
                                            </span>
                                        </div>
                                        <div
                                            className={`${styles['cart-item-piece--head']} ${styles['cart-item-piece']} ${styles['cart-item-piece--quantity']}`}
                                        >
                                            <span
                                                className={
                                                    styles[
                                                        'cart-item-piece-label'
                                                    ]
                                                }
                                            >
                                                Quantity
                                            </span>
                                        </div>
                                    </div>
                                ) : null}

                                {cart.map((item) => {
                                    return (
                                        <CartItem
                                            item={item}
                                            key={item._id}
                                            removeFromCart={removeFromCart}
                                        />
                                    );
                                })}
                            </div>

                            <div className={styles['form-group']}>
                                <div className={styles['pay']}>
                                    <div className={styles['type']}>
                                        Paid in full?
                                        <div className={styles['grouped']}>
                                            <input
                                                name="paidInFull"
                                                type="radio"
                                                id="paidInFullYes"
                                                onChange={() =>
                                                    setPaidInFull(true)
                                                }
                                                value={true}
                                                checked={paidInFull}
                                            />

                                            <label htmlFor="paidInFullYes">
                                                <span
                                                    className={`${styles['custom-radio']} ${styles.yes}`}
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        setPaidInFull(true);
                                                    }}
                                                ></span>
                                                <span>Yes</span>
                                            </label>
                                        </div>
                                        <div className={styles['grouped']}>
                                            <input
                                                name="paidInFull"
                                                type="radio"
                                                id="paidInFullNo"
                                                onChange={() =>
                                                    setPaidInFull(false)
                                                }
                                                value={false}
                                                checked={!paidInFull}
                                            />

                                            <label htmlFor="paidInFullNo">
                                                <span
                                                    className={`${styles['custom-radio']} ${styles.no}`}
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        setPaidInFull(false);
                                                    }}
                                                ></span>
                                                <span>No</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className={styles['amount']}>
                                        <span>Paid :</span>
                                        {paidInFull ? (
                                            <input
                                                type="number"
                                                value={transactionAmount}
                                                readOnly={true}
                                                width={`${
                                                    transactionAmount.toString()
                                                        .length
                                                }ch`}
                                            />
                                        ) : (
                                            <input
                                                type="number"
                                                value={paidAmount}
                                                onChange={handlePaidAmount}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                className={classNames(`stylish01`, {
                                    loading: posting == 'sending',
                                })}
                                onClick={addTransaction}
                            >
                                ADD TRANSACTION
                            </Button>
                        </div>
                    ) : (
                        <div className={styles['payment']}>
                            <div className={styles['form-group']}>
                                <label htmlFor="customers">Customer :</label>
                                <select name="" id="customers">
                                    {customers.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles['form-group']}>
                                <label htmlFor="">Paid :</label>
                                <input
                                    type="number"
                                    value={paidAmount}
                                    onChange={handlePaidAmount}
                                />
                            </div>
                            <Button
                                className={classNames(`stylish01`, {
                                    loading: posting == 'sending',
                                })}
                                onClick={addTransaction}
                            >
                                ADD TRANSACTION
                            </Button>
                        </div>
                    )}
                </form>
                <div className={styles['form-footer']}>
                    {posting != '' ? (
                        <span
                            className={`${styles['status']} ${styles[posting]}`}
                        >
                            {posting == 'success'
                                ? 'SUCCESS'
                                : posting == 'sending'
                                ? 'CREATING'
                                : posting == 'failure'
                                ? 'FAILED'
                                : ''}
                        </span>
                    ) : null}
                    {errorMessage && (
                        <span className={`${styles['error']}`}>
                            {errorMessage}
                        </span>
                    )}
                </div>
            </div>
        </>
    );
};

export default RegisterBoard;

function CartItem(props) {
    const { item, removeFromCart } = props;
    return (
        <div className={styles['cart-item']} key={item._id} data-_id={item._id}>
            <div
                className={`${styles['cart-item-piece']} ${styles['cart-item-piece--id']}`}
            >
                <span className={styles['cart-item-piece-value']}>
                    {item._id}
                </span>
            </div>
            <div
                className={`${styles['cart-item-piece']} ${styles['cart-item-piece--name']}`}
            >
                <span className={styles['cart-item-piece-value']}>
                    {item.name}
                </span>
            </div>
            <div
                className={`${styles['cart-item-piece']} ${styles['cart-item-piece--price']}`}
            >
                <span className={styles['cart-item-piece-value']}>
                    {item.price}
                </span>
            </div>
            <div
                className={`${styles['cart-item-piece']} ${styles['cart-item-piece--quantity']}`}
            >
                <span className={styles['cart-item-piece-value']}>
                    {item.quantity}
                </span>
                <span
                    className={styles['cart-item-piece-delete']}
                    onClick={(e) => {
                        removeFromCart(e);
                    }}
                >
                    <MdOutlineDeleteForever />
                </span>
            </div>
        </div>
    );
}
