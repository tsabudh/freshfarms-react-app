import React, { useState, useEffect } from 'react';

import TransactionTable from '../TransactionTable/TransactionTable';
import SortAndFilter from '../SortAndFilter/SortAndFilter';
import styles from './TransactionPanel.module.scss';

const TransactionPanel = () => {
    const [transactionFilterObject, setTransactionFilterObject] = useState({
        sortBy: {
            issuedTime: -1,
        },
    });

    return (
        <div className={styles.container}>
            <SortAndFilter
                setTransactionFilterObject={setTransactionFilterObject}
            />
            <TransactionTable
                transactionFilterObject={transactionFilterObject}
            />
        </div>
    );
};

export default TransactionPanel;
