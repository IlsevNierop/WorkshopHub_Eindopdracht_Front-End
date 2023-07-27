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
                            // Het toevoegen van een onChange is nodig voor de update profile pagina (daar werkt de setvalue niet, vanwege de disabled fields), maar wanneer ik een onChange variabele toevoeg aan het input element (zelfs bij het NIET meegeven van dit als argument) dan overschrijft dat het default gedrag van Hook Form voor wat betreft submitten met enter (terwijl in ingevuld veld) en het valideren van de velden na 1x geprobeerd te hebben te submitten. Daarom heb ik voor het aanmaken van een workshop, registreren user, inloggen etc een hook form input zonder onChange, en voor het wijzigen van workshop, profiel, een hook form input met onChange
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
                                    <Link className={styles["password-visibility"]} to="#"
                                          onClick={() => setShowPassword(!showPassword)}> {showPassword ?
                                        <Eye size={18} color="#bfbdbd"/> :
                                        <EyeClosed size={18} color="#bfbdbd"/>}</Link>}
                            </>
                            :
                            <input
                                className={`${errors[name] ? styles["input-field__error"] : styles["input-field__none"]} ${styles["input-field"]} ${styles[`input-field-${name}`]}`}
                                value={value}

                                type={type}
                                id={`${name}-field`}
                                {...register(name, validation)}
                                readOnly={readOnly}
                                placeholder={placeholder}

                            />
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