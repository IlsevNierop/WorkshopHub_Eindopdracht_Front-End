import React from "react";
import styles from "../InputField/InputField.module.css";

function InputField({type, name, label, validation, register, errors, children, value, onChange, placeholder}) {
    return (
            <div className={styles["input-field__column"]}>
                <label className={styles["label__input-field"]} htmlFor={`${name}-field`}>
                    {label}
                    <input className={`${errors[name] ? styles["input-field__error"] : styles["input-field__none"]} ${styles["input-field"]}`}
                           value={value}

                        // className={({errors[name]) => {errors[name]} ? styles['input-field__warning'] : styles['input-field']}
                           type={type}
                           id={`${name}-field`}
                           {...register(name, validation)}
                           onChange={onChange}
                           placeholder={placeholder}

                    />
                    {children}
                </label>
                <div className={styles["error__row"]}>
                {errors[name] && <p style={{ whiteSpace: 'pre-line'}} className={styles["input-field__error-message"]}>{errors[name].message}</p>}
                </div>
            </div>
    )
}

export default InputField;