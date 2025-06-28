import React, { useState } from 'react';

import type { FilterObject } from 'types/filter.types';
import styles from './TransactionPanel.module.scss';
import SortAndFilter from '../SortAndFilter/SortAndFilter';
import TransactionTable from '../TransactionTable/TransactionTable';

const TransactionPanel = () => {
    const [transactionFilterObject, setTransactionFilterObject] = useState<FilterObject>({
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
