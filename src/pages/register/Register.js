import React, {useContext, useState} from 'react';
import styles from "../register/Register.module.css"
import InputField from "../../components/InputField/InputField";
import Select from "react-select";
import Button from "../../components/Button/Button";
import {useController, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {createCustomer, createWorkshopOwner, signIn, updateCustomer, updateWorkshopOwner} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {AuthContext} from "../../context/AuthContext";
import {Confetti} from "@phosphor-icons/react";
import Modal from "react-modal";

function Register() {

    const {login} = useContext(AuthContext);
    const {register, handleSubmit, formState: {errors}, reset, control} = useForm({mode: 'onTouched'});
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const {
        field: {
            value: workshopOwner,
            label: userTypeLabel,
            onChange: userTypeOnChange,
            ...restUserTypeField
        }
    } = useController({name: 'workshopOwner', control});


    const optionsUserType = [
        {value: false, label: "Consument"},
        {value: true, label: "Workshop eigenaar"}
    ];

    const navigate = useNavigate();
    const controller = new AbortController();

    // TODO modal voor succesvol registreren

    async function handleFormSubmit(data) {

        if (workshopOwner) {
            try {
                const response = await createWorkshopOwner(data.firstname, data.lastname, data.email, data.password, data.workshopOwner, data.companyname, data.kvknumber, data.vatnumber);
                reset();
                openModal();
                setTimeout(() => {
                    closeModal();
                    login(response.jwt, "/profiel");
                }, 2000);


            } catch (e) {
                setError(errorHandling(e));
            }

        } else {
            try {
                console.log(data.workshopOwner);

                const response = await createCustomer(data.firstname, data.lastname, data.email, data.password, data.workshopOwner,);
                reset();
                openModal();
                setTimeout(() => {
                    closeModal();
                    login(response.jwt, "/profiel");
                }, 2000);

            } catch (e) {
                setError(errorHandling(e));
            }
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
            <main className={`outer-container ${styles["register__outer-container"]}`}>
                <div className={`inner-container ${styles["register__inner-container"]}`}>
                    <Modal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Register successful"
                    >
                        <div className={styles["row__pop-up__successful"]}>
                            <Confetti size={32} color="#c45018" weight="fill"/>
                            <h3>Welkom! Bedankt voor het registreren. </h3>
                            <h3>Je profiel is succesvol aangemaakt!</h3>
                            <Confetti size={32} color="#c45018" weight="fill"/>
                        </div>
                    </Modal>

                    <h1>Registreren</h1>
                    <form className={styles["register__form"]} onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className={styles["register-fields-personal"]}>
                            <InputField
                                type="text"
                                name="firstname"
                                label="Voornaam* "
                                validation={{
                                    required:
                                        {
                                            value: true,
                                            message: "Voornaam is verplicht",
                                        }
                                }
                                }
                                register={register}
                                errors={errors}
                            >
                            </InputField>


                            <InputField
                                type="text"
                                name="lastname"
                                label="Achternaam* "
                                validation={{
                                    required:
                                        {
                                            value: true,
                                            message: "Achternaam is verplicht",
                                        }
                                }
                                }
                                register={register}
                                errors={errors}
                            >
                            </InputField>

                            <InputField
                                type="text"
                                name="email"
                                label="Email* "
                                validation={{
                                    required:
                                        {
                                            value: true,
                                            message: "E-mail is verplicht",
                                        }, pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i,
                                        message: "Vul een geldig e-mailadres in"
                                    }
                                }
                                }
                                register={register}
                                errors={errors}
                            >
                            </InputField>
                            <>
                                <InputField
                                    classNameLabel="password-input-field"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    label="Wachtwoord* "
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
                                <div className={styles["user-type__row"]}>
                                    <label className={styles["user-type__label"]}>Consument/
                                        workshop eigenaar*
                                        <Select className={styles["user-type__dropdown"]}
                                                options={optionsUserType}
                                                value={userTypeLabel}
                                                onChange={option => userTypeOnChange(option ? option.value : option)}
                                                {...restUserTypeField}
                                            required="true"
                                                //TODO change required message
                                        />
                                    </label>
                                    {errors.workshopOwner && <p>{errors.workshopOwner.message}</p>}
                                </div>
                            </>
                        </div>


                        {workshopOwner &&
                            <div className={styles["register-fields-company"]}>
                                <InputField
                                    type="text"
                                    name="companyname"
                                    label="Bedrijfsnaam* "
                                    validation={{
                                        required:
                                            {
                                                value: true,
                                                message: "Bedrijfsnaam is verplicht",
                                            }
                                    }
                                    }
                                    register={register}
                                    errors={errors}
                                >
                                </InputField>


                                <InputField
                                    type="number"
                                    name="kvknumber"
                                    label="KvK nummer* "
                                    validation={{
                                        required:
                                            {
                                                value: true,
                                                message: "KvK nummer is verplicht en moet uit getallen bestaan",
                                            },
                                        maxLength: {
                                            value: 10,
                                            message: 'KvK nummer mag niet meer dan 10 getallen zijn',
                                        },
                                    }
                                    }
                                    register={register}
                                    errors={errors}
                                >
                                </InputField>

                                <InputField
                                    type="text"
                                    name="vatnumber"
                                    label="BTW nummer* "
                                    validation={{
                                        required:
                                            {
                                                value: true,
                                                message: "BTW nummer is verplicht",
                                            }
                                    }
                                    }
                                    register={register}
                                    errors={errors}
                                >
                                </InputField>
                            </div>
                        }
                        {/*//TODO check button disablen als niet alle required velden zijn ingevuld*/}
                        <Button
                            type="submit"
                            disabled= {error? "disabled" : null}
                        >Verstuur</Button>
                        {error && <p className="error-message">{error}</p>}

                    </form>

                </div>
            </main>

        </>
    );
}

export default Register;
