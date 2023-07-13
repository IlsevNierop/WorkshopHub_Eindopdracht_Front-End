import styles from "../workshopPage/WorkshopPage.module.css";

import React, {useContext, useEffect, useState} from 'react';
import {fetchDataWorkshopOwner, fetchSingleWorkshopData, fetchSingleWorkshopDataLoggedIn} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import StarRating from "../../components/StarRating/StarRating";
import {traverseTwoPhase} from "react-dom/test-utils";
import {updateDateFormatLong} from "../../helper/updateDateFormatLong";
import {getInOrOutdoors} from "../../helper/getInOrOutdoors";
import {updateTimeFormat} from "../../helper/updateTimeFormat";
import {Heart} from "@phosphor-icons/react";
import Button from "../../components/Button/Button";
import {createArrayListFromString} from "../../helper/createArrayListFromString";
import WorkshopTile from "../../components/WorkshopTile/WorkshopTile";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";

function WorkshopPage() {

    const {workshopId} = useParams();
    const controller = new AbortController();
    const {user} = useContext(AuthContext);
    const token = localStorage.getItem('token');

    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);
    const [singleWorkshopData, setSingleWorkshopData] = useState({});


    useEffect(() => {
            async function fetchDataSingleWorkshop() {
                toggleLoading(true);
                setError('');
                if (user != null) {
                    try {
                        const response = await fetchSingleWorkshopDataLoggedIn(token, user.id, workshopId);
                        setSingleWorkshopData(response);
                        setError('');

                    } catch (e) {
                        setError(errorHandling(e));
                        console.log(error);
                    }
                    toggleLoading(false);
                } else {
                    try {
                        const response = await fetchSingleWorkshopData(workshopId);
                        setSingleWorkshopData(response);
                        setError('');

                    } catch (e) {
                        setError(errorHandling(e));
                        console.log(error);
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


    return (

        <main className={`outer-container ${styles["workshop-page__outer-container"]}`}>
            <div className={`inner-container ${styles["workshop-page__inner-container"]}`}>
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
                        {/*//TODO foto alt aanpassen variabel*/}
                        <img className={styles["workshop-image"]}
                             src={singleWorkshopData.workshopPicUrl} alt="Foto van de workshop"/>
                        {/*<Button type="text" className="icon-button" onClick={addOrRemoveFavouriteWorkshop}>*/}
                        {/*    <Heart className={styles["favourite-icon"]} size={24}*/}
                        {/*           color={favourite ? "#fe5c5c" : "282828"}*/}
                        {/*           weight={favourite ? "fill" : "light"}/></Button>*/}

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
                                    {/*//TODO component van maken*/}
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
                                <h4>Reviews</h4>
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

                            <div className={styles["info__bottom__workshop"]}>
                                <h5>Belangrijk om te weten</h5>

                                {singleWorkshopData.highlightedInfo &&
                                    <ul>{(singleWorkshopData.highlightedInfo.split(".")).filter(info => info.trim() !== "").map((info) => {
                                        return (
                                            <li className={styles["list-item"]} key={info.slice(0, 3)}>{info}</li>
                                        )
                                    })
                                    }</ul>
                                }

                            </div>


                        </section>
                    </>

                }


            </div>
        </main>

    )
        ;
}

export default WorkshopPage;