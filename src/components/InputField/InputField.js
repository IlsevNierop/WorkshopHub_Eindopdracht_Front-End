import React from "react";
import styles from "../InputField/InputField.module.css";
import {Eye, EyeClosed} from "@phosphor-icons/react";
import {Link} from "react-router-dom";

function InputField({type, name, label, validation, register, errors, children, value, onChange, placeholder, classNameLabel, setShowPassword, showPassword}) {
    return (
            <div className={styles["input-field__column"]}>
                <label className={`${styles[classNameLabel]} ${styles['label__input-field']}`} htmlFor={`${name}-field`}>
                    {label}
                    <input className={`${errors[name] ? styles["input-field__error"] : styles["input-field__none"]} ${styles["input-field"]}`}
                           value={value}

                           type={type}
                           id={`${name}-field`}
                           {...register(name, validation)}
                           onChange={onChange}
                           placeholder={placeholder}

                    />
                    {name === "password" &&
                        <Link className={styles["password-visibility"]} to="#"
                              onClick={() => setShowPassword(!showPassword)}> {showPassword ?
                            <Eye size={18} color="#bfbdbd"/> : <EyeClosed size={18} color="#bfbdbd"/>}</Link>}
                    {children}
                </label>

                <div className={styles["error__row"]}>
                {errors[name] && <p style={{ whiteSpace: 'pre-line'}} className={styles["input-field__error-message"]}>{errors[name].message}</p>}
                </div>
            </div>
    )
}

export default InputField;