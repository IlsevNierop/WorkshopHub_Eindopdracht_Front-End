import React from 'react';
import styles from "../Footer/Footer.module.css";

const Button = ({children, type, className, onClick}) => {
    return (
        <div>
            <button
                className={`button ${styles[`${className}`]}`}
                type={type}
                onClick = {onClick}
            >
                { children }
            </button>
        </div>
    );
};

export default Button;