import { useState, useEffect } from 'react';

import TicketTable from '../TicketTable/TicketTable';
import SortAndFilter from '../SortAndFilter/SortAndFilter';

const TicketPane = () => {
    return (
        <div className="">
            <SortAndFilter />
            <TicketTable />
        </div>
    );
};

export default TicketPane;
