import React, { useState, useEffect } from 'react';

import TransactionTable from '../TransactionTable/TransactionTable';
import SortAndFilter from '../SortAndFilter/SortAndFilter';
import styles from './TransactionPanel.module.scss';

const TransactionPanel = () => {
    const [filterObject, setFilterObject] = useState({
        sortBy: {
            issuedTime: -1,
        },
    });

    return (
        <div className={styles.container}>
            <SortAndFilter setFilterObject={setFilterObject} />
            <TransactionTable filterObject={filterObject} />
        </div>
    );
};

export default TransactionPanel;
