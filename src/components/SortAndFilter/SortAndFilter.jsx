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
    dateRange: { isOpened: false, from: '', to: Date.now() },
    products: { isOpened: false, set: new Set() },
    customers: { isOpened: false, set: new Set() },
    quantity: { isOpened: false, from: 1, to: 10 },
    variety: { isOpened: false, from: 0, to: 10 },
};

const filterReducer = (filterState, action) => {
    const newFilterState = Object.assign({}, filterState);
    if (action.type === 'dateRange') {
        newFilterState.dateRange.isOpened = true;

        if (action.update === 'dateRangeFrom')
            newFilterState.dateRange.from = action.from;

        if (action.update === 'dateRangeTo')
            newFilterState.dateRange.to = action.to;
        if (action.update === 'remove') {
            newFilterState.dateRange.isOpened = false;
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

    const handleDateRange = (method, e) => {
        if (method == 'dateRangeFrom') {
            dispatchFilter({
                type: 'dateRange',
                update: 'dateRangeFrom',
                from: e.target.value,
            });
        } else if (method === 'dateRangeTo') {
            dispatchFilter({
                type: 'dateRange',
                update: 'dateRangeTo',
                to: e.target.value,
            });
        } else if (method === 'remove') {
            console.log('handle remove');
            dispatchFilter({
                type: 'dateRange',
                update: 'remove',
            });
        } else {
            dispatchFilter({
                type: 'dateRange',
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

    //* -------------------------------------------
    return (
        <div className="">
            <div className={styles['sort-filter-tab']}>
                <div className={styles.sort}>
                    Sort by:
                    <ul>
                        <li>Customer</li>
                        <li>Product</li>
                        <li>Date</li>
                    </ul>
                </div>
                <div className={styles.filter}>
                    Filters:
                    <ul>
                        <li>
                            <button onClick={handleDateRange}>Date</button>
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
                {filterState.dateRange.isOpened && (
                    <div className={styles['filter-bar']}>
                        <div className="">
                            <label htmlFor="dateRangeFrom">From</label>
                            <input
                                type="datetime-local"
                                id="dateRangeFrom"
                                value={filterState.dateRange.from}
                                onChange={(e) =>
                                    handleDateRange('dateRangeFrom', e)
                                }
                            />
                        </div>

                        <div className="">
                            <label htmlFor="dateRangeTo">To</label>
                            <input
                                type="datetime-local"
                                id="dateRangeTo"
                                value={filterState.dateRange.to}
                                onChange={(e) =>
                                    handleDateRange('dateRangeTo', e)
                                }
                            />
                        </div>

                        <Button
                            className={'primary01'}
                            onClick={() => handleDateRange('remove')}
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

    if (filterState.dateRange.isOpened && filterState.dateRange.from) {
        filterObject.dateRange = {};
        filterObject.dateRange.from = new Date(filterState.dateRange.from);

        console.log(filterState.dateRange.to);
        filterObject.dateRange.to = new Date(filterState.dateRange.to);

        if (filterObject.dateRange.to == 'Invalid Date') {
            filterObject.dateRange.to = new Date();
        }
        console.log(filterState.dateRange.to);
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
    console.log(filterObject);
    setFilterObject(filterObject);
};
