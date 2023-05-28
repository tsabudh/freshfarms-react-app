import { useReducer } from 'react';

import styles from './SortAndFilter.module.scss';

const initialFilterState = {
    date: { isOpened: false },
    products: { isOpened: false, array: [] },
};
const filterReducer = (filterState, action) => {
    const newFilterState = { ...filterState };
    if (action.type === 'date') {
        newFilterState.date.isOpened = true;
        console.log(newFilterState);
        return newFilterState;
    }
    if (action.type === 'products') {
        newFilterState.products.isOpened = true;
        newFilterState.products.array = [...action.productArray];
        return newFilterState;
    }
};

const SortAndFilter = () => {
    const [filterState, dispatchFilter] = useReducer(
        filterReducer,
        initialFilterState
    );
    const handleDate = () => {
        console.log('handleDate');
        dispatchFilter({
            type: 'date',
        });
    };
    const handleProducts = () => {
        dispatchFilter({
            type: 'products',
            productArray: ['cow milk', 'paneer'],
        });
    };
    const handleCustomers = () => {
        dispatchFilter({
            type: 'date',
        });
    };
    const handleQuantity = () => {
        dispatchFilter({
            type: 'date',
        });
    };
    const handleNumberOfItems = () => {
        dispatchFilter({
            type: 'date',
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
                            <button onClick={handleDate}>Date</button>
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
                            <button onClick={handleNumberOfItems}>
                                Number Of Items
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles['added-filters']}>
                {filterState.date.isOpened && (
                    <div>
                        <label htmlFor="dateRangeFrom">From</label>
                        <input type="datetime-local" id="dateRangeFrom" />

                        <label htmlFor="dateRangeTo">To</label>
                        <input type="datetime-local" id="dateRangeTo" />

                        <button>Update</button>
                        <button>Delete</button>
                    </div>
                )}
                {filterState.products.isOpened && (
                    <div>
                        Products:
                        <div className={styles.inline }>
                            
                            {filterState.products.array.map((product) => (
                                <button>{product}</button>
                            ))}
                            <label htmlFor="newProductFilter">Enter to add product:</label>
                            <input type="text" id="newProductFilter" />
                            <button>Add</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SortAndFilter;
