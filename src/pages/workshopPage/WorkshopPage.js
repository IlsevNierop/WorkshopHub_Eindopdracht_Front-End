import styles from "../workshopPage/WorkshopPage.module.css";

import React, {useContext, useEffect, useState} from 'react';
import {
    addOrRemoveWorkshopFavourites,
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
import SignIn from "../../components/SignIn/SignIn";
import {Heart} from "@phosphor-icons/react";
import CustomModal from "../../components/CustomModal/CustomModal";
import {ModalSignInContext} from "../../context/ModalSigninContext";

function WorkshopPage() {

    const {workshopId} = useParams();

    const {user} = useContext(AuthContext);
    const {setModalIsOpenSignIn} = useContext(ModalSignInContext);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const controller = new AbortController();

    const [favourite, setFavourite] = useState(null);
    const [error, setError] = useState('');
    const [updateMessage, setupdateMessage] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const [singleWorkshopData, setSingleWorkshopData] = useState({});
    const [workshopOffline, setWorkshopOffline] = useState(false);

    const [modalIsOpenUpdateMessage, setIsOpenUpdateMessage] = useState(false);
    const [modalIsOpenError, setIsOpenError] = useState(false);
    const [modalIsOpenCheck, setIsOpenCheck] = useState(false);


    useEffect(() => {
            async function fetchDataSingleWorkshop() {
                toggleLoading(true);
                setError('');
                if (user && user.highestAuthority === 'admin') {
                    try {
                        const response = await fetchSingleWorkshopDataAdmin(token, workshopId);
                        setSingleWorkshopData(response);
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
                } else if (user && user.highestAuthority === 'workshopowner') {
                    try {
                        const response = await fetchSingleWorkshopDataByOwner(token, workshopId, user.id);
                        setSingleWorkshopData(response);
                        console.log("owner response")
                        console.log(response)
                        setFavourite(singleWorkshopData.isFavourite);
                        setError('');

                    } catch (e) {
                        setError(errorHandling(e));
                        console.log(error);
                        // this is for when a workshopowner wants to see someone else's workshop
                        await getDataSingleWorkshopDataLoggedIn(token, user.id);
                    }
                    toggleLoading(false);
                } else if (user) {
                    await getDataSingleWorkshopDataLoggedIn(token, user.id);
                } else {
                    try {
                        const response = await fetchSingleWorkshopData(workshopId);
                        setSingleWorkshopData(response);
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
            }

            void fetchDataSingleWorkshop();
            console.log(singleWorkshopData);


            return function cleanup() {
                controller.abort();
            }
        }

        , []);

    useEffect(() => {
        setFavourite(singleWorkshopData.isFavourite);
    }, [singleWorkshopData.isFavourite]);

    async function getDataSingleWorkshopDataLoggedIn() {
        try {
            const response = await fetchSingleWorkshopDataLoggedIn(token, user.id, workshopId);
            setSingleWorkshopData(response);
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
            openModalLogin();
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
                openModalUpdateMessage();
                setTimeout(() => {
                    closeModalUpdateMessage();
                }, 3000);
                console.log(e);
            }
        }
    }

    async function publishWorkshop(publishWorkshop) {
        setError('');
        try {
            await verifyWorkshopByOwner(token, user.id, workshopId, publishWorkshop);
            setupdateMessage(true);
            openModalUpdateMessage();
            setTimeout(() => {
                closeModalUpdateMessage();
                navigate("/mijnworkshops");
            }, 3000);

        } catch (e) {
            setError(errorHandling(e));
            openModalUpdateMessage();
            setTimeout(() => {
                closeModalUpdateMessage();
            }, 3000);
            console.log(e);
        }
    }

    function openModalLogin() {
        setModalIsOpenSignIn(true);
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

    function openModalError() {
        setIsOpenError(true);
    }

    function afterOpenModalError() {
    }

    function closeModalError() {
        setIsOpenError(false);
        setError('');
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
                        updateHeader={`De workshop is ${user.highestAuthority === 'admin' ? "goedgekeurd" : "gepubliceerd"}`}
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
                    </CustomModal>
                }

                <CustomModal
                    modalIsOpen={modalIsOpenCheck}
                    afterOpenModal={afterOpenModalCheck}
                    closeModal={closeModalCheck}
                    contentLabel="Check"
                    functionalModalHeader="Weet je het zeker?"


                >
                    <div className={styles["content__modal-check__workshoppage"]}>
                        <p>Deze workshop is gepubliceerd en staat online.</p>
                        {workshopOffline ?
                            <>
                                <p>Weet je zeker dat je deze offline wil halen?</p>
                            </>
                            :
                            <p>Als je de workshop wijzigt, wordt deze offline gehaald en moet die eerst geverifieerd
                                worden
                                door een administrator voordat de workshop weer gepubliceerd kan worden.</p>
                        }
                        <div className={styles["bottom-row__modal-check"]}>
                            {workshopOffline ?
                                <Button type="text"
                                        onClick={() => publishWorkshop(false)}
                                >
                                    Haal offline</Button>
                                :
                                <Button type="text"
                                        onClick={() => navigate(`/aanpassenworkshop/${workshopId}`)}>Workshop
                                    wijzigen</Button>
                            }
                            <Button type="text"
                                    onClick={closeModalCheck}>Terug</Button>
                        </div>
                    </div>
                </CustomModal>

                <SignIn></SignIn>


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
                                }

                                )
                            </p>
                        </div>
                        <div className={styles["image__wrapper"]}>
                            <img className={styles["workshop-image"]}
                                 src={singleWorkshopData.workshopPicUrl}
                                 alt={`Foto van de workshop ${singleWorkshopData.title}`}/>
                            <Link to="#" onClick={addOrRemoveFavouriteWorkshop}>
                                <Heart className={styles["favourite-icon"]} size={24}
                                       color={favourite ? "#fe5c5c" : "282828"}
                                       weight={favourite ? "fill" : "light"}/></Link>
                        </div>

                    </aside>
                    {Object.keys(singleWorkshopData).length > 0 &&
                        <aside className={styles["right-side__top__workshop"]}>
                            <section className={styles["top__column__workshop-info"]}>

                                <h3 className={styles["companyname__workshop-info"]}>{singleWorkshopData.workshopOwnerCompanyName}</h3>
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

                            <section className={styles["bottom__column__workshop-info"]}>
                                {/*TODO on submit button boeken*/}
                                <Button type="text">
                                    Boeken
                                </Button>
                                <p>{singleWorkshopData.spotsAvailable} plekken beschikbaar</p>

                                <div className={styles["category-workshop-row"]}>
                                    <p>{singleWorkshopData.workshopCategory1}</p>
                                    {singleWorkshopData.workshopCategory2 &&
                                        <p>{singleWorkshopData.workshopCategory2}</p>}
                                </div>
                            </section>
                        </aside>
                    }
                </article>

                {
                    Object.keys(singleWorkshopData).length > 0 &&
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
                                            <p>
                                                {singleWorkshopData.averageRatingWorkshopOwnerReviews.toFixed(1)} / 5 (
                                                {singleWorkshopData.numberOfReviews === 1
                                                    ? `${singleWorkshopData.numberOfReviews} review`
                                                    : `${singleWorkshopData.numberOfReviews} reviews`}
                                                )
                                            </p>
                                        </div>

                                        <section className={styles["container__reviews"]}>

                                            {singleWorkshopData.workshopOwnerReviews.map((review) => {
                                                return (
                                                    <article className={styles["container__individual-review"]}
                                                             key={review.id}>
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
                                            })
                                            }
                                        </section>
                                    </>
                                    :
                                    <>
                                        <div className={styles["zero-review"]}>
                                            <p>Er zijn nog geen reviews</p>
                                            {/*    TODO button toevoegen om review achter te laten? */}
                                        </div>
                                    </>
                                }
                            </article>

                            {singleWorkshopData.highlightedInfo &&
                                <div className={styles["info__bottom__workshop"]}>
                                    <h5>Belangrijk om te weten</h5>


                                    <ul>{(singleWorkshopData.highlightedInfo.split(".")).filter(info => info.trim() !== "").map((info) => {
                                        return (
                                            <li className={styles["list-item"]} key={info.slice(0, 3)}>{info}</li>
                                        )
                                    })
                                    }</ul>

                                </div>
                            }
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
                                        </>
                                    }

                                </>
                            }
                            {(user != null && user.highestAuthority === 'workshopowner' && user.id === singleWorkshopData.workshopOwnerId) &&
                                <article className={styles["extra-bottom__workshopowner"]}>
                                    {(singleWorkshopData.workshopVerified !== null && singleWorkshopData.publishWorkshop !== true && singleWorkshopData.feedbackAdmin) &&
                                        <div className={styles["bottom__workshopowner__feedback-admin"]}>
                                            <h5>Feedback administrator</h5>
                                            <p>{singleWorkshopData.feedbackAdmin}</p>
                                        </div>
                                    }
                                    {(singleWorkshopData.workshopVerified === true && singleWorkshopData.publishWorkshop !== true) &&
                                        <>
                                            <Button type="text"
                                                    onClick={() => publishWorkshop(true)}
                                            >
                                                Direct publiceren</Button>
                                        </>
                                    }
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
                                            wijzigen</Button>
                                    }


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