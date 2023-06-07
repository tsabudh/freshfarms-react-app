import { useState, useEffect, useReducer } from 'react';
import DatePicker from '../UI/DatePicker/DatePicker';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

const StatementPane = () => {
    const [filterObject, setFilterObject] = useState();
    console.log(initialDateState);

    const [dateState, dispatchDateState] = useReducer(
        dateStateReducer,
        initialDateState
    );
    useEffect(() => {
        dispatchDateState({
            type: 'initialize',
        });
    }, []);
    
    useEffect(() => {
        let asyncFunction = async () => {
            try {
                if (true) {
                    let filterObject = {};

                    //* setting current month to filter
                    filterObject.issuedTime = {};
                    filterObject.issuedTime.from = new Date(
                        dateState.year,
                        dateState.month,
                        1
                    );

                    filterObject.issuedTime.to = new Date(
                        dateState.year,
                        dateState.month,
                        dateState.numberOfDays
                    );

                    setFilterObject(filterObject);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        asyncFunction();
    }, [dateState]);

    const navigateMonth = (type, value) => {
        console.log(type);
        console.log(value);
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
                    selected: value.target.value, //* find better name for parameter
                });
                break;
            }
        }
    };
    console.log(dateState);

    return <DatePicker navigateMonth={navigateMonth} dateState={dateState} />;
};

export default StatementPane;
