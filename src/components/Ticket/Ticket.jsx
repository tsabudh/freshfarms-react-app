import { useState } from 'react';

import SalesTable from './SalesTable/SalesTable';

import styles from './Ticket.module.scss';

const Ticket = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    let tickets = [];

    const ticketClickHandler = () => {
        setIsExpanded(!isExpanded);
    };
    let customer = props.customer[0];
    let transactionTime = new Date(props.timeStamp).toLocaleTimeString(
        undefined,
        {
            hour: 'numeric',
            minute: 'numeric',
        }
    );
    let transactionDate = new Date(props.timeStamp).toLocaleDateString(
        undefined,
        {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }
    );

    return (
        <div className={styles.ticket} onClick={ticketClickHandler}>
            <div className={styles['date-and-time']}>
                <div className={styles.time}>
                    {transactionTime.split(' ')[0]}{' '}
                    <span className={styles.period}>
                        {transactionTime.slice(-2)}
                    </span>
                </div>

                <div className={styles.date}>{transactionDate}</div>
            </div>
            <div className={styles['transaction-details']}>
                <div className={styles.customer}>{customer.name}</div>
                <SalesTable
                    items={props.items}
                    isExpanded={isExpanded}
                    cost={props.totalCost}
                />
            </div>
            {isExpanded ? null : (
                <div className={styles.cost}>Rs. {props.totalCost}</div>
            )}

            {/* <div className="edit">Edit</div> */}
        </div>
    );
};

export default Ticket;
