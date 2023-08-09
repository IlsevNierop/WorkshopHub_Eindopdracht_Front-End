import React from "react";
import styles from "../InputField/InputField.module.css";
import {Eye, EyeClosed} from "@phosphor-icons/react";
import {Link} from "react-router-dom";

function InputField({
                        type,
                        name,
                        label,
                        validation,
                        register,
                        errors,
                        children,
                        value,
                        placeholder,
                        readOnly,
                        classNameLabel,
                        setShowPassword,
                        showPassword,
                        classNameInputField,
                        nameInputField,
                        minRating,
                        onChangeHandler,
                    }) {
    return (
        <div className={styles["input-field__column"]}>
            <label className={`${styles[classNameLabel]} ${styles['label__input-field']}`} htmlFor={`${name}-field`}>
                {register ?
                    <>
                        {label}

                        {onChangeHandler ?
                            //The onChange is needed for updating the profile page (setValue doesn't work, because of the disabled fields), but adding an onChange variable on the input element (even when it's not an argument when implementing the component) the default onchange behaviour of Hook Form gets overwritten for (at least) submitting with pressing enter (while in an inputfield), and for validating the fields (onblur /ontouched) after trying to submit the first time. Therefor, I made different Hook Form inputfields For workshop, register user, log in etc an inputfield without onChange, and for editing the profile page for example, an inputfield with onChange.
                            <>
                                <input
                                    className={`${errors[name] ? styles["input-field__error"] : styles["input-field__none"]} ${styles["input-field"]} ${styles[`input-field-${name}`]}`}
                                    value={value}
                                    type={type}
                                    id={`${name}-field`}
                                    {...register(name, validation)}
                                    placeholder={placeholder}
                                    onChange={onChangeHandler}
                                />
                                {name === "password" &&
                                    <Link
                                        aria-label="link__show-hide-password"
                                        className={styles["password-visibility"]} to="#"
                                        onClick={() => setShowPassword(!showPassword)}> {showPassword ?
                                        <Eye size={18} color="#bfbdbd"/> :
                                        <EyeClosed size={18} color="#bfbdbd"/>}</Link>}
                            </>
                            :
                            <>
                                <input
                                    className={`${errors[name] ? styles["input-field__error"] : styles["input-field__none"]} ${styles["input-field"]} ${styles[`input-field-${name}`]}`}
                                    value={value}
                                    type={type}
                                    id={`${name}-field`}
                                    {...register(name, validation)}
                                    readOnly={readOnly}
                                    placeholder={placeholder}

                                />
                                {name === "password" &&
                                    <Link
                                        aria-label="link__show-hide-password"
                                        className={styles["password-visibility"]} to="#"
                                        onClick={() => setShowPassword(!showPassword)}> {showPassword ?
                                        <Eye size={18} color="#bfbdbd"/> :
                                        <EyeClosed size={18} color="#bfbdbd"/>}</Link>}
                            </>
                        }
                    </>
                    :
                    <>
                        <input className={`${styles[classNameInputField]}`}
                               type={type}
                               name={nameInputField}
                               value={value}
                               id={`${name}-field`}
                               checked={minRating === value ? "checked"
                                   : null}
                               onChange={onChangeHandler}
                        />
                    </>
                }

                {children}
            </label>

            {errors &&
                <div className={styles["error__row"]}>
                    {errors[name] && <p style={{whiteSpace: 'pre-line'}}
                                        className={styles["input-field__error-message"]}>{errors[name].message}</p>}
                </div>
            }
        </div>
    )
}

export default InputField;