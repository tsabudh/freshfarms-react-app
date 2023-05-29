import { useReducer } from 'react';

import styles from './SortAndFilter.module.scss';

//* referencing function with parameters
function partial(func /*, 0..n args */) {
    var args = Array.prototype.slice.call(arguments).splice(1);
    return function () {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
    };
}

const initialFilterState = {
    dateRange: { isOpened: false, from: '', to: '' },
    products: { isOpened: false, set: new Set() },
    customers: { isOpened: false, set: new Set() },
    quantity: { isOpened: false, from: 0, to: 10 },
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

        console.log(newFilterState);
        return newFilterState;
    }
    if (action.type === 'products') {
        newFilterState.products.isOpened = true;

        if (action.update === 'productSet') {
            newFilterState.products.set.add(action.newProduct);
            console.log('newFilterState');
        }

        return newFilterState;
    }
    if (action.type === 'customers') {
        newFilterState.customers.isOpened = true;

        if (action.update == 'customerSet') {
            newFilterState.customers.set.add(action.newCustomer);
        }
        return newFilterState;
    }
    if (action.type === 'quantity') {
        newFilterState.quantity.isOpened = true;
        newFilterState.quantity.from = 0;
        newFilterState.quantity.to = 10;
        return newFilterState;
    }
    if (action.type === 'variety') {
        newFilterState.variety.isOpened = true;
        newFilterState.variety.from = 0;
        newFilterState.variety.to = 10;
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
        } else if (method == 'dateRangeTo') {
            dispatchFilter({
                type: 'dateRange',
                update: 'dateRangeTo',
                to: e.target.value,
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
        }
        dispatchFilter({
            type: 'customers',
            customerArray: ['sabudh', 'Abhishek'],
        });
    };
    const handleQuantity = () => {
        dispatchFilter({
            type: 'quantity',
            from: 0,
            to: 5,
        });
    };
    const handleVariety = () => {
        dispatchFilter({
            type: 'variety',
            from: 0,
            to: 4,
        });
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
                    <div>
                        <label htmlFor="dateRangeFrom">From</label>
                        <input
                            type="datetime-local"
                            id="dateRangeFrom"
                            value={filterState.dateRange.from}
                            onChange={(e) =>
                                handleDateRange('dateRangeFrom', e)
                            }
                        />

                        <label htmlFor="dateRangeTo">To</label>
                        <input
                            type="datetime-local"
                            id="dateRangeTo"
                            value={filterState.dateRange.to}
                            onChange={(e) => handleDateRange('dateRangeTo', e)}
                        />

                        <button
                            onClick={() => {
                                handleDateRange('update');
                            }}
                        >
                            Update
                        </button>
                        <button>Delete</button>
                    </div>
                )}

                {filterState.products.isOpened && (
                    <div className={styles.inline}>
                        products:
                        {Array.from(filterState.products.set).map(
                            (product, index) => (
                                <button key={index}>{product}</button>
                            )
                        )}
                        <label htmlFor="newProductFilter">
                            Enter to add product:
                        </label>
                        <input type="text" id="newProductFilter" />
                        <button
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
                        </button>
                    </div>
                )}

                {filterState.customers.isOpened && (
                    <div className={styles.inline}>
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
                        <button
                            onClick={() =>
                                handleCustomers(
                                    'customers',
                                    document.getElementById('newCustomerFilter')
                                        .value
                                )
                            }
                        >
                            Add
                        </button>
                    </div>
                )}
                {filterState.quantity.isOpened && (
                    <div className={styles['filter-configuration']}>
                        <label htmlFor="quantityRangeFrom">From</label>
                        <input type="number" id="quantityRangeFrom" />

                        <label htmlFor="quantityRangeTo">To</label>
                        <input type="number" id="quantityRangeTo" />

                        <button>Update</button>
                        <button>Delete</button>
                    </div>
                )}
                {filterState.variety.isOpened && (
                    <div>
                        <label htmlFor="varietyRangeFrom">From</label>
                        <input type="number" id="varietyRangeFrom" />

                        <label htmlFor="varietyRangeTo">To</label>
                        <input type="number" id="varietyRangeTo" />

                        <button>Update</button>
                        <button>Delete</button>
                    </div>
                )}
                <div>
                    <button
                        onClick={() =>
                            applyFilter(filterState, setFilterObject)
                        }
                    >
                        APPLY FILTER
                    </button>
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
        console.log('heheheh');
        console.log(filterState.dateRange.to);
        filterObject.dateRange.to = new Date(filterState.dateRange.to);
        if(!filterObject.dateRange.to)filterObject.dateRange.to = new Date();
        console.log(filterState.dateRange.to);
    }

    if (filterState.products.isOpened && filterState.products.set.size != 0) {
        filterObject.productArray = Array.from(filterState.products.set);
    }

    if (filterState.customers.isOpened && filterState.customers.set.size != 0) {
        filterObject.customerArray = Array.from(filterState.customers.set);
    }
    console.log(filterObject);
    setFilterObject(filterObject);
};
