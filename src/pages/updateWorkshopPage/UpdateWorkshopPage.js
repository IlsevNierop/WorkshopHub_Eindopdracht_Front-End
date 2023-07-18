import React, {useContext, useEffect, useState} from 'react';
import styles from './UpdateWorkshopPage.module.css';

import {returnHighestAuthority} from "../../helper/returnHighestAuthority";
import {createWorkshop, fetchSingleWorkshopDataByOwner, fetchSingleWorkshopDataToVerifyByAdmin} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {AuthContext} from "../../context/AuthContext";
import InputField from "../../components/InputField/InputField";
import {Controller, useForm} from "react-hook-form";
import Button from "../../components/Button/Button";
import {useNavigate, useParams} from "react-router-dom";
import {capitalizeFirstLetter} from "../../helper/capitalizeFirstLetter";
import Modal from "react-modal";
import {Confetti} from "@phosphor-icons/react";

function UpdateWorkshopPage() {

    const {workshopId} = useParams();
    const token = localStorage.getItem('token');
    const controller = new AbortController();
    const {user} = useContext(AuthContext);


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
    const {register, handleSubmit, formState: {errors}, reset, control} = useForm({mode: 'onBlur'});
    const [file, setFile] = useState([]);
    const [previewUrl, setPreviewUrl] = useState('');


    useEffect(() => {
        async function fetchWorkshopData() {
            toggleLoading(true);
            setError('');
            if (returnHighestAuthority(user.authorities) === 'admin') {
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

                } catch (e) {
                    setError(errorHandling(e));
                    console.log(error);
                }
                toggleLoading(false);
            } else if (returnHighestAuthority(user.authorities) === 'workshopowner') {
                try {
                    const response = await fetchSingleWorkshopDataByOwner(token, workshopId);
                    console.log("owner", response)

                    setWorkshopToVerifyData(response);
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

    const handleChange = (event) => {
        const {name, value} = event.target;
        setWorkshopToVerifyData((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };


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

        // TODO put voor admin vs owner

        // try {
        //     const response = await createWorkshop(id, token, capitalizeFirstLetter(data.title), data.date, (data.starttime + ":00"), (data.endtime + ":00"), data.price, capitalizeFirstLetter(data.location), capitalizeFirstLetter(data.category1), capitalizeFirstLetter(data.category2), data.inoroutdoors, data.amountparticipants, data.highlightedinfo, data.description, file);
        //     reset();
        //     setFile([]);
        //     openModal();
        //     setTimeout(() => {
        //         closeModal();
        //     }, 5000);

        //
        // } catch (e) {
        //     setError(errorHandling(e));
        // }

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
        <main className={`outer-container ${styles["update-workshop-page__outer-container"]}`}>
            <div className={`inner-container ${styles["update-workshop-page__inner-container"]}`}>

                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Update workshop successful"
                >
                    <section className={styles["column__pop-up__successful"]}>
                        <div className={styles["row__pop-up__successful"]}>
                            <Confetti size={32} color="#c45018" weight="fill"/>
                            {/*//TODO conditioneel voor admin vs owner*/}
                            <h3>Dank voor het aanpassen van de workshop</h3>
                            <Confetti size={32} color="#c45018" weight="fill"/>
                        </div>
                        <p>Je workshop zal geverifieerd worden door de administrator, hiervan krijg je bericht.</p>
                        <p>Zodra deze geverifieerd is, kun je de workshop publiceren.</p>
                    </section>
                </Modal>


                <h1>{returnHighestAuthority(user.authorities) === 'admin' ? "Te accorderen workshop" : "Pas hier je workshop aan"}</h1>
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
                            value={workshopToVerifyData.title}
                            // onChangeHandler={handleChange}
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
                            value={workshopToVerifyData.date}
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
                            value={workshopToVerifyData.startTime}
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
                            value={workshopToVerifyData.endTime}
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
                            value={workshopToVerifyData.price}
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
                            value={workshopToVerifyData.location}
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
                            value={workshopToVerifyData.workshopCategory1}
                        >
                        </InputField>
                        <InputField
                            type="text"
                            name="category2"
                            label="Extra categorie"
                            register={register}
                            errors={errors}
                            value={workshopToVerifyData.workshopCategory2}

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
                            value={workshopToVerifyData.amountOfParticipants}

                        >
                        </InputField>
                        <InputField
                            type="text"
                            name="highlightedinfo"
                            label="Belangrijke details"
                            register={register}
                            errors={errors}
                            value={workshopToVerifyData.highlightedInfo}

                        >
                        </InputField>
                        <label htmlFor="description">Omschrijving*</label>
                        <Controller
                            name="description"
                            control={control}
                            defaultValue=''

                            rules={{
                                required: 'Omschrijving is verplicht',
                                minLength: {value: 50, message: 'Omschrijving moet uit minstens 50 karakters bestaan'},
                                maxLength: {
                                    value: 1500,
                                    message: 'Omschrijving mag uit maximaal 1500 karakters bestaan'
                                }
                            }}
                            render={({field}) => (
                                <div>
                            <textarea
                                className={`${errors.description ? styles["textarea__error"] : styles["textarea__none"]} ${styles["textarea__form"]}`}
                                {...field}
                                id="description"
                                cols={52}
                                rows={20}
                                placeholder="Vul hier de omschrijving van je workshop in, met minimaal 50 en maximaal 1500 karakters."
                                value={workshopToVerifyData.description}
                            />
                                    {errors.description && <p style={{whiteSpace: 'pre-line'}}
                                                              className={styles["input-field__error-message"]}>{errors.description.message}</p>}
                                </div>
                            )}
                        />

                        {workshopToVerifyData.workshopPicUrl &&
                            <label className={styles["workshop-picture__label"]}>
                                Originele afbeelding:
                                <img className={styles["workshop-picture"]} src={workshopToVerifyData.workshopPicUrl}
                                     alt="Originele afbeelding"
                                />
                            </label>
                        }

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
                        >Workshop updaten</Button>

                    </form>



            </div>
        </main>
    );
}

export default UpdateWorkshopPage;