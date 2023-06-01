import { useReducer, useEffect } from 'react';
import styles from './Calender.module.scss';

import Button from '../UI/Button/Button';
import { useTheme } from 'styled-components';
const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];
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

let initialDateState = {
    set dateObject(assignedValue) {
        this.dateX = new Date(assignedValue);

        this.date = this.dateX.getDate();
        this.month = this.dateX.getMonth();
        this.day = this.dateX.getDay();
        this.year = this.dateX.getFullYear();
        this.numberOfDays = new Date(this.year, this.month + 1, 0).getDate();
        this.paddings = new Date(this.year, this.month, 1).getDay();
    },
    get dateObject() {
        return this.dateX;
    },
    get weekday() {
        return weekdays[this.day];
    },
    get fullMonth() {
        return monthNames[this.month];
    },
};

const dateStateReducer = (dateState, action) => {
    let newDateState = Object.create(
        dateState,
        Object.getOwnPropertyDescriptors(dateState)
    );

    switch (action.type) {
        case 'initialize': {
            newDateState.dateObject = new Date();

            break;
        }
        case 'navigate': {
            if (action.step == -1) {
                newDateState.dateObject = new Date(
                    dateState.year,
                    dateState.month - 1,
                    1
                );
            } else if (action.step == 1) {
                newDateState.dateObject = new Date(
                    dateState.year,
                    dateState.month + 1,
                    1
                );
            }
            break;
        }
        case 'selectMonth': {
            newDateState.dateObject = new Date(
                dateState.year,
                action.selected,
                1
            );
        }
    }
    return newDateState;
};

const Calender = (props) => {
    const [dateState, dispatchDateState] = useReducer(
        dateStateReducer,
        initialDateState
    );

    const { currentCustomer } = props;
    console.log(currentCustomer);
    useEffect(() => {
        dispatchDateState({
            type: 'initialize',
        });
    }, []);

    const navigateMonth = (type, value) => {
        switch (type) {
            case 'navigate': {
                dispatchDateState({
                    type: 'navigate',
                    step: value,
                });
                break;
            }
            case 'selectMonth': {
                dispatchDateState({
                    type: 'selectMonth',
                    selected: value.target.value,
                });
                break;
            }
        }
    };

    return (
        <div className={styles['calender-container']}>
            <div className={styles.header}>
                <Button onClick={() => navigateMonth('navigate', -1)}>
                    Previous
                </Button>
                Month:{monthNames[dateState.month]}
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
                            select={
                                dateState.month === index ? 'true' : 'false'
                            }
                        >
                            {month}
                        </option>
                    ))}
                </select>
                Year:{dateState.year}
                <Button onClick={() => navigateMonth('navigate', 1)}>
                    Next
                </Button>
            </div>

            {/* weekdays header  */}
            <div className={styles.calender}>
                {weekdays.map((weekday) => {
                    return (
                        <div key={weekday} className={styles.weekdays}>
                            {weekday}
                        </div>
                    );
                })}
                {/* Paddings  */}
                {Array.from(Array(dateState.paddings)).map((day) => {
                    return (
                        <div key={day} className={styles.day}>
                            {day}
                        </div>
                    );
                })}
                {/* Days */}
                {Array.from(Array(dateState.numberOfDays)).map((item, date) => {
                    return (
                        <div key={date} className={styles.day}>
                            {date + 1}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calender;
