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
// let dt = new Date(2023, 3, 0);
// let day = dt.getDay();
// let month = dt.getMonth();
// let date = dt.getDate();
// let year = dt.getFullYear();

// let numberOfDays = new Date(year, month + 1, 0).getDate();
// let paddings = new Date(year, month, 1).getDay();

// console.log(day, month, date, numberOfDays, paddings);

let initialDateState = {
    // dateObject: new Date(),
    day:0,
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
// console.log((initialDateState.date = new Date()));
// console.log(typeof initialDateState.date);

const dateStateReducer = (dateState, action) => {
    let newDateState = Object.assign({}, dateState);
    console.log(newDateState.dateObject);

    switch (action.type) {
        case 'initialize': {
            newDateState.dateObject = new Date();
            return newDateState;
            break;
        }
        case 'navigate': {
            if (action.step == -1) {
                console.log(dateState.year, dateState.month);
                newDateState.dateObject = new Date(
                    dateState.year,
                    dateState.month - 1,
                    1
                );
            }
            break;
        }
    }
    return newDateState;
};

const Calender = () => {
    const [dateState, dispatchDateState] = useReducer(
        dateStateReducer,
        initialDateState
    );
    console.log(dateState);

    useEffect(() => {
        dispatchDateState({
            type: 'initialize',
        });
    }, []);

    console.log(dateState.dateObject);
    const navigateMonth = (step) => {
        dispatchDateState({
            type: 'navigate',
            step: step,
        });
        // dateState.numberOfDays = new Date(year, month + 1 + step, 0).getDate();
        // dateState.paddings = new Date(year, month + step, 1).getDay();
    };

    return (
        <div className={styles['calender-container']}>
            <div className={styles.header}>
                <Button onClick={() => navigateMonth(-1)}>Previous</Button>
                Month:{monthNames[dateState.month]}
                Year:{dateState.year}
                <Button onClick={() => navigateMonth(-1)}>Next</Button>
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
