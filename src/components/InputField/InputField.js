import React from "react";
import styles from "../InputField/InputField.module.css";

function InputField({type, name, label, validation, register, errors, children, value, onChange, placeholder}) {
    return (

        <label className={styles["label__input-field"]} htmlFor={`${name}-field`}>
            {label}
            <input className={styles["input-field"]}
                   value={value}

                // className={({errors[name]) => {errors[name]} ? styles['input-field__warning'] : styles['input-field']}
                   type={type}
                   id={`${name}-field`}
                   {...register(name, validation)}
                   onChange={onChange}
                   placeholder={placeholder}

            />
            {children}
            {errors[name] && <p>{errors[name].message}</p>}
        </label>
    )
}

export default InputField;