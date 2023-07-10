import React from 'react';
import styles from "../Button/Button.module.css";

const Button = ({children, type, className, onClick, disabled}) => {
    return (
        <>
            <button
                className={`${styles["button"]} ${styles[`${className}`]}`}
                type={type}
                onClick = {onClick}
                disabled={disabled}
            >
                { children }
            </button>
        </>
    );
};

export default Button;