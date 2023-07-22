import styles from "../SignIn/SignIn.module.css";
import {Link} from "react-router-dom";
import InputField from "../InputField/InputField";
import Button from "../Button/Button";
import React from "react";
import CustomModal from "../CustomModal/CustomModal";


function SignIn({
                    modalIsOpen,
                    afterOpenModal,
                    closeModal,
                    handleSubmit,
                    handleFormSubmit,
                    register,
                    errors,
                    showPassword,
                    setShowPassword,
                    error,
                    modalIsOpenResetPassword,
                    afterOpenModalResetPassword,
                    closeModalResetPassword,
                    handleFormSubmitResetPassword,
                    openModalResetPassword
                }) {

    function onClickResetPassword() {
        closeModal();
        openModalResetPassword();
    }

    //TODO fix signin with reset password on all pages (navbar - homepage - workshoppage) & styling fixen van reset password

    return (
        <>

            <CustomModal
                modalIsOpen={modalIsOpen}
                afterOpenModal={afterOpenModal}
                closeModal={closeModal}
                contentLabel="Sign in"
                functionalModalHeader="Inloggen"
            >


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
                    <Link className={styles["bottom-link"]} to="/wachtwoordvergeten" onClick={onClickResetPassword}>
                        <p>Wachtwoord vergeten?</p></Link>

                    <p>Heb je nog geen account? <Link className={styles["bottom-link"]} to="/registreren"
                                                      onClick={closeModal}>Registreer</Link> je
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
                {/*Dit is niet de juiste manier, maar omdat ik niet met emails werk, kan ik niet de echte situatie (met validatielink in email) nabootsen*/}
                <h4>Weet je het wachtwoord niet meer? </h4>
                <h4>Vul hieronder je e-mailadres in en kies een nieuw wachtwoord.</h4>
                <form className={styles["reset-password__form"]} onSubmit={handleSubmit(handleFormSubmitResetPassword)}>
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
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*?[\\!\\#\\@\\$\\%\\&\\/\\(\\)\\=\\?\\*\\-\\+\\_\\.\\:\\;\\,\\{\\}\\^])[A-Za-z0-9!#@$%&/()=?*+-_.:;,{}].+$/,
                                        message: "Ongeldig wachtwoord. Het moet aan de volgende eisen voldoen: \n- Minimaal 1 kleine letter. \n- Minimaal 1 hoofdletter. \n- Minimaal 1 getal \n- Minimaal 1 symbool."
                                    }
                                }
                                }
                                register={register}
                                errors={errors}
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
        </>


    );
}

export default SignIn;