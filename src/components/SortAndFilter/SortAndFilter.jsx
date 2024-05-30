import React, { useState, useEffect, useReducer } from 'react';

import {
    BsSortAlphaDown,
    BsSortAlphaUpAlt,
    BsSortNumericDown,
    BsSortNumericUpAlt,
} from 'react-icons/bs';

import { RiSortAsc, RiSortDesc } from 'react-icons/ri';

import styles from './SortAndFilter.module.scss';
import Modal from '../UI/Modal/Modal';
import Button from '../UI/Button/Button';
import Tag from '../UI/Tag/Tag';

const initialFilterState = {
    issuedTime: {
        isOpened: false,
        from: '',
        to: Date.now(),
        isSorted: true,
        order: -1,
    },
    products: {
        isOpened: false,
        set: new Set(),
        isSorted: false,
        order: undefined,
    },
    customers: {
        isOpened: false,
        set: new Set(),
        isSorted: false,
        order: undefined,
    },
    totalQuantity: {
        isOpened: false,
        from: 1,
        to: 10,
        isSorted: false,
        order: undefined,
    },
    itemsVariety: {
        isOpened: false,
        from: 0,
        to: 10,
        isSorted: false,
        order: undefined,
    },
};

const updateSortedState = (newFilterState, key, state) => {
    newFilterState[key].isSorted = state;
};

const updateOrderState = (newFilterState, key, order) => {
    newFilterState[key].isSorted = true;
    newFilterState[key].order = parseInt(order);
};

const updateOpenedState = (newFilterState, key, isOpened) => {
    newFilterState[key].isOpened = isOpened;
};

const filterReducer = (filterState, action) => {
    const newFilterState = { ...filterState };
    const {
        type,
        update,
        state,
        order,
        from,
        to,
        newProduct,
        selected,
        newCustomer,
    } = action;

    const sortByMappings = {
        issuedTimeState: () =>
            updateSortedState(newFilterState, 'issuedTime', state),
        issuedTime: () => updateOrderState(newFilterState, 'issuedTime', order),
        customersState: () =>
            updateSortedState(newFilterState, 'customers', state),
        customers: () => updateOrderState(newFilterState, 'customers', order),
        productsState: () =>
            updateSortedState(newFilterState, 'products', state),
        products: () => updateOrderState(newFilterState, 'products', order),
        totalQuantityState: () =>
            updateSortedState(newFilterState, 'totalQuantity', state),
        totalQuantity: () =>
            updateOrderState(newFilterState, 'totalQuantity', order),
        itemsVarietyState: () =>
            updateSortedState(newFilterState, 'itemsVariety', state),
        itemsVariety: () =>
            updateOrderState(newFilterState, 'itemsVariety', order),
        default: () => {},
    };

    const issuedTimeMappings = {
        issuedTimeFrom: () => (newFilterState.issuedTime.from = from),
        issuedTimeTo: () => (newFilterState.issuedTime.to = to),
        remove: () => updateOpenedState(newFilterState, 'issuedTime', false),
        default: () => updateOpenedState(newFilterState, 'issuedTime', true),
    };

    const productsMappings = {
        productSet: () => {
            if (newProduct) newFilterState.products.set.add(newProduct);
        },
        removeProduct: () => newFilterState.products.set.delete(selected),
        remove: () => updateOpenedState(newFilterState, 'products', false),
        default: () => updateOpenedState(newFilterState, 'products', true),
    };

    const customersMappings = {
        customerSet: () => {
            if (newCustomer) newFilterState.customers.set.add(newCustomer);
        },
        removeCustomer: () => {
            if (selected) newFilterState.customers.set.delete(selected);
        },
        remove: () => updateOpenedState(newFilterState, 'customers', false),
        default: () => updateOpenedState(newFilterState, 'customers', true),
    };

    const totalQuantityMappings = {
        totalQuantityRangeFrom: () =>
            (newFilterState.totalQuantity.from = from),
        totalQuantityRangeTo: () => (newFilterState.totalQuantity.to = to),
        remove: () => updateOpenedState(newFilterState, 'totalQuantity', false),
        default: () => updateOpenedState(newFilterState, 'totalQuantity', true),
    };

    const itemsVarietyMappings = {
        itemsVarietyRangeFrom: () => (newFilterState.itemsVariety.from = from),
        itemsVarietyRangeTo: () => (newFilterState.itemsVariety.to = to),
        remove: () => updateOpenedState(newFilterState, 'itemsVariety', false),
        default: () => updateOpenedState(newFilterState, 'itemsVariety', true),
    };

    const actionMappings = {
        sortBy: sortByMappings,
        issuedTime: issuedTimeMappings,
        products: productsMappings,
        customers: customersMappings,
        totalQuantity: totalQuantityMappings,
        itemsVariety: itemsVarietyMappings,
        default: {},
    };

    const typeMappings = actionMappings[type] || actionMappings.default;
    const actionHandler = typeMappings[update] || typeMappings.default;
    actionHandler();

    return newFilterState;
};

const applyFilter = (filterState, setFilterObject, customerId) => {
    const filterObject = {
        sortBy: {
            issuedTime: filterState.issuedTime.isSorted
                ? filterState.issuedTime.order
                : undefined,
            customer: customerId
                ? undefined
                : filterState.customers.isSorted
                ? filterState.customers.order
                : undefined,
            totalQuantity: filterState.totalQuantity.isSorted
                ? filterState.totalQuantity.order
                : undefined,
            itemsVariety: filterState.itemsVariety.isSorted
                ? filterState.itemsVariety.order
                : undefined,
        },
    };

    if (filterState.issuedTime.isOpened && filterState.issuedTime.from) {
        filterObject.issuedTime = {
            from: new Date(filterState.issuedTime.from),
            to: filterState.issuedTime.to
                ? new Date(filterState.issuedTime.to)
                : new Date(),
        };
    }

    if (filterState.products.isOpened && filterState.products.set.size > 0) {
        filterObject.productArray = Array.from(filterState.products.set);
    }

    if (customerId) {
        filterObject.customerId = customerId;
    } else if (
        filterState.customers.isOpened &&
        filterState.customers.set.size > 0
    ) {
        filterObject.customerArray = Array.from(filterState.customers.set);
    }

    if (filterState.totalQuantity.isOpened) {
        filterObject.totalQuantity = {
            from: parseInt(filterState.totalQuantity.from),
            to: parseInt(filterState.totalQuantity.to),
        };
    }

    if (filterState.itemsVariety.isOpened) {
        filterObject.itemsVariety = {
            from: parseInt(filterState.itemsVariety.from),
            to: parseInt(filterState.itemsVariety.to),
        };
    }

    setFilterObject(filterObject);
};

const SortAndFilter = ({ setFilterObject, customerId }) => {
    const [sortAndFilterIsOpened, setSortAndFilterIsOpened] = useState(false);

    const [filterState, dispatchFilter] = useReducer(
        filterReducer,
        initialFilterState
    );

    const onClose = () => {
        setSortAndFilterIsOpened(false);
    };

    const handleSortBy = (method, e) => {
        const methodMappings = {
            issuedTime: { update: 'issuedTime', order: e.target.value },
            issuedTimeState: {
                update: 'issuedTimeState',
                state: e.target.checked,
            },
            customers: { update: 'customers', order: e.target.value },
            customersState: {
                update: 'customersState',
                state: e.target.checked,
            },
            products: { update: 'products', order: e.target.value },
            productsState: { update: 'productsState', state: e.target.checked },
            totalQuantity: { update: 'totalQuantity', order: e.target.value },
            totalQuantityState: {
                update: 'totalQuantityState',
                state: e.target.checked,
            },
            itemsVariety: { update: 'itemsVariety', order: e.target.value },
            itemsVarietyState: {
                update: 'itemsVarietyState',
                state: e.target.checked,
            },
        };

        const action = methodMappings[method];
        if (action) {
            dispatchFilter({
                type: 'sortBy',
                ...action,
            });
        }
    };
    const handleIssuedTime = (method, e) => {
        const methodMappings = {
            issuedTimeFrom: { update: 'issuedTimeFrom', from: e.target.value },
            issuedTimeTo: { update: 'issuedTimeTo', to: e.target.value },
            remove: { update: 'remove' },
            default: { isOpened: true },
        };

        const action = methodMappings[method] || methodMappings.default;

        if (action) {
            dispatchFilter({
                type: 'issuedTime',
                ...action,
            });
        }
    };
    const handleProducts = (method, value) => {
        const methodMappings = {
            products: { update: 'productSet', newProduct: value },
            removeProduct: { update: 'removeProduct', selected: value },
            remove: { update: 'remove' },
            default: { isOpened: true },
        };

        const action = methodMappings[method] || methodMappings.default;
        dispatchFilter({
            type: 'products',
            ...action,
        });
    };

    const handleCustomers = (method, value) => {
        const methodMappings = {
            customers: { update: 'customerSet', newCustomer: value },
            removeCustomer: { update: 'removeCustomer', selected: value },
            remove: { update: 'remove' },
            default: {},
        };

        const action = methodMappings[method] || methodMappings.default;
        dispatchFilter({
            type: 'customers',
            ...action,
        });
    };

    const handleQuantity = (method, e) => {
        const methodMappings = {
            totalQuantityRangeFrom: {
                update: 'totalQuantityRangeFrom',
                from: e.target.value,
            },
            totalQuantityRangeTo: {
                update: 'totalQuantityRangeTo',
                to: e.target.value,
            },
            remove: { update: 'remove' },
            default: {},
        };

        const action = methodMappings[method] || methodMappings.default;
        dispatchFilter({
            type: 'totalQuantity',
            ...action,
        });
    };
    const handleItemsVariety = (method, e) => {
        const methodMappings = {
            itemsVarietyRangeFrom: {
                update: 'itemsVarietyRangeFrom',
                from: e.target.value,
            },
            itemsVarietyRangeTo: {
                update: 'itemsVarietyRangeTo',
                to: e.target.value,
            },
            remove: { update: 'remove' },
            default: {},
        };

        const action = methodMappings[method] || methodMappings.default;
        dispatchFilter({
            type: 'itemsVariety',
            ...action,
        });
    };

    //* UI Rendering
    return sortAndFilterIsOpened ? (
        <Modal isOpen={sortAndFilterIsOpened} onClose={onClose}>
            <div className={styles['sort-and-filter']}>
                <div className={styles['sort-filter-tab']}>
                    {/* //* Sorting */}
                    <div className="wrapper">
                        <p>Sort:</p>

                        <div className={styles.sort}>
                            <SortIssuedTime
                                filterState={filterState}
                                handleSortBy={handleSortBy}
                            />
                            {customerId ? null : (
                                <SortCustomer
                                    filterState={filterState}
                                    handleSortBy={handleSortBy}
                                />
                            )}

                            <SortItemVariety
                                filterState={filterState}
                                handleSortBy={handleSortBy}
                            />
                            {/* Total Quantity  */}
                            <SortTotalQuantity
                                filterState={filterState}
                                handleSortBy={handleSortBy}
                            />
                        </div>
                    </div>
                    {/* //* Filtering */}
                    <div className={styles.filter}>
                        Filters:
                        <ul>
                            {/* Date  */}
                            <li>
                                <button
                                    onClick={handleIssuedTime}
                                    className={styles['filter-btn']}
                                >
                                    Date
                                </button>
                            </li>
                            {/* Products  */}
                            <li>
                                <button
                                    onClick={handleProducts}
                                    className={styles['filter-btn']}
                                >
                                    Products
                                </button>
                            </li>
                            {/* Customers  */}
                            {!customerId && (
                                <li>
                                    <button
                                        onClick={handleCustomers}
                                        className={styles['filter-btn']}
                                    >
                                        Customers
                                    </button>
                                </li>
                            )}
                            <li>
                                <button
                                    onClick={handleQuantity}
                                    className={styles['filter-btn']}
                                >
                                    Quantity
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={handleItemsVariety}
                                    className={styles['filter-btn']}
                                >
                                    Items Variety
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* //* ADDED FILTERS  */}
                <div className={styles['added-filters']}>
                    {filterState.issuedTime.isOpened && (
                        <div className={styles['filter-bar']}>
                            <span>Date:</span>
                            <div className="">
                                <label htmlFor="issuedTimeFrom">From:</label>
                                <input
                                    type="datetime-local"
                                    id="issuedTimeFrom"
                                    value={filterState.issuedTime.from}
                                    onChange={(e) =>
                                        handleIssuedTime('issuedTimeFrom', e)
                                    }
                                />
                            </div>

                            <div className="">
                                <label htmlFor="issuedTimeTo">To:</label>
                                <input
                                    type="datetime-local"
                                    id="issuedTimeTo"
                                    value={filterState.issuedTime.to}
                                    onChange={(e) =>
                                        handleIssuedTime('issuedTimeTo', e)
                                    }
                                />
                            </div>

                            <Button
                                className={'primary01'}
                                onClick={() => handleIssuedTime('remove')}
                            >
                                Remove
                            </Button>
                        </div>
                    )}

                    {filterState.products.isOpened && (
                        <div className={styles['filter-bar']}>
                            <span>Products:</span>

                            <div>
                                {Array.from(filterState.products.set).map(
                                    (product, index) => (
                                        <Tag
                                            // className={'primary01'}
                                            key={index}
                                            onClick={() =>
                                                handleProducts(
                                                    'removeProduct',
                                                    product
                                                )
                                            }
                                        >
                                            {product}
                                        </Tag>
                                    )
                                )}
                            </div>
                            <div className="">
                                <label htmlFor="newProductFilter">
                                    Enter to add product:
                                </label>
                                <input type="text" id="newProductFilter" />
                            </div>
                            <Button
                                className={'primary02'}
                                onClick={() =>
                                    handleProducts(
                                        'products',
                                        // 'burger'
                                        document
                                            .getElementById('newProductFilter')
                                            .value.toLocaleLowerCase()
                                    )
                                }
                            >
                                Add
                            </Button>
                            <Button
                                className={'primary01'}
                                onClick={() => handleProducts('remove')}
                            >
                                Remove
                            </Button>
                        </div>
                    )}

                    {filterState.customers.isOpened && (
                        <div className={styles['filter-bar']}>
                            <span>Customers:</span>
                            <div>
                                {Array.from(filterState.customers.set).map(
                                    (customer, index) => (
                                        <Tag
                                            key={index}
                                            onClick={() =>
                                                handleCustomers(
                                                    'removeCustomer',
                                                    customer
                                                )
                                            }
                                        >
                                            {customer}
                                        </Tag>
                                    )
                                )}
                            </div>
                            <div className="">
                                <label htmlFor="newCustomerFilter">
                                    Enter to add customer:
                                </label>
                                <input type="text" id="newCustomerFilter" />
                            </div>
                            <Button
                                className={'primary02'}
                                onClick={() =>
                                    handleCustomers(
                                        'customers',
                                        document
                                            .getElementById('newCustomerFilter')
                                            .value.toLocaleLowerCase()
                                    )
                                }
                            >
                                Add
                            </Button>
                            <Button
                                className={'primary01'}
                                onClick={() => handleCustomers('remove')}
                            >
                                Remove
                            </Button>
                        </div>
                    )}
                    {filterState.totalQuantity.isOpened && (
                        <div className={styles['filter-bar']}>
                            <span>Quantity:</span>
                            <div className="">
                                <label htmlFor="quantityRangeFrom">From:</label>
                                <input
                                    type="number"
                                    id="quantityRangeFrom"
                                    defaultValue={1}
                                    onChange={(e) =>
                                        handleQuantity(
                                            'totalQuantityRangeFrom',
                                            e
                                        )
                                    }
                                />
                                <label htmlFor="quantityRangeTo">To:</label>
                                <input
                                    type="number"
                                    id="quantityRangeTo"
                                    defaultValue={10}
                                    onChange={(e) =>
                                        handleQuantity(
                                            'totalQuantityRangeTo',
                                            e
                                        )
                                    }
                                />
                            </div>

                            <Button
                                className={'primary01'}
                                onClick={() => handleQuantity('remove')}
                            >
                                Remove
                            </Button>
                        </div>
                    )}
                    {filterState.itemsVariety.isOpened && (
                        <div className={styles['filter-bar']}>
                            <span>Items Variety:</span>
                            <div className="">
                                <label htmlFor="itemsVarietyRangeFrom">
                                    From:
                                </label>
                                <input
                                    type="number"
                                    id="itemsVarietyRangeFrom"
                                    defaultValue={1}
                                    onChange={(e) =>
                                        handleItemsVariety(
                                            'itemsVarietyRangeFrom',
                                            e
                                        )
                                    }
                                />
                                <label htmlFor="itemsVarietyRangeTo">To:</label>
                                <input
                                    type="number"
                                    id="itemsVarietyRangeTo"
                                    defaultValue={10}
                                    onChange={(e) =>
                                        handleItemsVariety(
                                            'itemsVarietyRangeTo',
                                            e
                                        )
                                    }
                                />
                            </div>
                            <Button
                                className={'primary01'}
                                onClick={() => handleItemsVariety('remove')}
                            >
                                Remove
                            </Button>
                        </div>
                    )}
                    <div className={styles['submit-div']}>
                        <Button
                            className={'primary03'}
                            onClick={() =>
                                applyFilter(
                                    filterState,
                                    setFilterObject,
                                    customerId
                                )
                            }
                        >
                            APPLY FILTER
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    ) : (
        <div className={styles['main-button']}>
            <Button
                className="stylish01"
                onClick={() => setSortAndFilterIsOpened((prev) => !prev)}
            >
                Sorts and Filters
            </Button>
        </div>
    );
};

function SortIssuedTime({ filterState, handleSortBy }) {
    return (
        <div className={styles['sort-item']}>
            <input
                type="checkbox"
                checked={filterState.issuedTime.isSorted}
                id="issuedTimeSort"
                onChange={(e) => handleSortBy('issuedTimeState', e)}
            />
            <label
                htmlFor="issuedTimeSort"
                className={
                    filterState.issuedTime.isSorted ? styles['is-sorted'] : ''
                }
            >
                Date
            </label>
            <ul>
                <li>
                    <input
                        type="radio"
                        id="issuedTimeSortAsc"
                        name="issuedTime"
                        value="1"
                        onChange={(e) => handleSortBy('issuedTime', e)}
                    />
                    <label
                        htmlFor="issuedTimeSortAsc"
                        className={
                            filterState.issuedTime.isSorted &&
                            filterState.issuedTime.order == '1'
                                ? styles.selected
                                : ''
                        }
                    >
                        <RiSortDesc />
                    </label>
                </li>
                <li>
                    <input
                        type="radio"
                        id="issuedTimeSortDesc"
                        value="-1"
                        name="issuedTime"
                        onChange={(e) => handleSortBy('issuedTime', e)}
                    />
                    <label
                        htmlFor="issuedTimeSortDesc"
                        className={
                            filterState.issuedTime.isSorted &&
                            filterState.issuedTime.order == '-1'
                                ? styles.selected
                                : ''
                        }
                    >
                        <RiSortAsc />
                    </label>
                </li>
            </ul>
        </div>
    );
}

function SortCustomer({ filterState, handleSortBy }) {
    return (
        <div className={styles['sort-item']}>
            <input
                type="checkbox"
                id="customerSort"
                checked={filterState.customers.isSorted}
                onChange={(e) => handleSortBy('customersState', e)}
            />
            <label
                htmlFor="customerSort"
                className={
                    filterState.customers.isSorted ? styles['is-sorted'] : ''
                }
            >
                Customer
            </label>
            <ul>
                <li>
                    <input
                        type="radio"
                        id="customerSortAsc"
                        name="customers"
                        value={'1'}
                        onChange={(e) => handleSortBy('customers', e)}
                    />
                    <label
                        htmlFor="customerSortAsc"
                        className={
                            filterState.customers.isSorted &&
                            filterState.customers.order == '1'
                                ? styles.selected
                                : ''
                        }
                    >
                        <BsSortAlphaDown />
                    </label>
                </li>
                <li>
                    <input
                        type="radio"
                        id="customerSortDesc"
                        name="customers"
                        value={'-1'}
                        onChange={(e) => handleSortBy('customers', e)}
                    />
                    <label
                        htmlFor="customerSortDesc"
                        className={
                            filterState.customers.isSorted &&
                            filterState.customers.order == '-1'
                                ? styles.selected
                                : ''
                        }
                    >
                        <BsSortAlphaUpAlt />
                    </label>
                </li>
            </ul>
        </div>
    );
}

function SortItemVariety({ filterState, handleSortBy }) {
    return (
        <div className={styles['sort-item']}>
            <input
                type="checkbox"
                id="itemsVarietySort"
                checked={filterState.itemsVariety.isSorted}
                onChange={(e) => handleSortBy('itemsVarietyState', e)}
            />
            <label
                htmlFor="itemsVarietySort"
                className={
                    filterState.itemsVariety.isSorted ? styles['is-sorted'] : ''
                }
            >
                Variety
            </label>
            <ul>
                <li>
                    <input
                        type="radio"
                        id="itemsVarietySortAsc"
                        name="itemsVariety"
                        value={'1'}
                        onChange={(e) => handleSortBy('itemsVariety', e)}
                    />
                    <label
                        htmlFor="itemsVarietySortAsc"
                        className={
                            filterState.itemsVariety.isSorted &&
                            filterState.itemsVariety.order == '1'
                                ? styles.selected
                                : ''
                        }
                    >
                        <BsSortNumericDown />
                    </label>
                </li>
                <li>
                    <input
                        type="radio"
                        id="itemsVarietySortDesc"
                        name="itemsVariety"
                        value={'-1'}
                        onChange={(e) => handleSortBy('itemsVariety', e)}
                    />
                    <label
                        htmlFor="itemsVarietySortDesc"
                        className={
                            filterState.itemsVariety.isSorted &&
                            filterState.itemsVariety.order == '-1'
                                ? styles.selected
                                : ''
                        }
                    >
                        <BsSortNumericUpAlt />
                    </label>
                </li>
            </ul>
        </div>
    );
}

function SortTotalQuantity({ filterState, handleSortBy }) {
    return (
        <div className={styles['sort-item']}>
            <input
                type="checkbox"
                id="totalQuantitySort"
                checked={filterState.totalQuantity.isSorted}
                onChange={(e) => handleSortBy('totalQuantityState', e)}
            />
            <label
                htmlFor="totalQuantitySort"
                className={
                    filterState.totalQuantity.isSorted
                        ? styles['is-sorted']
                        : ''
                }
            >
                Quantity
            </label>
            <ul>
                <li>
                    <input
                        type="radio"
                        id="totalQuantitySortAsc"
                        name="totalQuantity"
                        value={'1'}
                        onChange={(e) => handleSortBy('totalQuantity', e)}
                    />
                    <label
                        htmlFor="totalQuantitySortAsc"
                        className={
                            filterState.totalQuantity.isSorted &&
                            filterState.totalQuantity.order == '1'
                                ? styles.selected
                                : ''
                        }
                    >
                        <BsSortNumericDown />
                    </label>
                </li>
                <li>
                    <input
                        type="radio"
                        id="totalQuantitySortDesc"
                        name="totalQuantity"
                        value={'-1'}
                        onChange={(e) => handleSortBy('totalQuantity', e)}
                    />
                    <label
                        htmlFor="totalQuantitySortDesc"
                        className={
                            filterState.totalQuantity.isSorted &&
                            filterState.totalQuantity.order == '-1'
                                ? styles.selected
                                : ''
                        }
                    >
                        <BsSortNumericUpAlt />
                    </label>
                </li>
            </ul>
        </div>
    );
}



export default SortAndFilter;
