import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

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

const copyText = (e) => {
    navigator.clipboard.writeText(e.target.innerText.substring(0, 500));
    toast('Copied', {
        position: 'top-right',
        theme: 'colored',
        toastId: 'copyId',
    });
};

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

    const [customerName, setCustomerName] = useState(null);
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
            setCustomerName(customer.name);
        }
    }, [customer]);

    const handleCustomerName = (e) => {
        setCustomerName(e.target.value);
    };
    const handleCustomerAddress = (e) => {
        setCustomerAddress(e.target.value);
    };
    const handleCustomerPhone = (e) => {
        setCustomerPhone(e.target.value);
    };
    const deleteStoredPhoneTag = (e) => {
        //- Return if not editing
        if (!editingStatus) return;

        let tempCustomerPhoneArray = [...customerPhoneArray];
        let matchedIndex = tempCustomerPhoneArray.findIndex(
            (elem) => elem == e.target.innerText.toLowerCase()
        );
        if (matchedIndex >= 0) tempCustomerPhoneArray.splice(matchedIndex, 1);
        setCustomerPhoneArray(tempCustomerPhoneArray);
    };
    const deleteAddedPhoneTag = (e) => {
        //- Return if not editing
        if (!editingStatus) return;

        let tempAddedPhones = [...addedPhones];
        let matchedIndex = tempAddedPhones.findIndex(
            (elem) => elem == e.target.innerText.toLowerCase()
        );
        console.log(e.target.innerText);
        console.log(matchedIndex);
        if (matchedIndex >= 0) tempAddedPhones.splice(matchedIndex, 1);
        setAddedPhones(tempAddedPhones);
        console.log(tempAddedPhones);
    };

    const addCustomerPhone = (e) => {
        console.log('trigger');
        let newPhoneArray = [...addedPhones];

        // let newNumber = document.getElementById('phoneToAdd').value;
        let newNumber = customerPhone.toLowerCase().trim();

        //- adding new number to added phone state variable
        let newSet = new Set(newPhoneArray);
        if (newNumber.includes(',')) {
            let numArr = newNumber.split(',');
            numArr.forEach((num) => newSet.add(num));
        } else {
            newSet.add(newNumber);
        }
        console.log(newSet);
        setAddedPhones(Array.from(newSet));

        //- clearing input field after addition
        setCustomerPhone('');
        newPhoneArray.push(newNumber);
    };

    const cancelEdits = () => {
        setCustomerAddress(customer.address);
        setCustomerPhoneArray(customer.phone);
        setCustomerName(customer.name);

        setAddedPhones([]);
        setEditingStatus(false);
    };
    const saveEdits = async (id) => {
        let customerDetails = {};
        customerDetails.name = customerName;
        customerDetails.address = customerAddress;
        customerDetails.phone = [...addedPhones, ...customerPhoneArray];
        let result = await updateCustomer(id, customerDetails);
        console.log(result);
        if (result.status == 'success') {
            setCustomer(result.data);
            setEditingStatus(false);
            console.log('update successful !! ');
        } else {
            console.log(result);
            if (result.message) toast(result.message);
            if (result.errors)
                toast(result.errors[0].msg, { toastId: 'updateCustomer' });
        }
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
                                    <Tag
                                        className="orange01"
                                        onClick={copyText}
                                        title="Copy ID"
                                    >
                                        {customer._id}
                                    </Tag>
                                </div>
                            </div>
                            <div className={styles['detail']}>
                                <div className={styles['detail_name']}>
                                    Name
                                </div>
                                <div className={styles['detail_value']}>
                                    {customer.name}
                                    {editingStatus && (
                                        <div
                                            className={styles['input-wrapper']}
                                        >
                                            <input
                                                type="text"
                                                value={customerName}
                                                onChange={handleCustomerName}
                                            />
                                        </div>
                                    )}
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
                                            onClick={deleteStoredPhoneTag}
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
                                                onClick={deleteAddedPhoneTag}
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
                                            <Button
                                                onClick={addCustomerPhone}
                                                className="sharp01"
                                            >
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
                        <div className={styles['actions']}>
                            <Button
                                className="action01 wait"
                                onClick={() => setEditingStatus(true)}
                            >
                                Edit
                            </Button>
                            {editingStatus && (
                                <Button
                                    className="action01 stop"
                                    onClick={() => cancelEdits(id)}
                                >
                                    Cancel
                                </Button>
                            )}

                            <Button
                                className="action01 go"
                                onClick={() => saveEdits(id)}
                                disabled={!editingStatus}
                            >
                                Save
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
