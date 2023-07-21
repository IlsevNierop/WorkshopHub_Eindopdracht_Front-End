import React, {useState} from 'react';

import styles from "../resetPassword/ResetPassword.module.css";
import {useForm} from "react-hook-form";
import {resetPassword, signIn} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import {Link, useNavigate} from "react-router-dom";
//TODO modal veranderen of reset modal maken
import Modal from "react-modal";
import {Confetti, X} from "@phosphor-icons/react";

function ResetPassword() {
    const {register, handleSubmit, formState: {errors}, reset} = useForm({mode: 'onTouched'});
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();


    async function handleFormSubmit(data) {

        try {
            const response = await resetPassword(data.email, data.password);
            console.log(response);
            reset();
            openModal();
            setTimeout(() => {
                closeModal();
                navigate("/")

            }, 2000);


        } catch (e) {
            setError(errorHandling(e));
            setTimeout(() => {
                setError('');

            }, 4000);
            console.log(error);
        }
    }

    // ...................MODAL
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

//TODO setappelement seems to be unneccesary?
    Modal.setAppElement('#root');


    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
        setIsOpen(false);
    }


    return (
        <>
            <main className={`outer-container ${styles["password__outer-container"]}`}>
                <div className={`inner-container ${styles["password__inner-container"]}`}>
                    <section className={styles["top-password"]}>

                        <Modal
                            isOpen={modalIsOpen}
                            onAfterOpen={afterOpenModal}
                            onRequestClose={closeModal}
                            style={customStyles}
                            contentLabel="Reset password successful"
                        >
                            <div className={styles["row__pop-up__successful-reset"]}>
                                <Confetti size={32} color="#c45018" weight="fill"/>
                                <h3>Je wachtwoord is succesvol aangepast!</h3>
                                <Confetti size={32} color="#c45018" weight="fill"/>
                                </div>
                        </Modal>


                        <h1>Wachtwoord vergeten</h1>
                        {/*Dit is niet de juiste manier, maar omdat ik niet met emails werk, kan ik niet de echte situatie (met validatielink in email) nabootsen*/}
                        <h4>Weet je het wachtwoord niet meer? </h4>
                        <h4>Vul hieronder je e-mailadres in en kies een nieuw wachtwoord.</h4>
                    </section>

                    <form className={styles["reset-password__form"]} onSubmit={handleSubmit(handleFormSubmit)}>
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


                </div>
            </main>

        </>
    );
}

export default ResetPassword;