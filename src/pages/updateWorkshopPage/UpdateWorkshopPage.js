import React, {useContext, useEffect, useState} from 'react';
import styles from './UpdateWorkshopPage.module.css';

import {
    createWorkshop,
    fetchSingleWorkshopDataByOwner,
    fetchSingleWorkshopDataToVerifyByAdmin,
    updateAndVerifyWorkshopByAdmin, updateWorkshopByWorkshopOwner
} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {AuthContext} from "../../context/AuthContext";
import InputField from "../../components/InputField/InputField";
import {Controller, useForm} from "react-hook-form";
import Button from "../../components/Button/Button";
import {Link, useNavigate, useParams} from "react-router-dom";
import {capitalizeFirstLetter} from "../../helper/capitalizeFirstLetter";
import Modal from "react-modal";
import {Confetti, X} from "@phosphor-icons/react";
import CustomModal from "../../components/CustomModal/CustomModal";


function UpdateWorkshopPage() {

    const {workshopId} = useParams();
    const token = localStorage.getItem('token');
    const controller = new AbortController();
    const {user: {highestAuthority, id}} = useContext(AuthContext);
    const navigate = useNavigate();
    const {register, handleSubmit, setValue, formState: {errors}, reset, control} = useForm({mode: 'onBlur'});


    const [workshopToVerifyData, setWorkshopToVerifyData] = useState({
        workshopOwnerCompanyName: '',
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        price: '',
        location: '',
        workshopCategory1: '',
        workshopCategory2: '',
        inOrOutdoors: '',
        amountOfParticipants: '',
        highlightedInfo: '',
        description: '',
        workshopPicUrl: '',
        publishWorkshop: '',
        feedbackAdmin: '',
        workshopVerified: '',
    });
    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);
    const [file, setFile] = useState([]);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalIsOpenCheck, setIsOpenCheck] = useState(false);


    useEffect(() => {
        async function fetchWorkshopData() {
            toggleLoading(true);
            setError('');
            if (highestAuthority === 'admin') {
                try {
                    const {
                        workshopOwnerCompanyName,
                        title,
                        date,
                        startTime,
                        endTime,
                        price,
                        location,
                        workshopCategory1,
                        workshopCategory2,
                        inOrOutdoors,
                        amountOfParticipants,
                        highlightedInfo,
                        description,
                        workshopPicUrl,
                        publishWorkshop,
                        feedbackAdmin,
                        workshopVerified
                    } = await fetchSingleWorkshopDataToVerifyByAdmin(token, workshopId);

                    setWorkshopToVerifyData({
                        workshopOwnerCompanyName,
                        title,
                        date,
                        startTime,
                        endTime,
                        price,
                        location,
                        workshopCategory1,
                        workshopCategory2,
                        inOrOutdoors,
                        amountOfParticipants,
                        highlightedInfo,
                        description,
                        workshopPicUrl,
                        publishWorkshop,
                        feedbackAdmin,
                        workshopVerified
                    });
                    setError('');

                    setValue('description', description);
                    setValue('title', title);
                    setValue('date', date);
                    setValue('startTime', startTime.slice(0, 5));
                    setValue('endTime', endTime.slice(0, 5));
                    setValue('price', price);
                    setValue('location', location);
                    setValue('workshopCategory1', workshopCategory1);
                    setValue('workshopCategory2', workshopCategory2);
                    setValue('inOrOutdoors', inOrOutdoors);
                    setValue('amountOfParticipants', amountOfParticipants);
                    setValue('highlightedInfo', highlightedInfo);
                    setValue('description', description);
                    setValue('workshopPicUrl', workshopPicUrl);


                } catch (e) {
                    setError(errorHandling(e));
                    console.log(error);
                }
                toggleLoading(false);
            } else if (highestAuthority === 'workshopowner') {
                try {
                    const {
                        workshopOwnerCompanyName,
                        title,
                        date,
                        startTime,
                        endTime,
                        price,
                        location,
                        workshopCategory1,
                        workshopCategory2,
                        inOrOutdoors,
                        amountOfParticipants,
                        highlightedInfo,
                        description,
                        workshopPicUrl,
                        publishWorkshop,
                        feedbackAdmin,
                        workshopVerified
                    } = await fetchSingleWorkshopDataByOwner(token, workshopId);

                    setWorkshopToVerifyData({
                        workshopOwnerCompanyName,
                        title,
                        date,
                        startTime,
                        endTime,
                        price,
                        location,
                        workshopCategory1,
                        workshopCategory2,
                        inOrOutdoors,
                        amountOfParticipants,
                        highlightedInfo,
                        description,
                        workshopPicUrl,
                        publishWorkshop,
                        feedbackAdmin,
                        workshopVerified
                    });

                    setValue('description', description);
                    setValue('title', title);
                    setValue('date', date);
                    setValue('startTime', startTime.slice(0, 5));
                    setValue('endTime', endTime.slice(0, 5));
                    setValue('price', price);
                    setValue('location', location);
                    setValue('workshopCategory1', workshopCategory1);
                    setValue('workshopCategory2', workshopCategory2);
                    setValue('inOrOutdoors', inOrOutdoors);
                    setValue('amountOfParticipants', amountOfParticipants);
                    setValue('highlightedInfo', highlightedInfo);
                    setValue('description', description);
                    setValue('workshopPicUrl', workshopPicUrl);

                    setError('');

                } catch (e) {
                    setError(errorHandling(e));
                    console.log(error);
                }
                toggleLoading(false);
            }
        }

        void fetchWorkshopData();

        return function cleanup() {
            controller.abort();
        }

    }, []);


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
        console.log(data)

        if (data.title) {
            data.title = capitalizeFirstLetter(data.title);
        }
        if (data.location) {
            data.location = capitalizeFirstLetter(data.location);
        }
        if (data.workshopCategory1) {
            data.workshopCategory1 = capitalizeFirstLetter(data.workshopCategory1);
        }
        if (data.workshopCategory2) {
            data.workshopCategory2 = capitalizeFirstLetter(data.workshopCategory2);
        }


        if (highestAuthority === 'admin') {
            try {
                const response = await updateAndVerifyWorkshopByAdmin(workshopId, token, data.title, data.date, (data.startTime + ":00"), (data.endTime + ":00"), data.price, data.location, data.workshopCategory1, data.workshopCategory2, data.inOrOutdoors, data.amountOfParticipants, data.highlightedInfo, data.description, data.workshopVerified, data.feedbackAdmin, file);
                reset();
                setFile([]);
                openModal();
                setTimeout(() => {
                    closeModal();
                    navigate("/goedkeurenworkshops")
                }, 5000);
            } catch (e) {
                setError(errorHandling(e));
            }
        } else {
            try {
                const response = await updateWorkshopByWorkshopOwner(workshopId, id, token, data.title, data.date, (data.startTime + ":00"), (data.endTime + ":00"), data.price, data.location, data.workshopCategory1, data.workshopCategory2, data.inOrOutdoors, data.amountOfParticipants, data.highlightedInfo, data.description, file);
                reset();
                setFile([]);
                openModal();
                setTimeout(() => {
                    closeModal();
                    //TODO maak 'mijn workshops'
                    navigate("/")
                }, 6000);
            } catch (e) {
                setError(errorHandling(e));
            }
        }
    }

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
        setIsOpen(false);
    }

    function openModalCheck() {
        setIsOpenCheck(true);
    }

    function afterOpenModalCheck() {

    }

    function closeModalCheck() {
        setIsOpenCheck(false);

    }
    const handleIsCheckedChange = () => {
        setIsChecked(prevIsChecked => !prevIsChecked);
        closeModalCheck();
    };



    return (
        <main className={`outer-container ${styles["update-workshop-page__outer-container"]}`}>
            <div className={`inner-container ${styles["update-workshop-page__inner-container"]}`}>

                {highestAuthority === 'admin' &&
                <CustomModal
                    modalIsOpen={modalIsOpen}
                    afterOpenModal={afterOpenModal}
                    closeModal={closeModal}
                    contentLabel="Update workshops successful"
                    updateHeader="Dank voor het aanpassen van de workshop"
                    updateMessage="De workshop eigenaar krijgt hiervan bericht. - Je wordt doorgestuurd naar het overzicht van de openstaande workshops."
                ></CustomModal>
                }
                {highestAuthority !== 'admin' &&
                <CustomModal
                    modalIsOpen={modalIsOpen}
                    afterOpenModal={afterOpenModal}
                    closeModal={closeModal}
                    contentLabel="Update workshops successful"
                    updateHeader="Dank voor het aanpassen van de workshop"
                    updateMessage="Je workshop zal geverifieerd worden door de administrator, hiervan krijg je
                                    bericht. - Zodra deze geverifieerd is, kun je de workshop publiceren. - Je wordt doorgestuurd naar het overzicht van je workshops."
                ></CustomModal>
                }
                <CustomModal
                    modalIsOpen={modalIsOpenCheck}
                    afterOpenModal={afterOpenModalCheck}
                    closeModal={closeModalCheck}
                    contentLabel="Check edit verified workshop"
                    checkModalHeader="Weet je het zeker?"
                    buttonHeaderCheckModalYes="Ik weet het zeker"
                    onclickHandlerCheckModalYes={handleIsCheckedChange}
                    onclickHandlerCheckModalBack={closeModalCheck}
                    checkMessage="Deze workshop is geverifieerd door een administrator.-Als je de workshop wijzigt, wordt deze offline gehaald en moet die eerst geverifieerd worden door een administrator voordat de workshop gepubliceerd kan worden."
                ></CustomModal>


                {highestAuthority === 'admin' ?
                    <>
                        <h1>Te accorderen / aan te passen workshop</h1>
                        <h5>Bedrijf: <span
                            className={styles["company-name"]}> {workshopToVerifyData.workshopOwnerCompanyName} </span>
                        </h5>
                    </>
                    :
                    <h1>Pas hier je workshop aan</h1>}

                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}


                <form className={styles["update-workshop__form"]} onSubmit={handleSubmit(handleFormSubmit)}>


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
                        name="startTime"
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
                        name="endTime"
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
                        name="workshopCategory1"
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
                        name="workshopCategory2"
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
                            defaultValue={workshopToVerifyData.inOrOutdoors}

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
                        name="amountOfParticipants"
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
                        name="highlightedInfo"
                        label="Belangrijke details"
                        register={register}
                        errors={errors}

                    >
                    </InputField>
                    <label htmlFor="description">Omschrijving*</label>
                    <Controller
                        name="description"
                        control={control}
                        rules={{
                            required: 'Omschrijving is verplicht',
                            minLength: {value: 50, message: 'Omschrijving moet uit minstens 50 karakters bestaan'},
                            maxLength: {
                                value: 2000,
                                message: 'Omschrijving mag uit maximaal 2000 karakters bestaan'
                            }
                        }}
                        render={({field}) => (
                            <div>
                            <textarea
                                className={`${errors.description ? styles["textarea__error"] : styles["textarea__none"]} ${styles["textarea__form"]}`}
                                {...field}
                                id="description"
                                name="description"
                                cols={50}
                                rows={20}
                                placeholder="Vul hier de omschrijving van je workshop in, met minimaal 50 en maximaal 2000 karakters."
                            />
                                {errors.description && <p style={{whiteSpace: 'pre-line'}}
                                                          className={styles["input-field__error-message"]}>{errors.description.message}</p>}
                            </div>
                        )}
                    />

                    {workshopToVerifyData.workshopPicUrl &&
                        <label className={styles["workshop-picture__label"]}>
                            Originele afbeelding
                            <img className={styles["workshop-picture"]} src={workshopToVerifyData.workshopPicUrl}
                                 alt="Originele afbeelding"
                            />
                        </label>
                    }

                    <label className={styles["label__input-field__workshop-picture"]}
                           htmlFor="workshop-picture-field">
                        Nieuwe afbeelding
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

                    {highestAuthority === 'admin' &&
                        <div className={styles["container__admin__input-fields"]}>
                            <label htmlFor="workshopVerified">Workshop goed- of afkeuren
                                <div className={styles["workshop-verified-radio-row"]}>
                                    <InputField
                                        classNameInputField="radio-checkbox__workshop-verified"
                                        classNameLabel="label__radio-checkbox__workshop-verified"
                                        name="workshopVerified"
                                        type="radio"
                                        value={true}
                                        validation={{
                                            required:
                                                {
                                                    value: true,
                                                    message: "Het is verplicht de workshop goed of af te keuren. ",
                                                }
                                        }
                                        }
                                        register={register}
                                        errors={errors}
                                    >
                                        Goedgekeurd
                                    </InputField>
                                    <InputField
                                        classNameInputField="radio-checkbox__workshop-verified"
                                        classNameLabel="label__radio-checkbox__workshop-verified"
                                        name="workshopVerified"
                                        type="radio"
                                        value={false}
                                        validation={{
                                            required:
                                                {
                                                    value: true,
                                                    message: "Het is verplicht de workshop goed of af te keuren. ",
                                                }
                                        }
                                        }
                                        register={register}
                                        errors={errors}
                                    >
                                        Afgekeurd
                                    </InputField>
                                </div>
                            </label>

                            <label htmlFor="feedbackAdmin">Feedback voor de workshop eigenaar:
                                <Controller
                                    name="feedbackAdmin"
                                    control={control}
                                    render={({field}) => (
                                        <div>
                            <textarea
                                className={`${errors.feedbackAdmin ? styles["textarea__error"] : styles["textarea__none"]} ${styles["textarea__form"]}`}
                                {...field}
                                id="feedbackAdmin"
                                name="feedbackAdmin"
                                cols={49}
                                rows={6}
                                placeholder="Vul hier eventuele feedback voor de workshop eigenaar in."
                            />
                                            {errors.feedbackAdmin && <p style={{whiteSpace: 'pre-line'}}
                                                                        className={styles["input-field__error-message"]}>{errors.feedbackAdmin.message}</p>}
                                        </div>
                                    )}
                                />
                            </label>

                        </div>
                    }

                    {(workshopToVerifyData.workshopVerified === true && !isChecked) &&
                        // wanted to make this a button, but when using a button type text, the form was submitted when clicking it.
                        <Link className={styles["link-update-worskhop"]} to="#"
                                onClick={openModalCheck}
                        >
                            Workshop wijzigen
                        </Link>
                    }
                    {(workshopToVerifyData.workshopVerified !== true || isChecked === true) &&
                        <Button
                            type="submit"
                        >Verzend wijzigingen</Button>
                    }

                </form>
                <Link className={styles["link"]} to="/">Terug naar de homepage</Link>

            </div>
        </main>
    );
}

export default UpdateWorkshopPage;