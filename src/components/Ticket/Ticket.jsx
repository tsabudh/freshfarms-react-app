import SalesTable from './SalesTable/SalesTable';

import styles from './Ticket.module.scss';

let x = {
    _id: '646b93c75676bc760790ec66',
    issuedTime: '2023-05-22T16:09:40.143Z',
    items: [
        {
            productName: 'cow milk',
            quantity: 1,
            _id: '646b93c75676bc760790ec67',
            productId: '646a0631cbfb7c60713ecfb1',
            priceThen: 120,
        },
        {
            productId: '646a0805ed93ab01d3e43c28',
            quantity: 1,
            _id: '646b93c75676bc760790ec68',
            productName: 'kurauni',
            priceThen: 111,
        },
    ],
    __v: 0,
};

const Ticket = (props) => {
    let tickets = [];
    let totalCost = 0;
    let productList = [];

    let customer = props.customer[0];
    let transactionTime = new Date(props.timeStamp).toLocaleTimeString();
    let transactionDate = new Date(props.timeStamp).toLocaleDateString(
        undefined,
        {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }
    );

    props.items.map((saleItem, saleItemIndex, items) => {
        productList.push(saleItem.productName);
    });
    return (
        <div>
            <div className={styles.ticket}>
                <div className={styles['date-and-time']}>
                    <div className={styles.time}>{transactionTime}</div>
                    <div className={styles.date}>{transactionDate}</div>
                </div>
                <div className={styles['transaction-details']}>
                    <div className={styles.customer}>{customer.name}</div>
                    {/* <SalesTable items={props.items}/> */}
                </div>
                <div>{props.cost}</div>

                <div className="edit">Edit</div>
            </div>
        </div>
    );

    // return (
    //     <div className={styles.ticket}>
    //         <div className={styles['date-and-time']}>
    //             <div className={styles.time}>9:00</div>
    //             <div className={styles.date}>2023/05/22</div>
    //         </div>
    //         <div className={styles['transaction-details']}>
    //             <div className={styles.customer}>Balaram Subedi</div>
    //             <SalesTable />
    //         </div>

    //         <div className="edit">Edit</div>
    //     </div>
    // );
};

export default Ticket;
