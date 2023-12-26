import React, { useReducer, useEffect, useState } from 'react';
import Button from '../Button/Button';

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const DatePicker = (props) => {
    let { navigateMonth, dateState } = props;
   

    return (
        <div className="">
            <Button onClick={() => navigateMonth('navigate', -1)}>
                Previous
            </Button>
            {monthNames[dateState.month]}
            <select
                className="form-select"
                id="month"
                name="month"
                onChange={(e) => navigateMonth('selectMonth', e)}
                value={dateState.month}
            >
                {monthNames.map((month, index) => (
                    <option
                        key={index}
                        value={index}
                        name="calenderMonth"
                        // select={dateState.month === index ? 'true' : 'false'}
                    >
                        {month}
                    </option>
                ))}
            </select>
            {dateState.year}
            <Button onClick={() => navigateMonth('navigate', 1)}>Next</Button>
        </div>
    );
};

export default DatePicker;
