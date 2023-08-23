import styles from "../SignIn/SignIn.module.css";
import {Link} from "react-router-dom";
import InputField from "../InputField/InputField";
import Button from "../Button/Button";
import React, {useContext, useState} from "react";
import CustomModal from "../CustomModal/CustomModal";
import {resetPassword, signIn} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {useForm} from "react-hook-form";
import {AuthContext} from "../../context/AuthContext";
import {ModalSignInContext} from "../../context/ModalSigninContext";


function SignIn() {

    const {login} = useContext(AuthContext);
    const {modalIsOpenSignIn, setModalIsOpenSignIn, signInSubHeader} = useContext(ModalSignInContext);

    const {register, handleSubmit, formState: {errors}, reset} = useForm({mode: 'onBlur'});
    const {
        register: registerResetPassword,
        handleSubmit: handleSubmitResetPassword,
        formState: {errors: errorsResetPassword},
        reset: resetResetPassword
    } = useForm({mode: 'onBlur'});
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [modalIsOpenResetPassword, setIsOpenResetPassword] = useState(false);
    const [modalIsOpenMessage, setIsOpenMessage] = useState(false);


    function onClickResetPassword() {
        closeModalSignIn();
        openModalResetPassword();
    }

    function afterOpenModalSignin() {
    }

    function closeModalSignIn() {
        setModalIsOpenSignIn(false);
        setError('');
        setShowPassword(false);
        reset();
    }

    function openModalResetPassword() {
        setIsOpenResetPassword(true);
    }

    function afterOpenModalResetPassword() {
    }

    function closeModalResetPassword() {
        setIsOpenResetPassword(false);
        setError('');
        setShowPassword(false);
        resetResetPassword();
    }

    function openModalMessage() {
        setIsOpenMessage(true);
    }

    function afterOpenModalMessage() {
    }

    function closeModalMessage() {
        setIsOpenMessage(false);
        setError('');
    }

    async function handleFormSubmit(data) {
        setError('');
        try {
            const {jwt} = await signIn(data.email, data.password);
            reset();
            login(jwt);
            closeModalSignIn();
        } catch (e) {
            setError(errorHandling(e));
            console.log(error);
        }
    }

    async function handleFormSubmitResetPassword(data) {
        try {
            const response = await resetPassword(data.email, data.password);
            console.log(response);
            closeModalResetPassword();
            openModalMessage();
            setTimeout(() => {
                closeModalMessage();
                setModalIsOpenSignIn(true);
            }, 2000);
        } catch (e) {
            setError(errorHandling(e));
            setTimeout(() => {
                setError('');

            }, 4000);
            console.log(error);
        }
    }


    return (
        <>
            <CustomModal
                modalIsOpen={modalIsOpenSignIn}
                afterOpenModal={afterOpenModalSignin}
                closeModal={closeModalSignIn}
                contentLabel="Sign in"
                functionalModalHeader="Inloggen"
            >
                <h4 className={styles["content__modal__signin"]}>{signInSubHeader}</h4>
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
                    <Link className={styles["bottom-link"]} to="#" onClick={onClickResetPassword}>
                        <p>Wachtwoord vergeten?</p></Link>
                    <p>Heb je nog geen account? <Link className={styles["bottom-link"]} to="/registreren"
                                                      onClick={closeModalSignIn}>Registreer</Link> je
                        dan eerst.</p>
                </div>
            </CustomModal>

            <CustomModal
                modalIsOpen={modalIsOpenResetPassword}
                afterOpenModal={afterOpenModalResetPassword}
                closeModal={closeModalResetPassword}
                contentLabel="Reset Password"
                functionalModalHeader="Wachtwoord wijzigen"
            >
                {/*This is not the correct way to reset a password, because usually the user will be validated before he/she can reset the password (normally through email for example). But because I don't have email functionality, don't know of a way to validate the user, but do want a password reset functionality, it's possible to reset a password, by just filling in your email address and new password. */}
                <h4 className={styles["content__modal__reset-password"]}>Weet je het wachtwoord niet meer? </h4>
                <h4 className={styles["content__modal__reset-password"]}>Vul hieronder je e-mailadres in en een
                    nieuw wachtwoord.</h4>
                <form className={styles["reset-password__form"]} onSubmit={handleSubmitResetPassword(handleFormSubmitResetPassword)}>
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
                        register={registerResetPassword}
                        errors={errorsResetPassword}
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
                                        },
                                    minLength: {
                                        value: 8,
                                        message: 'Wachtwoord moet minstens 8 karakters lang zijn',
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: 'Wachtwoord mag niet meer dan 20 karakters lang zijn',
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*?[!#@$%&\/()=?*\-+_.:;,{}^\[\]])[A-Za-z0-9!#@$%&/()=?*+\-\[\]_.:;,{}].+$/,
                                        message: "Ongeldig wachtwoord. Het moet aan de volgende eisen voldoen: \n- Minimaal 1 kleine letter. \n- Minimaal 1 hoofdletter. \n- Minimaal 1 getal \n- Minimaal 1 symbool."
                                    }
                                }
                                }
                                register={registerResetPassword}
                                errors={errorsResetPassword}
                                setShowPassword={setShowPassword}
                                showPassword={showPassword}
                    >
                    </InputField>
                    {error && <p className="error-message">{error}</p>}
                    <Button
                        type="submit"
                    >Verstuur</Button>
                </form>

            </CustomModal>


            <CustomModal
                modalIsOpen={modalIsOpenMessage}
                afterOpenModal={afterOpenModalMessage}
                closeModal={closeModalMessage}
                contentLabel="Reset Password Successful"
                updateHeader="Je wachtwoord is succesvol gewijzigd"
                updateMessage="Je kunt nu inloggen met je nieuwe wachtwoord"
            >
            </CustomModal>
        </>
    );
}

export default SignIn;