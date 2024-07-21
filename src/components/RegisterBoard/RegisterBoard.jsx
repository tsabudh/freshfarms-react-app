import React, { useContext, useEffect, useState } from 'react';
import { MdOutlineDeleteForever } from 'react-icons/md';
import classNames from 'classnames/bind';

import { AuthContext } from '../../context/AuthContext';
import styles from './RegisterBoard.module.scss';

import Button from '../UI/Button/Button';
import fetchCustomers from '../../utils/fetchCustomers';
import fetchProducts from '../../utils/fetchProducts';
import { postTransaction } from '../../utils/postTransactions';

const cx = classNames.bind(styles);

const RegisterBoard = (props) => {
    const {
        customers,
        setCustomers,
        products,
        setProducts,
        setTransactionFilterObject,
    } = props;
    const { jwtToken } = useContext(AuthContext);
    const [posting, setPosting] = useState(''); // sending '' success failure
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [transactionType, setTransactionType] = useState('purchase');
    const [transactionAmount, setTransactionAmount] = useState(0);
    const [paidInFull, setPaidInFull] = useState(true);
    const [paidAmount, setPaidAmount] = useState(0);
    const [selectedProductUnit, setSelectedProductUnit] = useState(null);

    useEffect(() => {
        let asyncFunc = async () => {
            let customerResponseObject = await fetchCustomers(null, jwtToken);
            let productResponseObject = await fetchProducts(null, jwtToken);

            if (customerResponseObject.status == 'success') {
                setCustomers(customerResponseObject.data);
            }
            if (productResponseObject.status == 'success') {
                setProducts(productResponseObject.data);
            }
        };
        asyncFunc();
    }, []);

    useEffect(() => {
        handleTransactionAmount();
    }, [cart]);

    const addToCart = (e) => {
        e.preventDefault();
        setErrorMessage(null);

        const selected = document.getElementById('products');
        if (!selected) {
            setErrorMessage('Product selection element not found.');
            return;
        }

        const selectedValue = selected.options[selected.selectedIndex].value;
        if (!selectedValue) {
            setErrorMessage('No product selected.');
            return;
        }

        const selectedItem = products.find(
            (item) => item._id === selectedValue
        );
        if (!selectedItem) {
            setErrorMessage('Selected product not found.');
            return;
        }

        selectedItem.quantity = Number(quantity);

        const existingItemIndex = cart.findIndex(
            (item) => item._id === selectedValue
        );
        const newCart = [...cart];

        if (existingItemIndex >= 0) {
            newCart[existingItemIndex].quantity += Number(quantity);
        } else {
            newCart.push({ ...selectedItem });
        }

        setCart(newCart);
    };

    const removeFromCart = (_, id) => {
        let newCart = [...cart];
        let found = newCart.findIndex((item) => {
            return item._id == id;
        });

        newCart.splice(found, 1);
        setCart(newCart);
    };

    const addTransaction = async (e) => {
        e.preventDefault();
        setPosting('sending');
        setErrorMessage(null);

        const selectedCustomer = document.getElementById('customers').value;

        const newTransaction = {
            customer: { customerId: selectedCustomer },
        };

        if (transactionType === 'purchase') {
            const items = cart.map((item) => ({
                productId: item._id,
                quantity: item.quantity,
            }));

            newTransaction.items = items;
            newTransaction.paidInFull = paidInFull;
            newTransaction.paid = paidInFull ? transactionAmount : paidAmount;
            // newTransaction.paidInFull = paidAmount === transactionAmount;
        } else if (transactionType === 'payment') {
            newTransaction.type = 'payment';
            newTransaction.paid = paidAmount;
        }

        const result = await postTransaction(newTransaction, jwtToken);

        if (result.status === 'success') {
            setPosting('success');
            setErrorMessage(null);
            setPaidAmount(0);
            setCart([]);
            // const productResponse = await fetchProducts(null, jwtToken);
            // setProducts(productResponse.data);
            setTransactionFilterObject({
                sortBy: { issuedTime: -1 },
                limit: 5,
            });
        } else {
            setPosting('failure');
            setErrorMessage(result.message);
        }
    };

    const handlePaidAmount = (e) => {
        setPaidAmount(Number(e.target.value));
    };

    const handleTransactionAmount = () => {
        let totalAmount = cart.reduce((accumulator, currentItem) => {
            return accumulator + currentItem.price * currentItem.quantity;
        }, 0);

        if (paidInFull) setTransactionAmount(totalAmount);
    };

    return (
        <>
            <div className={styles['form-container']}>
                <h3>Register new transaction {paidInFull}</h3>
                <form action="" id="transactionRegistrationForm">
                    <div className={styles['tab-container']}>
                        <div
                            className={`${styles['tab']} ${
                                styles['purchase']
                            } ${
                                transactionType == 'purchase'
                                    ? styles.active
                                    : ''
                            }`}
                            onClick={() => setTransactionType('purchase')}
                        >
                            Purchase
                        </div>
                        <div
                            className={`${styles['tab']} ${styles['payment']} ${
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
                        <PurchaseUI
                            customers={customers}
                            setSelectedProductUnit={setSelectedProductUnit}
                            setPaidInFull={setPaidInFull}
                            setQuantity={setQuantity}
                            products={products}
                            quantity={quantity}
                            selectedProductUnit={selectedProductUnit}
                            addToCart={addToCart}
                            cart={cart}
                            removeFromCart={removeFromCart}
                            paidInFull={paidInFull}
                            transactionAmount={transactionAmount}
                            posting={posting}
                            addTransaction={addTransaction}
                            handlePaidAmount={handlePaidAmount}
                            paidAmount={paidAmount}
                        />
                    ) : (
                        <PaymentUI
                            customers={customers}
                            addTransaction={addTransaction}
                            handlePaidAmount={handlePaidAmount}
                            posting={posting}
                            paidAmount={paidAmount}
                        />
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
                        <span className={`${styles['error-message']}`}>
                            {errorMessage}
                        </span>
                    )}
                </div>
            </div>
        </>
    );
};

export default RegisterBoard;

function Cart({ cart, removeFromCart, transactionAmount }) {
    return (
        <div className={styles['cart']}>
            {/* //* HEAD */}
            {cart.length > 0 ? (
                <div
                    className={`${styles['cart-item']} ${styles['cart-item--head']}`}
                >
                    <div
                        className={`${styles['cart-item-piece--head']} ${styles['cart-item-piece']} ${styles['cart-item-piece--name']}`}
                    >
                        <span className={styles['cart-item-piece-label']}>
                            Item
                        </span>
                    </div>
                    <div
                        className={`${styles['cart-item-piece--head']} ${styles['cart-item-piece']} ${styles['cart-item-piece--price']}`}
                    >
                        <span className={styles['cart-item-piece-label']}>
                            Unit price
                        </span>
                    </div>
                    <div
                        className={`${styles['cart-item-piece--head']} ${styles['cart-item-piece']} ${styles['cart-item-piece--quantity']}`}
                    >
                        <span className={styles['cart-item-piece-label']}>
                            Quantity
                        </span>
                    </div>
                    <div
                        className={`${styles['cart-item-piece--head']} ${styles['cart-item-piece']} ${styles['cart-item-piece--quantity']}`}
                    >
                        <span className={styles['cart-item-piece-label']}>
                            Price
                        </span>
                    </div>
                    <div
                        className={`${styles['cart-item-piece--head']} ${styles['cart-item-piece']} ${styles['cart-item-piece--delete']}`}
                    >
                        <span
                            className={styles['cart-item-piece-delete']}
                        ></span>
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

            {cart.length > 0 ? (
                <div className={cx('total-price')}>
                    <span className={cx("label")}>Total Price:</span>
                    <span className={cx("price")}>{transactionAmount}</span>
                </div>
            ) : null}
        </div>
    );
}

function CartItem(props) {
    const { item, removeFromCart } = props;
    return (
        <div className={styles['cart-item']} key={item._id}>
            {/* <div
                className={`${styles['cart-item-piece']} ${styles['cart-item-piece--id']}`}
            >
                <span className={styles['cart-item-piece-value']}>
                    {item._id}
                </span>
            </div> */}
            <div
                className={`${styles['cart-item-piece']} ${styles['cart-item-piece--name']}`}
                title={item._id}
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
            </div>

            <div
                className={`${styles['cart-item-piece']} ${styles['cart-item-piece--price']}`}
            >
                <span className={styles['cart-item-piece-value']}>
                    {item.price * item.quantity}
                </span>
            </div>
            <div
                className={`${styles['cart-item-piece']} ${styles['cart-item-piece--delete']}`}
            >
                <span
                    className={styles['cart-item-piece-delete']}
                    onClick={(e) => {
                        removeFromCart(e, item._id);
                    }}
                >
                    <MdOutlineDeleteForever />
                </span>
            </div>
        </div>
    );
}

function PurchaseUI({
    customers,
    setSelectedProductUnit,
    setPaidInFull,
    setPaidAmount,
    setQuantity,
    products,
    quantity,
    selectedProductUnit,
    addToCart,
    cart,
    removeFromCart,
    paidInFull,
    transactionAmount,
    posting,
    addTransaction,
    handlePaidAmount,
    paidAmount,
}) {
    return (
        <div className={styles['purchase-dash']}>
            <div className={styles['form-group']}>
                <label htmlFor="customers">Customer :</label>
                <select name="" id="customers">
                    {customers &&
                        customers.map((item) => (
                            <option key={item._id} value={item._id}>
                                {item.name}
                            </option>
                        ))}
                </select>
            </div>
            <div className={styles['form-group']}>
                <label htmlFor="products">Add Items:</label>
                <select
                    name="products"
                    id="products"
                    onChange={(e) => {
                        setSelectedProductUnit(
                            products[e.target.selectedIndex].unit
                        );
                    }}
                >
                    {products?.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <div className="">
                    <input
                        type="number"
                        id="productQuantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min={1}
                    />
                    <span className={styles['unit']}>
                        {selectedProductUnit}
                    </span>
                </div>

                <Button className="amber-03 ghost small" onClick={addToCart}>
                    add
                </Button>
            </div>

            <Cart
                cart={cart}
                removeFromCart={removeFromCart}
                transactionAmount={transactionAmount}
            />

            <div className={styles['form-group']}>
                <div className={styles['pay']}>
                    <div className={styles['type']}>
                        Paid in full?
                        <div className={styles['grouped']}>
                            <input
                                name="paidInFull"
                                type="radio"
                                id="paidInFullYes"
                                onChange={() => setPaidInFull(true)}
                                value={true}
                                checked={paidInFull == true}
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
                                onChange={() => setPaidInFull(false)}
                                value={false}
                                checked={paidInFull == false}
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
                                id="paidAmount"
                                readOnly={true}
                                width={`${
                                    transactionAmount.toString().length
                                }ch`}
                            />
                        ) : (
                            <input
                                type="number"
                                id="paidAmount"
                                value={paidAmount}
                                onChange={handlePaidAmount}
                            />
                        )}
                    </div>
                </div>
            </div>

            <Button
                className={classNames(`berry-02`, `small`, {
                    loading: posting == 'sending',
                })}
                onClick={addTransaction}
            >
                ADD TRANSACTION
            </Button>
        </div>
    );
}

function PaymentUI({
    customers,
    addTransaction,
    handlePaidAmount,
    posting,
    paidAmount,
}) {
    return (
        <div className={styles['payment-dash']}>
            <div className={styles['form-group']}>
                <label htmlFor="customers">Customer :</label>
                <select id="customers">
                    {customers.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles['form-group']}>
                <label htmlFor="paid">Paid :</label>
                <input
                    type="number"
                    value={paidAmount}
                    id="paid"
                    onChange={handlePaidAmount}
                />
            </div>
            <Button
                className={classNames(`berry-02`, `small`, {
                    loading: posting == 'sending',
                })}
                onClick={addTransaction}
            >
                ADD TRANSACTION
            </Button>
        </div>
    );
}
