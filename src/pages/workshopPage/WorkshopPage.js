import styles from "../workshopPage/WorkshopPage.module.css";

import React, {useContext, useEffect, useState} from 'react';
import {
    addOrRemoveWorkshopFavourites, createBooking,
    fetchSingleWorkshopData, fetchSingleWorkshopDataAdmin, fetchSingleWorkshopDataByOwner,
    fetchSingleWorkshopDataLoggedIn, updateAndVerifyWorkshopByAdmin, verifyWorkshopByOwner
} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {Link, useNavigate, useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import StarRating from "../../components/StarRating/StarRating";
import {updateDateFormatLong} from "../../helper/updateDateFormatLong";
import {getInOrOutdoors} from "../../helper/getInOrOutdoors";
import {updateTimeFormat} from "../../helper/updateTimeFormat";
import Button from "../../components/Button/Button";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";
import {Heart} from "@phosphor-icons/react";
import CustomModal from "../../components/CustomModal/CustomModal";
import {ModalSignInContext} from "../../context/ModalSigninContext";
import defaultpic from "../../../../workshophub-eindopdracht/src/assets/temppicsworkshop/defaultpic.webp";
import InputField from "../../components/InputField/InputField";
import {useForm} from "react-hook-form";


function WorkshopPage() {

    const {workshopId} = useParams();

    const {user} = useContext(AuthContext);
    const {setModalIsOpenSignIn, setSignInSubHeader} = useContext(ModalSignInContext);
    const {register, handleSubmit, formState: {errors}, reset} = useForm({mode: 'onBlur'});


    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const controller = new AbortController();

    const [favourite, setFavourite] = useState(null);
    const [error, setError] = useState('');
    const [updateMessage, setupdateMessage] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const [singleWorkshopData, setSingleWorkshopData] = useState({});
    const [workshopOffline, setWorkshopOffline] = useState(false);
    const [totalPriceBooking, setTotalPriceBooking] = useState(false);
    const [reviewsToShow, setReviewsToShow] = useState([]);
    // const [displayedReviewCount, setDisplayedReviewCount] = useState(3);

    const [modalIsOpenUpdateMessage, setIsOpenUpdateMessage] = useState(false);
    const [modalIsOpenError, setIsOpenError] = useState(false);
    const [modalIsOpenCheck, setIsOpenCheck] = useState(false);
    const [modalIsOpenBooking, setIsOpenBooking] = useState(false);
    const [modalIsOpenBookingSuccessful, setIsOpenBookingSuccessful] = useState(false);


    useEffect(() => {
        async function fetchDataSingleWorkshop() {
            toggleLoading(true);
            setError('');
            if (user && (user.highestAuthority === 'admin' || user.highestAuthority === 'workshopowner')) {
                try {
                    let response;
                    if (user && user.highestAuthority === 'admin') {
                        response = await fetchSingleWorkshopDataAdmin(token, workshopId);
                    } else if (user && user.highestAuthority === 'workshopowner') {
                        response = await fetchSingleWorkshopDataByOwner(token, workshopId, user.id);
                    }
                    console.log(response)
                    setSingleWorkshopData(response);
                    setReviewsToShow(response.workshopOwnerReviews.slice(0, 3));
                    setFavourite(singleWorkshopData.isFavourite);
                    setError('');
                } catch (e) {
                    setError(errorHandling(e));
                    if (user && user.highestAuthority === 'workshopowner') {
                        // this is for when a workshopowner wants to see someone else's workshop. Because upfront it's unclear if the workshopowner is the owner of the workshop, first I try to get the data as if he/she is the owner, in case of an error, he/she is clearly not the owner, and data is being fetched as if the workshopowner is a 'normal' viewer.
                        await getDataSingleWorkshopDataLoggedIn(token, user.id);
                    }
                    if (user && user.highestAuthority === 'admin') {
                        openModalError();
                        setTimeout(() => {
                            closeModalError();
                            navigate("/");
                        }, 3000);
                        console.log(e)
                    }
                }
                toggleLoading(false);
            } else {
                console.log("test")
                try {
                    let response;
                    if (user) {
                        console.log("user")
                        await getDataSingleWorkshopDataLoggedIn(token, user.id);
                    } else {
                        response = await fetchSingleWorkshopData(workshopId);
                        console.log(response)
                        setSingleWorkshopData(response);
                        setReviewsToShow(response.workshopOwnerReviews.slice(0, 3));
                        setFavourite(singleWorkshopData.isFavourite);
                        setError('');
                    }
                } catch
                    (e) {
                    setError(errorHandling(e));
                    openModalError();
                    setTimeout(() => {
                        closeModalError();
                        navigate("/");
                    }, 3000);
                    console.log(e)
                }
                toggleLoading(false);
            }
        }

        void fetchDataSingleWorkshop();

        return function cleanup() {
            controller.abort();
        }
    }, []);

    useEffect(() => {
        setFavourite(singleWorkshopData.isFavourite);
    }, [singleWorkshopData.isFavourite]);

    async function getDataSingleWorkshopDataLoggedIn() {
        try {
            const response = await fetchSingleWorkshopDataLoggedIn(token, user.id, workshopId);
            console.log(response);
            setSingleWorkshopData(response);
            setReviewsToShow(response.workshopOwnerReviews.slice(0, 3));
            setFavourite(singleWorkshopData.isFavourite);
            setError('');

        } catch (e) {
            setError(errorHandling(e));
            openModalError();
            setTimeout(() => {
                closeModalError();
                navigate("/");
            }, 3000);
            console.log(e)
        }
        toggleLoading(false);
    }


    async function addOrRemoveFavouriteWorkshop() {
        setError('');
        if (user == null) {
            signInWithSubHeader("Om deze workshop aan je favorieten toe te voegen, dien je eerst in te loggen");
        }
        if (user != null) {
            try {
                await addOrRemoveWorkshopFavourites(token, user.id, workshopId, favourite);
                setFavourite(!favourite);

            } catch (e) {
                setError(errorHandling(e));
                openModalError();
                setTimeout(() => {
                    closeModalError();
                }, 3000);
                console.log(e);
            }
        }
    }

    async function verifyWorkshop() {
        setError('');
        if (user != null && user.highestAuthority === 'admin') {
            try {
                await updateAndVerifyWorkshopByAdmin(workshopId, token, singleWorkshopData.title, singleWorkshopData.date, singleWorkshopData.startTime, singleWorkshopData.endTime, singleWorkshopData.price, singleWorkshopData.location, singleWorkshopData.workshopCategory1, singleWorkshopData.workshopCategory2, singleWorkshopData.inOrOutdoors, singleWorkshopData.amountOfParticipants, singleWorkshopData.highlightedInfo, singleWorkshopData.description, true);
                setupdateMessage(true)
                openModalUpdateMessage();
                setTimeout(() => {
                    closeModalUpdateMessage();
                    navigate("/goedkeurenworkshops");
                }, 3000);

            } catch (e) {
                setError(errorHandling(e));
                openModalError();
                setTimeout(() => {
                    closeModalError();
                }, 3000);
                console.log(e);
            }
        }
    }

    async function publishWorkshop(publishWorkshop) {
        setError('');
        try {
            await verifyWorkshopByOwner(token, workshopId, publishWorkshop);
            setupdateMessage(true);
            openModalUpdateMessage();
            setTimeout(() => {
                closeModalUpdateMessage();
                navigate("/workshops");
            }, 3000);

        } catch (e) {
            setError(errorHandling(e));
            openModalError();
            setTimeout(() => {
                closeModalError();
            }, 3000);
            console.log(e);
        }
    }

    const validateSpotsAvailable = (value) => {
        if (singleWorkshopData.spotsAvailable < value) {
            return `Er zijn maar ${singleWorkshopData.spotsAvailable} plekken beschikbaar, en je probeert ${value} plekken te boeken`;
        }
        else if (value <= 0) {
            return `Je moet minstens 1 plek boeken.`;
        }
        return true;
    };

    async function handleFormSubmit(data) {
        try {
            const response = await createBooking(token, data.amount, data.comments, user.id, workshopId);
            console.log(response);
            setTotalPriceBooking(response.totalPrice);
            closeModalBooking();
            openModalBookingSuccessful();
            setTimeout(() => {
                closeModalBookingSuccessful();
                navigate("/boekingen")
            }, 4000);

        } catch (e) {
            setError(errorHandling(e));
            openModalError();
            setTimeout(() => {
                closeModalError();
            }, 3000);
        }
    }

    function onClikHandlerBooking() {
        if (user == null) {
            signInWithSubHeader("Om deze workshop te boeken, dien je eerst in te loggen");
        }
        if (user != null) {
            openModalBooking();
        }
    }

    const handleShowAllReviews = () => {
        // setDisplayedReviewCount(singleWorkshopData.workshopOwnerReviews.length);
        setReviewsToShow(singleWorkshopData.workshopOwnerReviews);
    };


    function signInWithSubHeader(subheader) {
        setModalIsOpenSignIn(true);
        setSignInSubHeader(subheader);
    }

    function takeWorkshopOffline() {
        setWorkshopOffline(true);
        openModalCheck();
    }

    function openModalCheck() {
        setIsOpenCheck(true);
    }

    function afterOpenModalCheck() {
    }

    function closeModalCheck() {
        setIsOpenCheck(false);
        setWorkshopOffline(false);
    }

    function openModalUpdateMessage() {
        setIsOpenUpdateMessage(true);
    }

    function afterOpenModalUpdateMessage() {
    }

    function closeModalUpdateMessage() {
        setIsOpenUpdateMessage(false);
        setupdateMessage(false);
    }

    function openModalBookingSuccessful() {
        setIsOpenBookingSuccessful(true);
    }

    function afterOpenModalBookingSuccessful() {
    }

    function closeModalBookingSuccessful() {
        setIsOpenBookingSuccessful(false);
    }

    function openModalError() {
        setIsOpenError(true);
    }

    function afterOpenModalError() {
    }

    function closeModalError() {
        setIsOpenError(false);
        setError('');
    }

    function openModalBooking() {
        setIsOpenBooking(true);
    }

    function afterOpenModalBooking() {
    }

    function closeModalBooking() {
        setIsOpenBooking(false);
        reset();
    }

    return (

        <main className={`outer-container ${styles["workshop-page__outer-container"]}`}>
            <div className={`inner-container ${styles["workshop-page__inner-container"]}`}>

                {(updateMessage && user != null) &&
                    <CustomModal
                        modalIsOpen={modalIsOpenUpdateMessage}
                        afterOpenModal={afterOpenModalUpdateMessage}
                        closeModal={closeModalUpdateMessage}
                        contentLabel="Verify workshop sucessful"
                        updateHeader={`De workshop is ${
                            workshopOffline
                                ? 'offline gehaald'
                                : user.highestAuthority === 'admin'
                                    ? 'goedgekeurd'
                                    : 'gepubliceerd'
                        }`}
                        updateMessage={`Je wordt doorgestuurd naar het overzicht van ${user.highestAuthority === 'admin' ? "goed te keuren" : "jouw"} workshops`}
                    >
                    </CustomModal>
                }

                {error &&
                    <CustomModal
                        modalIsOpen={modalIsOpenError}
                        afterOpenModal={afterOpenModalError}
                        closeModal={closeModalError}
                        contentLabel="Error"
                        errorMessage={error}
                    >
                    </CustomModal>}

                <CustomModal
                    modalIsOpen={modalIsOpenCheck}
                    afterOpenModal={afterOpenModalCheck}
                    closeModal={closeModalCheck}
                    contentLabel="Check edit verified workshop"
                    checkModalHeader="Weet je het zeker?"
                    buttonHeaderCheckModalYes={workshopOffline ? "Haal offline" : "Workshop wijzigen"}
                    onclickHandlerCheckModalYes={workshopOffline ?
                        () => publishWorkshop(false) :
                        () => navigate(`/aanpassenworkshop/${workshopId}`)}
                    onclickHandlerCheckModalBack={closeModalCheck}
                    checkMessage={`Deze workshop is gepubliceerd en staat online. ${
                        workshopOffline
                            ? "Weet je zeker dat je deze offline wil halen?"
                            : "Als je de workshop wijzigt, wordt deze offline gehaald en moet die eerst geverifieerd worden door een administrator voordat de workshop weer gepubliceerd kan worden."}`}
                >
                </CustomModal>

                <CustomModal
                    modalIsOpen={modalIsOpenBooking}
                    afterOpenModal={afterOpenModalBooking}
                    closeModal={closeModalBooking}
                    contentLabel="Booking workshop"
                    functionalModalHeader={`Boek de workshop: ${singleWorkshopData.title}`}
                >
                    <div className={styles["booking__modal"]}>
                        <h4>Op {updateDateFormatLong(singleWorkshopData.date)}</h4>
                        <form className={styles["create-booking__form"]} onSubmit={handleSubmit(handleFormSubmit)}>

                            <InputField
                                type="number"
                                name="amount"
                                label="Aantal plekken* "
                                validation={{
                                    required:
                                        {
                                            value: true,
                                            message: "Aantal plekken is verplicht",
                                        },
                                    validate: validateSpotsAvailable
                                }
                                }
                                register={register}
                                errors={errors}
                            >
                            </InputField>
                            <InputField
                                type="text"
                                name="comments"
                                label="Opmerkingen"
                                register={register}
                                errors={errors}
                            >
                            </InputField>

                            <Button
                                type="submit"
                            >Boeking plaatsen</Button>

                        </form>
                    </div>
                </CustomModal>

                <CustomModal
                    modalIsOpen={modalIsOpenBookingSuccessful}
                    afterOpenModal={afterOpenModalBookingSuccessful}
                    closeModal={closeModalBookingSuccessful}
                    contentLabel="Booking workshop sucessful"
                    updateHeader="De workshop is geboekt"
                    updateMessage={`De totale prijs is ${totalPriceBooking} euro. - Je wordt doorgestuurd naar het overzicht van jouw boekingen.`}
                >
                </CustomModal>

                {loading && <p>Loading...</p>}
                <h1>{singleWorkshopData.title}</h1>

                <article className={styles["top-part__workshop-page"]}>

                    <aside className={styles["left-side__top__workshop"]}>

                        <div className={styles["workshop-owner-rating"]}>
                            <StarRating rating={singleWorkshopData.averageRatingWorkshopOwnerReviews}
                                        size={20}></StarRating>
                            <p>
                                {singleWorkshopData.averageRatingWorkshopOwnerReviews != null ? singleWorkshopData.averageRatingWorkshopOwnerReviews.toFixed(1) : 0} /
                                5 (
                                {singleWorkshopData.numberOfReviews === 1
                                    ? `${singleWorkshopData.numberOfReviews} review`
                                    : `${singleWorkshopData.numberOfReviews != null ? singleWorkshopData.numberOfReviews : "nog geen"} reviews`
                                })
                            </p>
                        </div>
                        <div className={styles["image__wrapper"]}>
                            <img className={styles["workshop-image"]}
                                 src={singleWorkshopData.workshopPicUrl ? singleWorkshopData.workshopPicUrl : defaultpic}
                                 alt={`Foto van de workshop ${singleWorkshopData.title}`}/>
                            <Link
                                aria-label="link__add-remove-favourite-workshop"
                                to="#" onClick={addOrRemoveFavouriteWorkshop}>
                                <Heart className={styles["favourite-icon"]} size={24}
                                       color={favourite ? "#fe5c5c" : "282828"}
                                       weight={favourite ? "fill" : "light"}/></Link>
                        </div>

                    </aside>
                    {Object.keys(singleWorkshopData).length > 0 &&
                        <aside className={styles["right-side__top__workshop"]}>
                            <section className={styles["top__column__workshop-info"]}>

                                <Link
                                    aria-label="link__all-workshops-from-workshop-owner-page"
                                    className={styles["link__companyname__workshop-info"]}
                                    to={`/alleworkshopseigenaar/${singleWorkshopData.workshopOwnerId}`}>
                                    <h3 className={styles["companyname__workshop-info"]}>{singleWorkshopData.workshopOwnerCompanyName}</h3>
                                </Link>
                                <h5 className={styles["workshop-info"]}>€ {singleWorkshopData.price.toFixed(2).replace('.', ',')}
                                </h5>
                                <h5 className={styles["workshop-info"]}> {updateDateFormatLong(singleWorkshopData.date)} </h5>
                                <h5 className={styles["workshop-info"]}>
                                    {updateTimeFormat(singleWorkshopData.startTime)} - {updateTimeFormat(singleWorkshopData.endTime)}
                                </h5>
                                <h5 className={styles["workshop-info"]}> {singleWorkshopData.location} </h5>
                                <h5 className={styles["workshop-info"]}> {getInOrOutdoors(singleWorkshopData.inOrOutdoors)} </h5>
                                <h5 className={styles["workshop-info"]}> max. {singleWorkshopData.amountOfParticipants} deelnemers </h5>
                            </section>

                            <section>
                                <Button type="text" onClick={onClikHandlerBooking}
                                        disabled={(singleWorkshopData.spotsAvailable === 0) && true}>
                                    Boeken
                                </Button>
                                {(singleWorkshopData.spotsAvailable === 0) ?
                                    <p className={styles["sold-out__sentence"]}>Uitverkocht</p>
                                    :
                                    <p className={styles["available-spots__sentence"]}>{singleWorkshopData.spotsAvailable} plekken
                                        beschikbaar</p>
                                }

                                <div className={styles["category-workshop-row"]}>
                                    <p>{singleWorkshopData.workshopCategory1}</p>
                                    {singleWorkshopData.workshopCategory2 &&
                                        <p>{singleWorkshopData.workshopCategory2}</p>}
                                </div>
                            </section>
                        </aside>
                    }
                </article>

                {Object.keys(singleWorkshopData).length > 0 &&
                    <>
                        <article className={styles["description__middle-part__workshop"]}>
                            <h4>Omschrijving van de workshop</h4>
                            <p>{singleWorkshopData.description}</p>
                        </article>

                        <section className={styles["bottom-part__workshop"]}>

                            <article className={styles["reviews__bottom__workshop"]}>
                                <h4>Reviews over deze aanbieder</h4>
                                {singleWorkshopData.workshopOwnerReviews.length > 0 ?
                                    <>
                                        <div className={styles["workshop-owner-rating"]}>
                                            <StarRating rating={singleWorkshopData.averageRatingWorkshopOwnerReviews}
                                                        size={26}></StarRating>
                                            <p className={styles["rating__numbers__workshopowner"]}>
                                                {singleWorkshopData.averageRatingWorkshopOwnerReviews.toFixed(1)} / 5 (
                                                {singleWorkshopData.numberOfReviews === 1
                                                    ? `${singleWorkshopData.numberOfReviews} review`
                                                    : `${singleWorkshopData.numberOfReviews} reviews`})
                                            </p>
                                        </div>

                                        <section className={styles["container__reviews"]}>

                                            {/*{singleWorkshopData.workshopOwnerReviews.map((review) => {*/}
                                            {reviewsToShow.map((review) => {
                                                return (
                                                    <article className={styles["container__individual-review"]}
                                                             key={`review-${review.id}`}>
                                                        <div className={styles["top-row__review"]}>
                                                            <StarRating rating={review.rating} size={14}></StarRating>
                                                            <p>{review.rating.toFixed(1)} / 5</p>
                                                            <h5 className={styles["name-reviewer"]}>| {review.firstNameReviewer}</h5>
                                                        </div>
                                                        <p className={styles["date-review"]}>Datum
                                                            workshop: {updateDateFormatShort(review.workshopDate)}</p>
                                                        <h5>Workshop: {review.workshopTitle}</h5>
                                                        <p>{review.reviewDescription}</p>
                                                    </article>
                                                )
                                            })}
                                            {reviewsToShow.length < singleWorkshopData.workshopOwnerReviews.length && (
                                                <Button type="text" onClick={handleShowAllReviews}>Toon alle reviews</Button>
                                            )}
                                        </section>
                                    </>
                                    :
                                    <>
                                        <div className={styles["zero-review"]}>
                                            <p>Er zijn nog geen reviews</p>
                                        </div>
                                    </>
                                }
                            </article>

                            {singleWorkshopData.highlightedInfo &&
                                <div className={styles["info__bottom__workshop"]}>
                                    <h4>Belangrijk om te weten</h4>
                                    <ul>{(singleWorkshopData.highlightedInfo.split(".")).filter(info => info.trim() !== "").map((info) => {
                                        return (
                                            <li className={styles["list-item"]} key={info.slice(0, 3)}>{info}</li>
                                        )
                                    })
                                    }</ul>
                                </div>}
                        </section>

                        <section className={styles["extra-bottom__workshop__owner__admin"]}>

                            {user != null && user.highestAuthority === 'admin' &&
                                <>
                                    {singleWorkshopData.workshopVerified === true ?
                                        <Button type="text"
                                                onClick={() => navigate(`/aanpassenworkshop/${workshopId}`)}>Workshop
                                            wijzigen</Button>
                                        :
                                        <>
                                            <Button type="text" onClick={verifyWorkshop}>Direct goedkeuren</Button>
                                            <Button type="text"
                                                    onClick={() => navigate(`/aanpassenworkshop/${workshopId}`)}>Aanpassen
                                                en goed/afkeuren</Button>
                                        </>}
                                </>}
                            {(user != null && user.highestAuthority === 'workshopowner' && user.id === singleWorkshopData.workshopOwnerId) &&
                                <article className={styles["extra-bottom__workshopowner"]}>
                                    {(singleWorkshopData.workshopVerified !== null && singleWorkshopData.publishWorkshop !== true && singleWorkshopData.feedbackAdmin) &&
                                        <div className={styles["bottom__workshopowner__feedback-admin"]}>
                                            <h5>Feedback administrator</h5>
                                            <p>{singleWorkshopData.feedbackAdmin}</p>
                                        </div>
                                    }
                                    <div className={styles["row__buttons__bottom"]}>
                                        {(singleWorkshopData.workshopVerified === true && singleWorkshopData.publishWorkshop !== true) &&
                                            <>
                                                <Button type="text"
                                                        onClick={() => publishWorkshop(true)}
                                                >
                                                    Direct publiceren</Button>
                                            </>}
                                        {singleWorkshopData.publishWorkshop === true ?
                                            <>
                                                <Button type="text"
                                                        onClick={openModalCheck}>Workshop
                                                    wijzigen</Button>
                                                <Button type="text"
                                                        onClick={takeWorkshopOffline}>Haal workshop offline</Button>
                                            </>
                                            :
                                            <Button type="text"
                                                    onClick={() => navigate(`/aanpassenworkshop/${workshopId}`)}>Workshop
                                                wijzigen</Button>}
                                    </div>
                                </article>
                            }
                        </section>
                    </>
                }

                <Link className={styles["link"]} to="/">Terug naar de homepage</Link>
            </div>
        </main>

    )
        ;
}

export default WorkshopPage;