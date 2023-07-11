import Modal from "react-modal";
import styles from "../SignIn/SignIn.module.css";
import {Link} from "react-router-dom";
import {X} from "@phosphor-icons/react";
import InputField from "../InputField/InputField";
import Button from "../Button/Button";
import React from "react";


function SignIn({modalIsOpen, afterOpenModal, closeModal, customStyles, handleSubmit, handleFormSubmit, register, errors, showPassword, setShowPassword, error}) {
    return (
        <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Sign in"
        >

            <div className={styles["top-row__signin"]}>
                <h3>Inloggen</h3>
                <Link to="#" onClick={closeModal}><X size={18}/></Link>
            </div>
            <form className={styles["signin__form"]} onSubmit={handleSubmit(handleFormSubmit)}>
                <InputField
                    type="text"
                    name="email"
                    label="Email: "
                    validation={{
                        required:
                            {
                                value: true,
                                message: "E-mail is verplicht",
                            }, pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i,
                            message: "Vul een geldig e-mailadres in"
                        }
                    }}
                    register={register}
                    errors={errors}
                >
                </InputField>
                <InputField classNameLabel="password-input-field"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            label="Wachtwoord: "
                            validation={{
                                required:
                                    {
                                        value: true,
                                        message: "Wachtwoord is verplicht",
                                    }
                            }}
                            register={register}
                            errors={errors}
                            setShowPassword={setShowPassword}
                            showPassword={showPassword}
                >
                </InputField>
                {error && <p className="error-message">{error}</p>}
                <Button
                    type="submit"
                >Inloggen</Button>
            </form>


            <div className={styles["bottom-links__signin"]}>
                <Link className={styles["bottom-link"]} to="/wachtwoordvergeten" onClick={closeModal}>
                    <p>Wachtwoord vergeten?</p></Link>

                <p>Heb je nog geen account? <Link className={styles["bottom-link"]} to="/registreren"
                                                  onClick={closeModal}>Registreer</Link> je
                    dan eerst.</p>
            </div>

        </Modal>

    );
}

export default SignIn;