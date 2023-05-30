import { useReducer } from 'react';

import styles from './SortAndFilter.module.scss';
import Button from '../UI/Button';

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
        isSorted: false,
        order: undefined,
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
    quantity: {
        isOpened: false,
        from: 1,
        to: 10,
        isSorted: false,
        order: undefined,
    },
    variety: {
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
        if (action.update === 'issuedTime') {
            newFilterState.issuedTime = action.order;
        }
    }

    if (action.type === 'issuedTime') {
        newFilterState.issuedTime.isOpened = true;

        if (action.update === 'issuedTimeFrom')
            newFilterState.issuedTime.from = action.from;

        if (action.update === 'issuedTimeTo')
            newFilterState.issuedTime.to = action.to;
        if (action.update === 'remove') {
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
        }
        if (action.update === 'remove') {
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
        }
        if (action.update === 'remove') {
            newFilterState.customers.isOpened = false;
        }
        return newFilterState;
    }
    if (action.type === 'quantity') {
        newFilterState.quantity.isOpened = true;

        if (action.update === 'quantityRangeFrom') {
            newFilterState.quantity.from = action.from;
        }
        if (action.update === 'quantityRangeTo') {
            newFilterState.quantity.to = action.to;
        }
        if (action.update === 'remove') {
            newFilterState.quantity.isOpened = false;
        }

        return newFilterState;
    }
    if (action.type === 'variety') {
        newFilterState.variety.isOpened = true;
        console.log(action.to);
        if (action.update === 'varietyRangeFrom') {
            newFilterState.variety.from = action.from;
        }
        if (action.update === 'varietyRangeTo') {
            newFilterState.variety.to = action.to;
        }
        if (action.update === 'remove') {
            newFilterState.variety.isOpened = false;
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

    const handleSortBy = (method, e) => {
        if (method == 'issuedTime') {
            console.log(e.target.value);
            dispatchFilter({
                type: 'sortBy',
                update: 'issuedTime',
                order: e.target.value,
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
            console.log('handle remove');
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

    const handleProducts = (method, newProduct) => {
        if (method == 'products') {
            dispatchFilter({
                type: 'products',
                update: 'productSet',
                newProduct: newProduct,
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
    const handleCustomers = (method, newCustomer) => {
        if (method == 'customers') {
            dispatchFilter({
                type: 'customers',
                update: 'customerSet',
                newCustomer: newCustomer,
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
        if (method == 'quantityRangeFrom') {
            dispatchFilter({
                type: 'quantity',
                update: 'quantityRangeFrom',
                from: e.target.value,
            });
        } else if (method == 'quantityRangeTo') {
            dispatchFilter({
                type: 'quantity',
                update: 'quantityRangeTo',
                to: e.target.value,
            });
        } else if (method === 'remove') {
            dispatchFilter({
                type: 'quantity',
                update: 'remove',
            });
        } else {
            dispatchFilter({
                type: 'quantity',
            });
        }
    };
    const handleVariety = (method, e) => {
        if (method === 'varietyRangeFrom') {
            dispatchFilter({
                type: 'variety',
                update: 'varietyRangeFrom',
                from: e.target.value,
            });
        } else if (method === 'varietyRangeTo') {
            dispatchFilter({
                type: 'variety',
                update: 'varietyRangeTo',
                to: e.target.value,
            });
        } else if (method === 'remove') {
            dispatchFilter({
                type: 'variety',
                update: 'remove',
            });
        } else {
            dispatchFilter({
                type: 'variety',
            });
        }
    };

    //* UI Rendering
    return (
        <div className="">
            <div className={styles['sort-filter-tab']}>
                <div className={styles.sort}>
                    Sort by:
                    <div>
                        <input type="checkbox" id="issuedTimeSort" />
                        <label htmlFor="issuedTimeSort">Date</label>
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
                                <label htmlFor="issuedTimeSortAsc">
                                    Date Asc
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
                                <label htmlFor="issuedTimeSortDesc">
                                    Date Desc
                                </label>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <input type="checkbox" id="customerSort" />
                        <label htmlFor="customerSort">Customer</label>
                        <ul>
                            <li>
                                <input
                                    type="radio"
                                    id="customerSortAsc"
                                    value={'1'}
                                    onChange={(e) =>
                                        handleSortBy('customer', e)
                                    }
                                />
                                <label htmlFor="customerSortAsc">
                                    Customer Asc
                                </label>
                            </li>
                            <li>
                                <input
                                    type="radio"
                                    id="customerSortDesc"
                                    value={'-1'}
                                    onChange={(e) =>
                                        handleSortBy('customer', e)
                                    }
                                />
                                <label htmlFor="customerSortDesc">
                                    Customer Desc
                                </label>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <input type="checkbox" id="itemsVarietySort" />
                        <label htmlFor="itemsVarietySort">Variety</label>
                        <ul>
                            <li>
                                <input
                                    type="radio"
                                    id="itemsVarietySortAsc"
                                    value={'1'}
                                    onChange={(e) =>
                                        handleSortBy('itemsVariety', e)
                                    }
                                />
                                <label htmlFor="itemsVarietySortAsc">
                                    Variety Asc
                                </label>
                            </li>
                            <li>
                                <input
                                    type="radio"
                                    id="itemsVarietySortDesc"
                                    value={'-1'}
                                    onChange={(e) =>
                                        handleSortBy('itemsVariety', e)
                                    }
                                />
                                <label htmlFor="itemsVarietySortDesc">
                                    VarietyDesc{' '}
                                </label>
                            </li>
                        </ul>
                    </div>
                    <div>
                        {' '}
                        <input
                            type="checkbox"
                            id="quantityPerTicketRangeSort"
                        />
                        <label htmlFor="quantityPerTicketRangeSort">
                            Quantity
                        </label>
                        <ul>
                            Quantity
                            <li>
                                <input
                                    type="radio"
                                    id="quantityPerTicketRangeSortAsc"
                                    value={'1'}
                                    onChange={(e) =>
                                        handleSortBy(
                                            'quantityPerTicketRange',
                                            e
                                        )
                                    }
                                />
                                <label htmlFor="quantityPerTicketRangeSortAsc">
                                    Quantity Asc
                                </label>
                            </li>
                            <li>
                                <input
                                    type="radio"
                                    id="quantityPerTicketRangeSortDesc"
                                    value={'-1'}
                                    onChange={(e) =>
                                        handleSortBy(
                                            'quantityPerTicketRange',
                                            e
                                        )
                                    }
                                />
                                <label htmlFor="quantityPerTicketRangeSortDesc">
                                    Quantity Desc
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={styles.filter}>
                    Filters:
                    <ul>
                        <li>
                            <button onClick={handleIssuedTime}>Date</button>
                        </li>
                        <li>
                            <button onClick={handleProducts}>Products</button>
                        </li>
                        <li>
                            <button onClick={handleCustomers}>Customers</button>
                        </li>
                        <li>
                            <button onClick={handleQuantity}>Quantity</button>
                        </li>
                        <li>
                            <button onClick={handleVariety}>Variety</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles['added-filters']}>
                {filterState.issuedTime.isOpened && (
                    <div className={styles['filter-bar']}>
                        <div className="">
                            <label htmlFor="issuedTimeFrom">From</label>
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
                            <label htmlFor="issuedTimeTo">To</label>
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
                        Products:
                        {Array.from(filterState.products.set).map(
                            (product, index) => (
                                <button key={index}>{product}</button>
                            )
                        )}
                        <label htmlFor="newProductFilter">
                            Enter to add product:
                        </label>
                        <input type="text" id="newProductFilter" />
                        <Button
                            className={'primary02'}
                            onClick={() =>
                                handleProducts(
                                    'products',
                                    // 'burger'
                                    document.getElementById('newProductFilter')
                                        .value
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
                        customers:
                        {Array.from(filterState.customers.set).map(
                            (product, index) => (
                                <button key={index}>{product}</button>
                            )
                        )}
                        <label htmlFor="newCustomerFilter">
                            Enter to add customer:
                        </label>
                        <input type="text" id="newCustomerFilter" />
                        <Button
                            className={'primary02'}
                            onClick={() =>
                                handleCustomers(
                                    'customers',
                                    document.getElementById('newCustomerFilter')
                                        .value
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
                {filterState.quantity.isOpened && (
                    <div className={styles['filter-bar']}>
                        Quantity
                        <label htmlFor="quantityRangeFrom">From:</label>
                        <input
                            type="number"
                            id="quantityRangeFrom"
                            defaultValue={1}
                            onChange={(e) =>
                                handleQuantity('quantityRangeFrom', e)
                            }
                        />
                        <label htmlFor="quantityRangeTo">To:</label>
                        <input
                            type="number"
                            id="quantityRangeTo"
                            defaultValue={10}
                            onChange={(e) =>
                                handleQuantity('quantityRangeTo', e)
                            }
                        />
                        <Button
                            className={'primary01'}
                            onClick={() => handleQuantity('remove')}
                        >
                            Remove
                        </Button>
                    </div>
                )}
                {filterState.variety.isOpened && (
                    <div className={styles['filter-bar']}>
                        Variety
                        <label htmlFor="varietyRangeFrom">From</label>
                        <input
                            type="number"
                            id="varietyRangeFrom"
                            defaultValue={1}
                            onChange={(e) =>
                                handleVariety('varietyRangeFrom', e)
                            }
                        />
                        <label htmlFor="varietyRangeTo">To</label>
                        <input
                            type="number"
                            id="varietyRangeTo"
                            defaultValue={10}
                            onChange={(e) => handleVariety('varietyRangeTo', e)}
                        />
                        <Button
                            className={'primary01'}
                            onClick={() => handleVariety('remove')}
                        >
                            Remove
                        </Button>
                    </div>
                )}
                <div>
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
        quantityPerTicketRange: undefined,
    };

    //* FILTERING
    if (filterState.issuedTime.isOpened && filterState.issuedTime.from) {
        filterObject.issuedTime = {};
        filterObject.issuedTime.from = new Date(filterState.issuedTime.from);

        console.log(filterState.issuedTime.to);
        filterObject.issuedTime.to = new Date(filterState.issuedTime.to);

        if (filterObject.issuedTime.to == 'Invalid Date') {
            filterObject.issuedTime.to = new Date();
        }
        console.log(filterState.issuedTime.to);
    }

    if (filterState.products.isOpened && filterState.products.set.size != 0) {
        filterObject.productArray = Array.from(filterState.products.set);
    }

    if (filterState.customers.isOpened && filterState.customers.set.size != 0) {
        filterObject.customerArray = Array.from(filterState.customers.set);
    }

    if (filterState.quantity.isOpened) {
        filterObject.quantityPerTicketRange = {
            from: parseInt(filterState.quantity.from),
            to: parseInt(filterState.quantity.to),
        };
    }
    if (filterState.variety.isOpened) {
        console.log(filterState.variety.to);
        filterObject.itemsVariety = {
            from: parseInt(filterState.variety.from),
            to: parseInt(filterState.variety.to),
        };
    }

    //* SORTING

    //* setting filterObject for fetch trigger
    setFilterObject(filterObject);
};
