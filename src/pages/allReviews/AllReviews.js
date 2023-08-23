import React, {useContext, useEffect, useState} from 'react';
import styles from "./AllReviews.module.css";
import {Link} from "react-router-dom";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";
import {NotePencil, TrashSimple} from "@phosphor-icons/react";
import {
    fetchAllReviewsAdmin,
    fetchAllReviewsCustomer,
    removeReview, updateReviewByAdmin, updateReviewByCustomer,
    verifyReviewByAdmin
} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {AuthContext} from "../../context/AuthContext";
import CustomModal from "../../components/CustomModal/CustomModal";
import Select from "react-select";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import {Controller, useForm} from "react-hook-form";
import {sortArrayTable} from "../../helper/sortArrayTable";

function AllReviews() {
    const token = localStorage.getItem('token');
    const {user: {highestAuthority, id}} = useContext(AuthContext);

    const {register, setValue, handleSubmit, formState: {errors}, reset, control} = useForm({mode: 'onBlur'});

    const controller = new AbortController();

    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);

    const [reviewsData, setReviewsData] = useState([]);
    const [needToUpdateReviewsData, toggleNeedToUpdateReviewsData] = useState(false);
    const [sortValue, setSortValue] = useState([]);
    const [toDeleteReviewId, setToDeleteReviewId] = useState(null);
    const [reviewVerified, setReviewVerified] = useState(null);

    const [modalIsOpenDeleteCheck, setIsOpenDeleteCheck] = useState(false);
    const [modalIsOpenDeleteSuccessful, setIsOpenDeleteSuccessful] = useState(false);
    const [modalIsOpenError, setIsOpenError] = useState(false);
    const [modalIsOpenVerifySuccessful, setIsOpenVerifySuccessful] = useState(false);

    const [modalIsOpenUpdateReview, setIsOpenUpdateReview] = useState(false);
    const [modalIsOpenUpdateReviewSuccessful, setIsOpenUpdateReviewSuccessful] = useState(false);


    const optionsSortValue =
        highestAuthority === 'admin' ?
            [{value: 'reviewId', label: 'Review ID'},
                {value: 'companyNameWorkshopOwner', label: 'Workshop eigenaar'},
                {value: 'rating', label: 'Rating'},
                {value: 'reviewVerified', label: 'Goedgekeurd'},
                {value: 'firstNameReviewer', label: 'Voornaam klant'},
            ]
            :
            [{value: 'reviewId', label: 'Review ID'},
                {value: 'companyNameWorkshopOwner', label: 'Workshop eigenaar'},
                {value: 'rating', label: 'Rating'},
                {value: 'reviewVerified', label: 'Goedgekeurd'},
            ];


    useEffect(() => {
            async function getAllReviews() {
                toggleLoading(true);
                setError('');

                try {
                    let response;
                    if (highestAuthority === 'admin') {
                        response = await fetchAllReviewsAdmin(token);
                    } else {
                        response = await fetchAllReviewsCustomer(token, id);
                    }
                    setReviewsData(response);
                    if (response) {
                        setError('');
                    }
                } catch (e) {
                    setError(errorHandling(e));
                    openModalError();
                    setTimeout(() => {
                        closeModalError();
                    }, 4000);
                    console.log(error);
                }
                toggleLoading(false);
            }

            void getAllReviews();

            return function cleanup() {
                controller.abort();
            }
        }

        ,
        [needToUpdateReviewsData]
    );

    useEffect(() => {
        setReviewsData(sortArrayTable(reviewsData, sortValue.value));
    }, [sortValue]);


    async function verifyReview(reviewId, rating, reviewDescription, reviewVerified, feedbackAdmin) {
        setError('');

        try {
            const response = await verifyReviewByAdmin(token, reviewId, rating, reviewDescription, reviewVerified, feedbackAdmin);
            setError('');
            console.log(response);
            toggleNeedToUpdateReviewsData(!needToUpdateReviewsData);
            openModalVerifySuccessful();
            setTimeout(() => {
                closeModalVerifySuccessful();
            }, 4000);

        } catch (e) {
            setError(errorHandling(e));
            openModalError();
            setTimeout(() => {
                closeModalError();
            }, 4000);
            console.log(error);
        }

    }

    async function deleteReview(reviewId) {
        setError('');
        closeModalDeleteCheck();
        try {
            const response = await removeReview(token, reviewId);
            setError('');
            console.log(response);
            toggleNeedToUpdateReviewsData(!needToUpdateReviewsData);
            openModalDeleteSuccessful();
            setTimeout(() => {
                closeModalDeleteSuccessful();
            }, 3000);

        } catch (e) {
            setError(errorHandling(e));
            openModalError();
            setTimeout(() => {
                closeModalError();
            }, 4000);
            console.log(error);
        }

    }

    function changeReview(reviewId, firstNameReviewer, lastNameReviewer, rating, reviewDescription, reviewVerified, feedbackAdmin) {
        setReviewVerified(reviewVerified);
        setValue('reviewId', reviewId);
        setValue('firstNameReviewer', firstNameReviewer)
        setValue('lastNameReviewer', lastNameReviewer)
        setValue('rating', rating);
        setValue('reviewDescription', reviewDescription);
        setValue('reviewVerified', reviewVerified);
        setValue('feedbackAdmin', feedbackAdmin);
        openModalUpdateReview();
    }

    async function handleFormSubmit(data) {
        try {
            if (highestAuthority === 'admin') {
                await updateReviewByAdmin(token, data.reviewId, data.rating, data.reviewDescription, data.verify, data.feedbackAdmin);
            } else {
                await updateReviewByCustomer(token, data.reviewId, data.rating, data.reviewDescription, data.verify, data.feedbackAdmin, id);
            }
            closeModalUpdateReview();
            openModalUpdateReviewSuccessful();
            toggleNeedToUpdateReviewsData(!needToUpdateReviewsData);
            setTimeout(() => {
                closeModalUpdateReviewSuccessful();
            }, 4000);


        } catch (e) {
            setError(errorHandling(e));
            console.log(e)
            openModalError();
            setTimeout(() => {
                closeModalError();
            }, 3000);
        }
    }

    function openModalError() {
        setIsOpenError(true);
    }

    function afterOpenModalError() {
    }

    function closeModalError() {
        setIsOpenError(false);
    }

    function checkDeleteReview(reviewId) {
        openModalDeleteCheck();
        setToDeleteReviewId(reviewId);
    }

    function openModalDeleteSuccessful() {
        setIsOpenDeleteSuccessful(true);
    }

    function afterOpenModalDeleteSuccessful() {
    }

    function closeModalDeleteSuccessful() {
        setIsOpenDeleteSuccessful(false);
    }

    function openModalDeleteCheck() {
        setIsOpenDeleteCheck(true);
    }

    function afterOpenModalDeleteCheck() {
    }

    function closeModalDeleteCheck() {
        setIsOpenDeleteCheck(false);
        setToDeleteReviewId(null);
    }

    function openModalVerifySuccessful() {
        setIsOpenVerifySuccessful(true);
    }

    function afterModalVerifySuccessful() {
    }

    function closeModalVerifySuccessful() {
        setIsOpenVerifySuccessful(false);
    }

    function openModalUpdateReview() {
        setIsOpenUpdateReview(true);
    }

    function afterOpenModalUpdateReview() {
    }

    function closeModalUpdateReview() {
        setIsOpenUpdateReview(false);
        setReviewVerified(null);
        reset();
    }

    function openModalUpdateReviewSuccessful() {
        setIsOpenUpdateReviewSuccessful(true);
    }

    function afterOpenModalUpdateReviewSuccessful() {
    }

    function closeModalUpdateReviewSuccessful() {
        setIsOpenUpdateReviewSuccessful(false);
    }


    return (
        <main className={`outer-container ${styles["all-reviews__outer-container"]}`}>
            <div className={`inner-container ${styles["all-reviews__inner-container"]}`}>

                {loading && <p>Loading...</p>}

                {error &&
                    <CustomModal
                        modalIsOpen={modalIsOpenError}
                        afterOpenModal={afterOpenModalError}
                        closeModal={closeModalError}
                        contentLabel="Error"
                        errorMessage={error}
                    >
                    </CustomModal>
                }

                <CustomModal
                    modalIsOpen={modalIsOpenVerifySuccessful}
                    afterOpenModal={afterModalVerifySuccessful}
                    closeModal={closeModalVerifySuccessful}
                    contentLabel="Verify review successful"
                    updateHeader={`De review is succesvol goedgekeurd`}
                ></CustomModal>

                <CustomModal
                    modalIsOpen={modalIsOpenDeleteCheck}
                    afterOpenModal={afterOpenModalDeleteCheck}
                    closeModal={closeModalDeleteCheck}
                    contentLabel="Check deleting review"
                    checkModalHeader="Weet je het zeker?"
                    buttonHeaderCheckModalYes="Ja ik weet het zeker"
                    onclickHandlerCheckModalYes={() => deleteReview(toDeleteReviewId)}
                    onclickHandlerCheckModalBack={closeModalDeleteCheck}
                    checkMessage="Wil je de review echt verwijderen? -Door op Ja te klikken wordt de review verwijderd"
                ></CustomModal>

                <CustomModal
                    modalIsOpen={modalIsOpenDeleteSuccessful}
                    afterOpenModal={afterOpenModalDeleteSuccessful}
                    closeModal={closeModalDeleteSuccessful}
                    contentLabel="Delete review successful"
                    updateHeader={`De review is succesvol verwijderd`}
                ></CustomModal>
                <CustomModal
                    modalIsOpen={modalIsOpenUpdateReviewSuccessful}
                    afterOpenModal={afterOpenModalUpdateReviewSuccessful}
                    closeModal={closeModalUpdateReviewSuccessful}
                    contentLabel="Update review successful"
                    updateHeader={`De review is succesvol gewijzigd`}
                ></CustomModal>

                <CustomModal
                    modalIsOpen={modalIsOpenUpdateReview}
                    afterOpenModal={afterOpenModalUpdateReview}
                    closeModal={closeModalUpdateReview}
                    contentLabel="Update review"
                    functionalModalHeader={`Wijzig deze review`}
                >

                    <div className={styles["review__modal"]}>
                        <form className={styles["update-review__form"]} onSubmit={handleSubmit(handleFormSubmit)}>

                            <p className={styles["subheader__input-fields"]}>Niet te wijzigen:</p>

                            <InputField
                                type="number"
                                name="reviewId"
                                label="Review ID"
                                register={register}
                                errors={errors}
                                readOnly={true}
                            >
                            </InputField>
                            <InputField
                                type="text"
                                name="firstNameReviewer"
                                label="Voornaam klant"
                                register={register}
                                errors={errors}
                                readOnly={true}
                            >
                            </InputField>
                            <InputField
                                type="text"
                                name="lastNameReviewer"
                                label="Achternaam klant"
                                register={register}
                                errors={errors}
                                readOnly={true}
                            >
                            </InputField>

                            <p className={styles["subheader__input-fields"]}>Wijzigen:</p>

                            <InputField
                                type="text"
                                step="any"
                                name="rating"
                                label="Rating* "
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
                                name="reviewDescription"
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

                            {highestAuthority === 'admin' &&
                                <>
                                    <div className={styles["review-verified-radio-row"]}>
                                        <label htmlFor="verify">Review goed- of afkeuren
                                            <InputField
                                                classNameInputField="radio-checkbox__verify"
                                                classNameLabel="label__radio-checkbox__verify"
                                                name="verify"
                                                type="radio"
                                                value={true}
                                                validation={{
                                                    required:
                                                        {
                                                            value: true,
                                                            message: "Het is verplicht de review goed of af te keuren. ",
                                                        }
                                                }
                                                }
                                                register={register}
                                                errors={errors}
                                            >
                                                Goedkeuren
                                            </InputField>
                                            <InputField
                                                classNameInputField="radio-checkbox__verify"
                                                classNameLabel="label__radio-checkbox__verify"
                                                name="verify"
                                                type="radio"
                                                value={false}
                                                validation={{
                                                    required:
                                                        {
                                                            value: true,
                                                            message: "Het is verplicht de review goed of af te keuren. ",
                                                        }
                                                }
                                                }
                                                register={register}
                                                errors={errors}
                                            >
                                                Afkeuren
                                            </InputField>
                                        </label>
                                    </div>
                                    <InputField
                                        type="text"
                                        name="feedbackAdmin"
                                        label="Feedback voor reviewer"
                                        register={register}
                                        errors={errors}
                                    >
                                    </InputField>

                                </>
                            }
                            {(highestAuthority === 'customer' && reviewVerified) &&
                                <>
                                    <p>Let op, deze review is goedgekeurd. </p>
                                    <p>Als je de review aanpast, wordt deze offline gehaald en moet de review eerst
                                        goedgekeurd worden door een administrator</p>
                                </>
                            }
                            <Button
                                type="submit"
                            >Review aanpassen</Button>
                        </form>
                    </div>


                </CustomModal>

                {reviewsData && reviewsData.length > 0 ?
                    <h1>{highestAuthority === 'admin' ? "Alle " : "Mijn "}reviews</h1>
                    :
                    <h1>{highestAuthority === 'admin' ? "Er zijn nog geen " : "Je hebt nog geen "}reviews</h1>
                }


                {reviewsData && reviewsData.length > 0 &&
                    <div className={styles["sort"]}>
                        <label className="select-dropdown" htmlFor="select-dropdown-sort">Sorteer op:</label>
                        <Select className={styles["sort__dropdown"]}
                                id="select-dropdown-sort"
                                name="select-dropdown-sort"
                                label="select-dropdown-sort"
                                placeholder="Selecteer.."
                                defaultValue={sortValue}
                                onChange={setSortValue}
                                options={optionsSortValue}
                                isMulti={false}
                        />
                    </div>
                }

                {reviewsData && reviewsData.length > 0 &&
                    <table className="table">
                        <thead>
                            <tr className={"table-header-row"}>
                                <th>Review</th>
                                <th>Naam</th>
                                <th>Omschrijving</th>
                                <th>Rating</th>
                                <th>Workshop titel</th>
                                <th>Workshop eigenaar</th>
                                <th>Datum workshop</th>
                                <th>Goedgekeurd door admin</th>
                                <th>Feedback</th>
                                <th>Wijzigen</th>
                                <th>Verwijderen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewsData && reviewsData.map((review) => {
                                return (<tr key={review.id}>
                                        <td>{review.id}</td>
                                        <td>{review.firstNameReviewer} {review.lastNameReviewer}</td>
                                        <td>{review.reviewDescription}  </td>
                                        <td>{review.rating}</td>
                                        <td>{review.workshopTitle}</td>
                                        <td>{review.companyNameWorkshopOwner}</td>
                                        <td>{updateDateFormatShort(review.workshopDate)}</td>
                                        <td className={review.reviewVerified ? "td-verified" : "td-not-verified"}>
                                            {review.reviewVerified ? (
                                                    "Goedgekeurd"
                                                ) :
                                                highestAuthority === 'admin' ?
                                                    ((review.reviewVerified === false) ?
                                                        (
                                                            <Link
                                                                className={"link-table-text-not-verified"}
                                                                to="#"
                                                                onClick={() => verifyReview(review.id, review.rating, review.reviewDescription, true, review.feedbackAdmin)}
                                                            >
                                                                Afgekeurd (direct goedkeuren)
                                                            </Link>)
                                                        :
                                                        (<Link
                                                                className={"link-table-text"}
                                                                to="#"
                                                                onClick={() => verifyReview(review.id, review.rating, review.reviewDescription, true, review.feedbackAdmin)}
                                                            >
                                                                Direct goedkeuren
                                                            </Link>
                                                        ))
                                                    :
                                                    review.reviewVerified === false ?
                                                        "Afgekeurd"
                                                        :
                                                        "Nog niet goedgekeurd"
                                            }</td>
                                        <td>{review.feedbackAdmin}</td>
                                        <td><Link
                                            aria-label="link__edit-review"
                                            className={"link-icon"}
                                            to="#"
                                            onClick={() => changeReview(review.id, review.firstNameReviewer, review.lastNameReviewer, review.rating, review.reviewDescription, review.reviewVerified, review.feedbackAdmin)}
                                        ><NotePencil
                                            size={20}
                                            weight="regular"/></Link>
                                        </td>
                                        <td><Link
                                            aria-label="link__delete-review"
                                            className={"link-icon"} to="#"
                                            onClick={() => checkDeleteReview(review.id)}
                                        ><TrashSimple
                                            size={20}
                                            weight="regular"/></Link>
                                        </td>

                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>}

            </div>
        </main>
    );
}

export default AllReviews;