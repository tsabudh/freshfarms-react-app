import styles from './Button.module.scss';

const Button = (props) => {
    console.log(props.className);
    return (
        <button
            className={`${styles[`${props.className}`]}`}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
};

export default Button;
