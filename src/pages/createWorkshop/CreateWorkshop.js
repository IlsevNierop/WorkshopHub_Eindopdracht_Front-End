import React, {useContext, useState} from 'react';
import styles from '../createWorkshop/CreateWorkshop.module.css'
import {AuthContext} from "../../context/AuthContext";
import InputField from "../../components/InputField/InputField";
import {useForm, Controller} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import Button from "../../components/Button/Button";
import {createWorkshop} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {capitalizeFirstLetter} from "../../helper/capitalizeFirstLetter";
import Modal from "react-modal";
import {Confetti} from "@phosphor-icons/react";

function CreateWorkshop() {

    const {user: {id}} = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const {register, handleSubmit, formState: {errors}, reset, control} = useForm({mode: 'onBlur'});
    const [error, setError] = useState('');
    const [file, setFile] = useState([]);
    const [previewUrl, setPreviewUrl] = useState('');

    const controller = new AbortController();


    const validateFutureDate = (value) => {
        const selectedDate = new Date(value);
        const currentDate = new Date();

        if (selectedDate <= currentDate) {
            return 'De datum van de workshop moet in de toekomst liggen';
        }

        return true;
    };

    function handleImageChange(e) {
        const uploadedFile = e.target.files[0];
        setPreviewUrl(URL.createObjectURL(uploadedFile));
        setFile(uploadedFile);
    }


    async function handleFormSubmit(data) {
        setPreviewUrl('');

        try {
            const response = await createWorkshop(id, token, capitalizeFirstLetter(data.title), data.date, (data.starttime + ":00"), (data.endtime + ":00"), data.price, capitalizeFirstLetter(data.location), capitalizeFirstLetter(data.category1), capitalizeFirstLetter(data.category2), data.inoroutdoors, data.amountparticipants, data.highlightedinfo, data.description, file);
            reset();
            setFile([]);
            openModal();
            setTimeout(() => {
                closeModal();
            }, 5000);


        } catch (e) {
            setError(errorHandling(e));
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
        <main className={`outer-container ${styles["create-workshop__outer-container"]}`}>
            <div className={`inner-container ${styles["create-workshop__inner-container"]}`}>

                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Create workshop successful"
                >
                    <section className={styles["column__pop-up__successful"]}>
                    <div className={styles["row__pop-up__successful"]}>
                        <Confetti size={32} color="#c45018" weight="fill"/>
                        <h3>Dank voor het uploaden van je nieuwe workshop</h3>
                        <Confetti size={32} color="#c45018" weight="fill"/>
                    </div>
                        <p>Je workshop zal geverifieerd worden door de administrator, hiervan krijg je bericht.</p>
                        <p>Zodra deze geverifieerd is, kun je de workshop publiceren.</p>
                    </section>
                </Modal>

                <h1>Nieuwe workshop aanmaken</h1>

                {error && <p className="error-message">{error}</p>}

                <form className={styles["create-workshop__form"]} onSubmit={handleSubmit(handleFormSubmit)}>

                    <InputField
                        type="text"
                        name="title"
                        label="Titel* "
                        validation={{
                            required:
                                {
                                    value: true,
                                    message: "Titel is verplicht",
                                }
                        }
                        }
                        register={register}
                        errors={errors}
                    >
                    </InputField>
                    <InputField
                        type="date"
                        name="date"
                        label="Datum* "
                        validation={{
                            required:
                                {
                                    value: true,
                                    message: "Datum is verplicht",
                                },
                            validate: validateFutureDate
                        }
                        }
                        register={register}
                        errors={errors}
                    >
                    </InputField>
                    <InputField
                        type="time"
                        name="starttime"
                        label="Starttijd* "
                        validation={{
                            required:
                                {
                                    value: true,
                                    message: "Starttijd is verplicht",
                                }
                        }
                        }
                        register={register}
                        errors={errors}
                    >
                    </InputField>
                    <InputField
                        type="time"
                        name="endtime"
                        label="Eindtijd* "
                        validation={{
                            required:
                                {
                                    value: true,
                                    message: "Eindtijd is verplicht",
                                }
                        }
                        }
                        register={register}
                        errors={errors}
                    >
                    </InputField>
                    <InputField
                        type="text"
                        step="any"
                        name="price"
                        label="Prijs* "
                        validation={{
                            required:
                                {
                                    value: true,
                                    message: "Prijs is verplicht",
                                },
                            pattern: {
                                value: /^\d+(\.\d{1,2})?$/,
                                message: 'De prijs mag maximaal 2 decimalen hebben (gebruik een punt . en geen komma) en moet hoger dan 0 zijn'
                            }
                        }
                        }
                        register={register}
                        errors={errors}
                    >
                    </InputField>
                    <InputField
                        type="text"
                        name="location"
                        label="Locatie* "
                        validation={{
                            required:
                                {
                                    value: true,
                                    message: "Locatie is verplicht",
                                }
                        }
                        }
                        register={register}
                        errors={errors}
                    >
                    </InputField>
                    <InputField
                        type="text"
                        name="category1"
                        label="Categorie* "
                        validation={{
                            required:
                                {
                                    value: true,
                                    message: "Categorie is verplicht",
                                }
                        }
                        }
                        register={register}
                        errors={errors}
                    >
                    </InputField>
                    <InputField
                        type="text"
                        name="category2"
                        label="Extra categorie"
                        register={register}
                        errors={errors}
                    >
                    </InputField>

                    <div className={styles["dropdown-inoroutdoors__container"]}>

                        <label className={styles["dropdown-inoroutdoors__label"]}
                               htmlFor="inoroutdoors">Binnen/buiten*</label>
                        <Controller
                            name="inoroutdoors"
                            control={control}
                            defaultValue="INDOORS"
                            render={({field}) => (
                                <select className={styles["dropdown-inoroutdoors__inputfield"]} {...field}
                                        id="inoroutdoors">
                                    <option value="INDOORS">Binnen</option>
                                    <option value="OUTDOORS">Buiten</option>
                                    <option value="IN_AND_OUTDOORS">Gedeeltelijk binnen en buiten</option>
                                </select>
                            )}
                        />
                    </div>
                    <InputField
                        type="number"
                        name="amountparticipants"
                        label="Max aantal deelnemers*"
                        validation={{
                            required:
                                {
                                    value: true,
                                    message: "Maximaal aantal is verplicht",
                                },
                            min: {
                                value: 1,
                                message: 'Het aantal deelnemers moet hoger dan 0 zijn',
                            },
                        }
                        }
                        register={register}
                        errors={errors}
                    >
                    </InputField>
                    <InputField
                        type="text"
                        name="highlightedinfo"
                        label="Belangrijke details"
                        register={register}
                        errors={errors}
                    >
                    </InputField>
                    <label htmlFor="description">Omschrijving*</label>
                    <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'Omschrijving is verplicht',
                            minLength: {value: 50, message: 'Omschrijving moet uit minstens 50 karakters bestaan'},
                            maxLength: {value: 2000, message: 'Omschrijving mag uit maximaal 2000 karakters bestaan'}
                        }}
                        render={({field}) => (
                            <div>
                            <textarea
                                className={`${errors.description ? styles["textarea__error"] : styles["textarea__none"]} ${styles["textarea__form"]}`}
                                {...field}
                                id="description"
                                cols={50}
                                rows={20}
                                placeholder="Vul hier de omschrijving van je workshop in, met minimaal 50 en maximaal 2000 karakters."
                            />
                                {errors.description && <p style={{whiteSpace: 'pre-line'}}
                                                          className={styles["input-field__error-message"]}>{errors.description.message}</p>}
                            </div>
                        )}
                    />
                    <label className={styles["label__input-field__workshop-picture"]}
                           htmlFor="workshop-picture-field">
                        Kies afbeelding
                    <InputField
                        type="file"
                        name="workshop-picture"
                        label="Foto uploaden"
                        classNameInputField="input-field__workshop-picture"
                        onChangeHandler={handleImageChange}
                    >
                    </InputField>
                    </label>

                    {previewUrl &&
                        <label className={styles["workshop-picture__preview__label"]}>
                            Preview:
                            <img className={styles["workshop-picture__preview"]} src={previewUrl}
                                 alt="Voorbeeld van de gekozen afbeelding"
                            />
                        </label>
                    }

                    <Button
                        type="submit"
                    >Workshop aanmaken</Button>

                </form>

            </div>
        </main>
    );
}

export default CreateWorkshop;