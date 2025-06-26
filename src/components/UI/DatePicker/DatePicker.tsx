import React, { useReducer, useEffect, useState } from 'react';
import Button from '../Button/Button';

import styles from "./DatePicker.module.scss";

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

type DatePickerProps = {
    navigateMonth: (action: string, value: any) => void;
    dateState: {
        month: number;
        year: number;
    };
} & React.HTMLAttributes<HTMLDivElement>;

const DatePicker = (props: DatePickerProps) => {
    let { navigateMonth, dateState } = props;
   

    return (
        <div className={styles["picker-container"]}>
            <Button onClick={() => navigateMonth('navigate', -1) } className='primary01'>
                Previous
            </Button>
          
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
                        // select={dateState.month === index ? 'true' : 'false'}
                    >
                        {month}
                    </option>
                ))}
            </select>
            {dateState.year}
            <Button onClick={() => navigateMonth('navigate', 1)} className='primary01'>Next</Button>
        </div>
    );
};

export default DatePicker;
