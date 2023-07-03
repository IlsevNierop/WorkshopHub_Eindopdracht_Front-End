import React from 'react';
import styles from "../Button/Button.module.css";

const Button = ({children, type, className, onClick}) => {
    return (
        <>
            <button
                className={`${styles["button"]} ${styles[`${className}`]}`}
                type={type}
                onClick = {onClick}
            >
                { children }
            </button>
        </>
    );
};

export default Button;