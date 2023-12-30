import React, { useEffect, useReducer } from 'react';


import {
    BsSortAlphaDown,
    BsSortAlphaDownAlt,
    BsSortAlphaUpAlt,
    BsSortNumericDown,
    BsSortNumericDownAlt,
    BsSortNumericUpAlt,
} from 'react-icons/bs';

import { RiSortAsc, RiSortDesc } from 'react-icons/ri';

import styles from './SortAndFilter.module.scss';
import Button from '../UI/Button/Button';
import Tag from '../UI/Tag/Tag';

//* referencing function with parameters
function partial(func /*, 0..n args */) {
    var args = Array.prototype.slice.call(arguments).splice(1);
    return function () {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
    };
}

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

const filterReducer = (filterState, action) => {
    const newFilterState = Object.assign({}, filterState);

    if (action.type === 'sortBy') {
        if (action.update === 'issuedTimeState') {
            newFilterState.issuedTime.isSorted = action.state;
        } else if (action.update === 'issuedTime') {
            newFilterState.issuedTime.isSorted = true;
            newFilterState.issuedTime.order = parseInt(action.order);
        } else if (action.update === 'customersState') {
            newFilterState.customers.isSorted = action.state;
        } else if (action.update === 'customers') {
            newFilterState.customers.isSorted = true;
            newFilterState.customers.order = parseInt(action.order);
        } else if (action.update === 'productsState') {
            newFilterState.products.isSorted = action.state;
        } else if (action.update === 'products') {
            newFilterState.products.isSorted = true;
            newFilterState.products.order = parseInt(action.order);
        } else if (action.update === 'totalQuantityState') {
            newFilterState.totalQuantity.isSorted = action.state;
        } else if (action.update === 'totalQuantity') {
            newFilterState.totalQuantity.isSorted = true;
            newFilterState.totalQuantity.order = parseInt(action.order);
        } else if (action.update === 'itemsVarietyState') {
            newFilterState.itemsVariety.isSorted = action.state;
        } else if (action.update === 'itemsVariety') {
            newFilterState.itemsVariety.isSorted = true;
            newFilterState.itemsVariety.order = parseInt(action.order);
        }

        return newFilterState;
    }

    if (action.type === 'issuedTime') {
        newFilterState.issuedTime.isOpened = true;

        if (action.update === 'issuedTimeFrom')
            newFilterState.issuedTime.from = action.from;
        else if (action.update === 'issuedTimeTo')
            newFilterState.issuedTime.to = action.to;
        else if (action.update === 'remove') {
            newFilterState.issuedTime.isOpened = false;
        }

        return newFilterState;
    }
    if (action.type === 'products') {
        newFilterState.products.isOpened = true;

        if (action.update === 'productSet') {
            if (action.newProduct) {
                newFilterState.products.set.add(action.newProduct);
            }
        } else if (action.update === 'removeProduct') {
            newFilterState.products.set.delete(action.selected);
        } else if (action.update === 'remove') {
            newFilterState.products.isOpened = false;
        }
        return newFilterState;
    }
    if (action.type === 'customers') {
        newFilterState.customers.isOpened = true;

        if (action.update == 'customerSet') {
            if (action.newCustomer) {
                newFilterState.customers.set.add(action.newCustomer);
            }
        } else if (action.update === 'removeCustomer') {
            if (action.selected) {
                newFilterState.customers.set.delete(action.selected);
            }
        } else if (action.update === 'remove') {
            newFilterState.customers.isOpened = false;
        }
        return newFilterState;
    }
    if (action.type === 'totalQuantity') {
        newFilterState.totalQuantity.isOpened = true;

        if (action.update === 'totalQuantityRangeFrom') {
            newFilterState.totalQuantity.from = action.from;
        }
        if (action.update === 'totalQuantityRangeTo') {
            newFilterState.totalQuantity.to = action.to;
        }
        if (action.update === 'remove') {
            newFilterState.totalQuantity.isOpened = false;
        }

        return newFilterState;
    }
    if (action.type === 'itemsVariety') {
        newFilterState.itemsVariety.isOpened = true;
        if (action.update === 'itemsVarietyRangeFrom') {
            newFilterState.itemsVariety.from = action.from;
        }
        if (action.update === 'itemsVarietyRangeTo') {
            newFilterState.itemsVariety.to = action.to;
        }
        if (action.update === 'remove') {
            newFilterState.itemsVariety.isOpened = false;
        }
        return newFilterState;
    }
};

const SortAndFilter = (props) => {
    const { setFilterObject } = props;

    const [filterState, dispatchFilter] = useReducer(
        filterReducer,
        initialFilterState
    );

    // useEffect(() => {
    //     applyFilter(filterState, setFilterObject);
    // }, []);
    const handleSortBy = (method, e) => {
        if (method == 'issuedTime') {
            dispatchFilter({
                type: 'sortBy',
                update: 'issuedTime',
                order: e.target.value,
            });
        } else if (method === 'issuedTimeState') {
            dispatchFilter({
                type: 'sortBy',
                update: 'issuedTimeState',
                state: e.target.checked,
            });
        } else if (method == 'customers') {
            dispatchFilter({
                type: 'sortBy',
                update: 'customers',
                order: e.target.value,
            });
        } else if (method === 'customersState') {
            dispatchFilter({
                type: 'sortBy',
                update: 'customersState',
                state: e.target.checked,
            });
        } else if (method == 'products') {
            dispatchFilter({
                type: 'sortBy',
                update: 'products',
                order: e.target.value,
            });
        } else if (method === 'productsState') {
            dispatchFilter({
                type: 'sortBy',
                update: 'productsState',
                state: e.target.checked,
            });
        } else if (method == 'totalQuantity') {
            dispatchFilter({
                type: 'sortBy',
                update: 'totalQuantity',
                order: e.target.value,
            });
        } else if (method === 'totalQuantityState') {
            dispatchFilter({
                type: 'sortBy',
                update: 'totalQuantityState',
                state: e.target.checked,
            });
        } else if (method == 'itemsVariety') {
            dispatchFilter({
                type: 'sortBy',
                update: 'itemsVariety',
                order: e.target.value,
            });
        } else if (method === 'itemsVarietyState') {
            dispatchFilter({
                type: 'sortBy',
                update: 'itemsVarietyState',
                state: e.target.checked,
            });
        }
    };

    const handleIssuedTime = (method, e) => {
        if (method == 'issuedTimeFrom') {
            dispatchFilter({
                type: 'issuedTime',
                update: 'issuedTimeFrom',
                from: e.target.value,
            });
        } else if (method === 'issuedTimeTo') {
            dispatchFilter({
                type: 'issuedTime',
                update: 'issuedTimeTo',
                to: e.target.value,
            });
        } else if (method === 'remove') {
            dispatchFilter({
                type: 'issuedTime',
                update: 'remove',
            });
        } else {
            dispatchFilter({
                type: 'issuedTime',
                isOpened: true,
            });
        }
    };

    const handleProducts = (method, value) => {
        if (method == 'products') {
            dispatchFilter({
                type: 'products',
                update: 'productSet',
                newProduct: value,
            });
        } else if (method === 'removeProduct') {
            dispatchFilter({
                type: 'products',
                update: 'removeProduct',
                selected: value,
            });
        } else if (method === 'remove') {
            dispatchFilter({
                type: 'products',
                update: 'remove',
            });
        } else {
            dispatchFilter({
                type: 'products',
                isOpened: true,
            });
        }
    };
    const handleCustomers = (method, value) => {
        if (method == 'customers') {
            dispatchFilter({
                type: 'customers',
                update: 'customerSet',
                newCustomer: value,
            });
        } else if (method === 'removeCustomer') {
            dispatchFilter({
                type: 'customers',
                update: 'removeCustomer',
                selected: value,
            });
        } else if (method === 'remove') {
            dispatchFilter({
                type: 'customers',
                update: 'remove',
            });
        } else {
            dispatchFilter({
                type: 'customers',
            });
        }
    };
    const handleQuantity = (method, e) => {
        if (method == 'totalQuantityRangeFrom') {
            dispatchFilter({
                type: 'totalQuantity',
                update: 'totalQuantityRangeFrom',
                from: e.target.value,
            });
        } else if (method == 'totalQuantityRangeTo') {
            dispatchFilter({
                type: 'totalQuantity',
                update: 'totalQuantityRangeTo',
                to: e.target.value,
            });
        } else if (method === 'remove') {
            dispatchFilter({
                type: 'totalQuantity',
                update: 'remove',
            });
        } else {
            dispatchFilter({
                type: 'totalQuantity',
            });
        }
    };
    const handleItemsVariety = (method, e) => {
        if (method === 'itemsVarietyRangeFrom') {
            dispatchFilter({
                type: 'itemsVariety',
                update: 'itemsVarietyRangeFrom',
                from: e.target.value,
            });
        } else if (method === 'itemsVarietyRangeTo') {
            dispatchFilter({
                type: 'itemsVariety',
                update: 'itemsVarietyRangeTo',
                to: e.target.value,
            });
        } else if (method === 'remove') {
            dispatchFilter({
                type: 'itemsVariety',
                update: 'remove',
            });
        } else {
            dispatchFilter({
                type: 'itemsVariety',
            });
        }
    };

    //* UI Rendering
    return (
        <div className={styles['sort-and-filter']}>
            <div className={styles['sort-filter-tab']}>
                {/* //* Sorting */}
                <div className="wrapper">
                    <p>Sort:</p>

                    <div className={styles.sort}>
                        {/* Issued Time */}
                        <div className={styles['sort-item']}>
                            <input
                                type="checkbox"
                                checked={filterState.issuedTime.isSorted}
                                id="issuedTimeSort"
                                onChange={(e) =>
                                    handleSortBy('issuedTimeState', e)
                                }
                            />
                            <label
                                htmlFor="issuedTimeSort"
                                className={
                                    filterState.issuedTime.isSorted
                                        ? styles['is-sorted']
                                        : ''
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
                                        onChange={(e) =>
                                            handleSortBy('issuedTime', e)
                                        }
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
                                        onChange={(e) =>
                                            handleSortBy('issuedTime', e)
                                        }
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

                        {/* Customers  */}
                        <div className={styles['sort-item']}>
                            <input
                                type="checkbox"
                                id="customerSort"
                                checked={filterState.customers.isSorted}
                                onChange={(e) =>
                                    handleSortBy('customersState', e)
                                }
                            />
                            <label
                                htmlFor="customerSort"
                                className={
                                    filterState.customers.isSorted
                                        ? styles['is-sorted']
                                        : ''
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
                                        onChange={(e) =>
                                            handleSortBy('customers', e)
                                        }
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
                                        onChange={(e) =>
                                            handleSortBy('customers', e)
                                        }
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
                        {/* Items Variety  */}
                        <div className={styles['sort-item']}>
                            <input
                                type="checkbox"
                                id="itemsVarietySort"
                                checked={filterState.itemsVariety.isSorted}
                                onChange={(e) =>
                                    handleSortBy('itemsVarietyState', e)
                                }
                            />
                            <label
                                htmlFor="itemsVarietySort"
                                className={
                                    filterState.itemsVariety.isSorted
                                        ? styles['is-sorted']
                                        : ''
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
                                        onChange={(e) =>
                                            handleSortBy('itemsVariety', e)
                                        }
                                    />
                                    <label
                                        htmlFor="itemsVarietySortAsc"
                                        className={
                                            filterState.itemsVariety.isSorted &&
                                            filterState.itemsVariety.order ==
                                                '1'
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
                                        onChange={(e) =>
                                            handleSortBy('itemsVariety', e)
                                        }
                                    />
                                    <label
                                        htmlFor="itemsVarietySortDesc"
                                        className={
                                            filterState.itemsVariety.isSorted &&
                                            filterState.itemsVariety.order ==
                                                '-1'
                                                ? styles.selected
                                                : ''
                                        }
                                    >
                                        <BsSortNumericUpAlt />
                                    </label>
                                </li>
                            </ul>
                        </div>
                        {/* Total Quantity  */}
                        <div className={styles['sort-item']}>
                            <input
                                type="checkbox"
                                id="totalQuantitySort"
                                checked={filterState.totalQuantity.isSorted}
                                onChange={(e) =>
                                    handleSortBy('totalQuantityState', e)
                                }
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
                                        onChange={(e) =>
                                            handleSortBy('totalQuantity', e)
                                        }
                                    />
                                    <label
                                        htmlFor="totalQuantitySortAsc"
                                        className={
                                            filterState.totalQuantity
                                                .isSorted &&
                                            filterState.totalQuantity.order ==
                                                '1'
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
                                        onChange={(e) =>
                                            handleSortBy('totalQuantity', e)
                                        }
                                    />
                                    <label
                                        htmlFor="totalQuantitySortDesc"
                                        className={
                                            filterState.totalQuantity
                                                .isSorted &&
                                            filterState.totalQuantity.order ==
                                                '-1'
                                                ? styles.selected
                                                : ''
                                        }
                                    >
                                        <BsSortNumericUpAlt />
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* //* Filtering */}
                <div className={styles.filter}>
                    Filters:
                    <ul>
                        <li>
                            <button
                                onClick={handleIssuedTime}
                                className={styles['filter-btn']}
                            >
                                Date
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleProducts}
                                className={styles['filter-btn']}
                            >
                                Products
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleCustomers}
                                className={styles['filter-btn']}
                            >
                                Customers
                            </button>
                        </li>
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
                                    handleQuantity('totalQuantityRangeFrom', e)
                                }
                            />
                            <label htmlFor="quantityRangeTo">To:</label>
                            <input
                                type="number"
                                id="quantityRangeTo"
                                defaultValue={10}
                                onChange={(e) =>
                                    handleQuantity('totalQuantityRangeTo', e)
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
                            <label htmlFor="itemsVarietyRangeFrom">From:</label>
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
                                    handleItemsVariety('itemsVarietyRangeTo', e)
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
                            applyFilter(filterState, setFilterObject)
                        }
                    >
                        APPLY FILTER
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SortAndFilter;

const applyFilter = (filterState, setFilterObject) => {
    let filterObject = {};
    filterObject.sortBy = {
        issuedTime: undefined,
        customer: undefined,
        itemsVariety: undefined,
        totalQuantity: undefined,
    };

    //* FILTERING
    if (filterState.issuedTime.isOpened && filterState.issuedTime.from) {
        filterObject.issuedTime = {};
        filterObject.issuedTime.from = new Date(filterState.issuedTime.from);

        filterObject.issuedTime.to = new Date(filterState.issuedTime.to);

        if (filterObject.issuedTime.to == 'Invalid Date') {
            filterObject.issuedTime.to = new Date();
        }
    }

    if (filterState.products.isOpened && filterState.products.set.size != 0) {
        filterObject.productArray = Array.from(filterState.products.set);
    }

    if (filterState.customers.isOpened && filterState.customers.set.size != 0) {
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

    //* SORTING
    if (filterState.issuedTime.isSorted) {
        filterObject.sortBy.issuedTime = filterState.issuedTime.order;
    }
    if (filterState.customers.isSorted) {
        filterObject.sortBy.customer = filterState.customers.order;
    }
    if (filterState.totalQuantity.isSorted) {
        filterObject.sortBy.totalQuantity = filterState.totalQuantity.order;
    }
    if (filterState.itemsVariety.isSorted) {
        filterObject.sortBy.itemsVariety = filterState.itemsVariety.order;
    }

    //* setting filterObject for fetch trigger
    setFilterObject(filterObject);
};
