import React, { useState, useEffect } from 'react';

import TransactionTable from '../TransactionTable/TransactionTable';
import SortAndFilter from '../SortAndFilter/SortAndFilter';
import Button from '../UI/Button/Button';
import Modal from '../UI/Modal/Modal';

const TransactionPanel = () => {
    const [filterObject, setFilterObject] = useState({
        sortBy: {
            issuedTime: -1,
        },
    });

    return (
        <div className="">
            <SortAndFilter setFilterObject={setFilterObject} />

            <TransactionTable filterObject={filterObject} />
        </div>
    );
};

export default TransactionPanel;
