import React, {useContext, useState} from 'react';
import styles from '../createWorkshop/CreateWorkshop.module.css'
import {AuthContext} from "../../context/AuthContext";
import InputField from "../../components/InputField/InputField";
import {useForm, Controller, useController} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import Button from "../../components/Button/Button";
import {createCustomer, createWorkshop, createWorkshopOwner} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";
import Select from "react-select";

function CreateWorkshop() {

    const {user: {id}} = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const {register, handleSubmit, formState: {errors}, reset, control} = useForm({mode: 'onBlur'});
    const [error, setError] = useState('');
    const [file, setFile] = useState([]);
    const [previewUrl, setPreviewUrl] = useState('');

    const navigate = useNavigate();
    const controller = new AbortController();


    const validateFutureDate = (value) => {
        const selectedDate = new Date(value);
        const currentDate = new Date();

        if (selectedDate <= currentDate) {
            return 'De datum van de workshop moet in de toekomst liggen';
        }

        return true;
    };


    async function handleFormSubmit(data) {
        console.log(data)
        console.log(data.date)
        console.log(data.inoroutdoors)

        // console.log(updateDateFormatShort(data.date))
        console.log(data.starttime + ":00")
        console.log(data.endtime + ":00")


        try {
            const response = await createWorkshop(id, token, data.title, data.date, (data.starttime + ":00"),(data.endtime + ":00"), data.price, data.location, data.category1, data.category2, data.inoroutdoors, data.amountparticipants, data.highlightedinfo, data.description);
            reset();
            console.log(response);
            console.log("gelukt!")
            // openModal();
            // setTimeout(() => {
            //     // closeModal();
            // }, 2000);


        } catch (e) {
            setError(errorHandling(e));
        }

    }


    return (
        <main className={`outer-container ${styles["create-workshop__outer-container"]}`}>
            <div className={`inner-container ${styles["create-workshop__inner-container"]}`}>

                <h1>Nieuwe workshop aanmaken</h1>

                <form className={styles["create-workshop__form"]} onSubmit={handleSubmit(handleFormSubmit)}>

                    {/*TODO check validation backend*/}
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
                                message: 'De prijs mag maximaal 2 decimalen hebben (gebruik een .) en moet hoger dan 0 zijn'
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
                               htmlFor="inoroutdoors">Binnen/buiten:</label>
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
                            maxLength: {value: 1500, message: 'Omschrijving mag uit maximaal 1500 karakters bestaan'}
                        }}
                        render={({field}) => (
                            <div>
                            <textarea className={`${errors.description ? styles["textarea__error"] : styles["textarea__none"]} ${styles["textarea__form"]}`}
                                      {...field}
                                      id="description"
                                      cols={52}
                                      rows={20}
                                      placeholder="Vul hier de omschrijving van je workshop in, met minimaal 50 en maximaal 1500 karakters."
                            />
                                {errors.description && <p style={{whiteSpace: 'pre-line'}} className={styles["input-field__error-message"]} >{errors.description.message}</p>}
                            </div>
                        )}
                    />

                    <Button
                        type="submit"
                    >Workshop aanmaken</Button>

                </form>

            </div>
        </main>
    );
}

export default CreateWorkshop;