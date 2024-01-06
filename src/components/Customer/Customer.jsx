import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';

import { useParams, useNavigate } from 'react-router-dom';
import fetchCustomers from '../../utils/fetchCustomers';
import updateCustomer from '../../utils/updateCustomer';
import styles from './Customer.module.scss';
import { fetchTransactions } from '../../utils/fetchTransactions';
import Button from '../UI/Button/Button';
import TicketTable from '../TicketTable/TicketTable';
import SortAndFilter from '../SortAndFilter/SortAndFilter';
import Tag from '../UI/Tag/Tag';

function Customer() {
    const { id } = useParams();
    const navigate = useNavigate();

    const initialFilterObject = {
        sortBy: {
            issuedTime: -1,
        },
        customerId: id,
    };

    const [customer, setCustomer] = useState(null);
    const [editingStatus, setEditingStatus] = useState(false);

    const [transactions, setTransactions] = useState([]);
    const [filterObject, setFilterObject] = useState(initialFilterObject);

    const [customerAddress, setCustomerAddress] = useState(null);
    const [customerPhoneArray, setCustomerPhoneArray] = useState([]);
    const [customerPhone, setCustomerPhone] = useState('');
    const [addedPhones, setAddedPhones] = useState([]);

    //- INITIALIZING CUSTOMER AND TRANSACTIONS
    useEffect(() => {
        const asyncWrapper = async () => {
            let customerResult = await fetchCustomers(id);
            let transactionResults = await fetchTransactions(
                initialFilterObject
            );
            console.log(customerResult);
            setCustomer(customerResult);
            setTransactions(transactionResults);
        };
        asyncWrapper();
    }, []);

    //- INITIALIZING STATE VARIABLES FOR CUSTOMER ADDRESS AND PHONES
    useEffect(() => {
        if (customer) {
            setCustomerAddress(customer.address);
            setCustomerPhoneArray(customer.phone);
        }
    }, [customer]);

    const handleCustomerAddress = (e) => {
        setCustomerAddress(e.target.value);
    };
    const handleCustomerPhone = (e) => {
        setCustomerPhone(e.target.value);
    };

    const addCustomerPhone = (e) => {
        console.log('trigger');
        let newPhoneArray = [...addedPhones];

        // let newNumber = document.getElementById('phoneToAdd').value;
        let newNumber = customerPhone;

        //- adding new number to added phone state variable
        let newSet = new Set(newPhoneArray);
        newSet.add(newNumber);
        console.log(newSet);
        setAddedPhones(Array.from(newSet));

        //- clearing input field after addition
        setCustomerPhone('');
        newPhoneArray.push(newNumber);
    };

    const cancelEdits = () => {
        setCustomerAddress(customer.address);
        setCustomerPhoneArray(customer.phone);

        setAddedPhones([]);
        setEditingStatus(false);
    };
    const saveEdits = async (id) => {
        return;
        console.log(id);
        let customerDetails = {};
        console.log(customerAddress);
        customerDetails.address = customerAddress;
        let result = await updateCustomer(id, customerDetails);
        console.log('updated?');
        setCustomer(result);
        setEditingStatus(false);
    };

    return (
        customer && (
            <div className={styles['container']}>
                <Button
                    className="stylish04 large-text"
                    onClick={() => navigate(-1)}
                >
                    <IoIosArrowRoundBack />
                </Button>

                <div className={styles['first-row']}>
                    <div className={styles['first-row_left']}>
                        <div className={styles['profile']}>
                            <figure className={styles['profile_picture']}>
                                <img
                                    src="/img/profile-picture.jpg"
                                    alt={customer.name}
                                />
                            </figure>
                            <span className={styles['profile_name']}>
                                {customer.name}
                            </span>
                            <div className={styles['tab']}>
                                <div className={styles['purchase']}>
                                    <p>Purchase</p>

                                    {customer.tab.purchase}
                                </div>
                                <div className={styles['paid']}>
                                    <p>Paid</p>
                                    {customer.tab.paid}
                                </div>
                                <div className={styles['due']}>
                                    <p>Due</p>
                                    {customer.tab.due}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles['first-row_right']}>
                        <div className={styles['details']}>
                            <div className={styles['detail']}>
                                <div className={styles['detail_name']}>
                                    Customer ID
                                </div>
                                <div className={styles['detail_value']}>
                                    {customer._id}
                                </div>
                            </div>
                            <div className={styles['detail']}>
                                <div className={styles['detail_name']}>
                                    Phone
                                </div>
                                <div className={styles['detail_value']}>
                                    {customerPhoneArray.map((item) => (
                                        <Tag
                                            key={item}
                                            className={`${
                                                editingStatus
                                                    ? ''
                                                    : 'inherit-text'
                                            }`}
                                        >
                                            {item}
                                        </Tag>
                                    ))}
                                    {editingStatus &&
                                        addedPhones.map((item) => (
                                            <Tag
                                                key={item}
                                                className={`${
                                                    editingStatus
                                                        ? 'green01'
                                                        : 'inherit-text'
                                                }`}
                                            >
                                                {item}
                                            </Tag>
                                        ))}
                                    {editingStatus && (
                                        <div
                                            className={styles['input-wrapper']}
                                        >
                                            <input
                                                type="text"
                                                value={customerPhone}
                                                onChange={handleCustomerPhone}
                                                id="phoneToAdd"
                                            />
                                            <Button onClick={addCustomerPhone}>
                                                ADD
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles['detail']}>
                                <div className={styles['detail_name']}>
                                    Address
                                </div>

                                <div className={styles['detail_value']}>
                                    {customer.address}
                                    {editingStatus && (
                                        <div
                                            className={styles['input-wrapper']}
                                        >
                                            <input
                                                type="text"
                                                value={customerAddress}
                                                onChange={handleCustomerAddress}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <Button onClick={() => setEditingStatus(true)}>
                                EDIT
                            </Button>
                            <Button onClick={() => saveEdits(id)}>SAVE</Button>
                            <Button onClick={() => cancelEdits(id)}>
                                CANCEL
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={styles['second-row']}>
                    <div className={styles['transactions']}>
                        <SortAndFilter
                            setFilterObject={setFilterObject}
                            customerId={customer._id}
                        />
                        <TicketTable filterObject={filterObject} />
                    </div>
                </div>
            </div>
        )
    );
}

export default Customer;
