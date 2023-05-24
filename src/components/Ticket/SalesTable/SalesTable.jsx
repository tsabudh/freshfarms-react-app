import styles from '../Ticket.module.scss';

const SalesRow = (props) => {
    return (
        <tr>
            <td>{props.serialNumber}</td>
            <td>{props.product}</td>
            <td>{props.price}</td>
            <td>{props.quantity}</td>
            <td>{props.cost}</td>
        </tr>
    );
};

const SalesTable = () => {
    return (
        <table className={styles['sales-table']}>
            <thead>
                <tr>
                    <th>S.N</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Cost</th>
                </tr>
            </thead>
            <tbody>
                {x.items.map((item, index) => {
                    return (
                        <SalesRow
                            key={item._id}
                            serialNumber={index + 1}
                            product={item.productName}
                            price={item.price}
                            quantity={item.quantity}
                            cost={item.priceThen}
                        />
                    );
                })}

                <tr>
                    <td></td>
                    <td></td>
                    <td>Total</td>
                    <td>4</td>
                    <td>Rs 440</td>
                </tr>
            </tbody>
        </table>
    );
};

export default SalesTable;
