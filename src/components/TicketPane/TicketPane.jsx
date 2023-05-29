import { useState, useEffect } from 'react';

import TicketTable from '../TicketTable/TicketTable';
import SortAndFilter from '../SortAndFilter/SortAndFilter';

const TicketPane = () => {
    const [filterObject, setFilterObject] = useState({});
    return (
        <div className="">
            <SortAndFilter setFilterObject={setFilterObject} />
            <TicketTable filterObject={filterObject} />
        </div>
    );
};

export default TicketPane;
