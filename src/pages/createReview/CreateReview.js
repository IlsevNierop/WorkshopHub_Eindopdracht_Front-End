import React, {useContext, useState} from 'react';
import styles from "./CreateReview.module.css"
import InputField from "../../components/InputField/InputField";
import {Controller, useForm} from "react-hook-form";
import Button from "../../components/Button/Button";
import {AuthContext} from "../../context/AuthContext";
import {createReview} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {useNavigate, useParams} from "react-router-dom";
import {updateDateFormatLong} from "../../helper/updateDateFormatLong";
import CustomModal from "../../components/CustomModal/CustomModal";

function CreateReview() {
    const {customerId, workshopId, workshopTitle, workshopDate} = useParams();

    const {user: {id}} = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const {register, handleSubmit, formState: {errors}, control} = useForm({mode: 'onBlur'});
    const [error, setError] = useState('');
    const [modalIsOpenCreateSuccessful, setIsOpenCreateSuccessful] = useState(false);
    const navigate = useNavigate();


    async function handleFormSubmit(data) {
        setError('')
        console.log(data)

        try {
            const response = await createReview(token, data.rating, data.reviewDescription, customerId, workshopId);
            console.log(response);
            setError('')
            openModalCreateSuccessful();
            setTimeout(() => {
                closeModalCreateSuccessful();
                navigate("/");
            }, 5000);

        } catch (e) {
            setError(errorHandling(e));
        }

    }

    function openModalCreateSuccessful() {
        setIsOpenCreateSuccessful(true);
    }

    function afterOpenModalCreateSuccessful() {
    }

    function closeModalCreateSuccessful() {
        setIsOpenCreateSuccessful(false);
    }

    return (
        <main className={`outer-container ${styles["create-review__outer-container"]}`}>
            <div className={`inner-container ${styles["create-review__inner-container"]}`}>

                <CustomModal
                    modalIsOpen={modalIsOpenCreateSuccessful}
                    afterOpenModal={afterOpenModalCreateSuccessful}
                    closeModal={closeModalCreateSuccessful}
                    contentLabel="Create review successful"
                    updateHeader="Dank voor het achterlaten van je review"
                    updateMessage="Je review zal geverifieerd worden door de administrator, hiervan krijg je bericht.-
           Zodra deze geverifieerd is zal de review online komen te staan. - Je wordt doorgestuurd naar de homepage."
                ></CustomModal>

                <h1>Laat een review achter</h1>
                <div className={styles["subtitle__create-review"]}>
                    <h3>Over de workshop: {workshopTitle} </h3>
                    <h3>gevolgd op {updateDateFormatLong(workshopDate)}</h3>
                </div>

                {error && <p className="error-message">{error}</p>}

                <form className={styles["create-review__form"]} onSubmit={handleSubmit(handleFormSubmit)}>

                    <InputField
                        type="text"
                        step="any"
                        name="rating"
                        label="Rating* "
                        placeholder="Geef een rating tussen de 0 en 5"
                        validation={{
                            required:
                                {
                                    value: true,
                                    message: "Rating is verplicht",
                                },
                            pattern: {
                                value: /^(?!0+(\.0+)?$)([0-4](\.\d{1})?|5(\.0+)?)$/,
                                message: 'De rating mag maximaal 1 decimaal hebben (gebruik een punt . en geen komma), moet hoger dan 0 zijn en maximaal een 5'
                            }
                        }
                        }
                        register={register}
                        errors={errors}
                    >
                    </InputField>

                    <label htmlFor="reviewDescription">Omschrijving review*</label>
                    <Controller
                        name="reviewDescription"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'Omschrijving is verplicht',
                        }}
                        render={({field}) => (
                            <div>
                            <textarea
                                className={`${errors.description ? styles["textarea__error"] : styles["textarea__none"]} ${styles["textarea__form"]}`}
                                {...field}
                                id="reviewDescription"
                                cols={51}
                                rows={10}
                                placeholder="Vul hier de omschrijving van je review in."
                            />
                                {errors.description && <p style={{whiteSpace: 'pre-line'}}
                                                          className={styles["input-field__error-message"]}>{errors.description.message}</p>}
                            </div>
                        )}
                    />


                    <Button
                        type="submit"
                    >Review versturen</Button>

                </form>


            </div>
        </main>
    );
}

export default CreateReview;