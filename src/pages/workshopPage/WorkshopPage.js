import styles from "../workshopPage/WorkshopPage.module.css";

import React, {useContext, useEffect, useState} from 'react';
import {fetchDataWorkshopOwner, fetchSingleWorkshopData} from "../../api/api";
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
                    // try {
                    //     const response = await fetchWorkshopDataLoggedIn(token, user.id);
                    //     setWorkshopData(response);
                    //     setOriginalWorkshopData(response);
                    //
                    //     if (response) {
                    //         setError('');
                    //     }
                    //
                    // } catch (e) {
                    //     setError(errorHandling(e));
                    //     console.log(error);
                    // }
                    // toggleLoading(false);
                } else {
                    try {
                        const response = await fetchSingleWorkshopData(workshopId);
                        // const {
                        //     amountOfFavsAndBookings,
                        //     amountOfParticipants,
                        //     averageRatingWorkshopOwnerReviews,
                        //     date,
                        //     description,
                        //     endTime,
                        //     highlightedInfo,
                        //     inOrOutdoors,
                        //     isFavourite,
                        //     location,
                        //     numberOfReviews,
                        //     price,
                        //     spotsAvailable,
                        //     startTime,
                        //     title,
                        //     workshopCategory1,
                        //     workshopCategory2,
                        //     workshopOwnerCompanyName,
                        //     workshopOwnerReviews,
                        //     workshopPicUrl,
                        //
                        //
                        // } = await fetchSingleWorkshopData(workshopId);

                        // setSingleWorkshopData({
                        //     popularityScore: amountOfFavsAndBookings,
                        //     maxParticipants: amountOfParticipants,
                        //     averageRating: averageRatingWorkshopOwnerReviews,
                        //     date: date,
                        //     description: description,
                        //     endTime: endTime,
                        //     highlightedInfo: highlightedInfo,
                        //     inOrOutdoors: inOrOutdoors,
                        //     isFavourite: isFavourite,
                        //     location: location,
                        //     numberOfReviews: numberOfReviews,
                        //     price: price,
                        //     spotsAvailable: spotsAvailable,
                        //     startTime: startTime,
                        //     title: title,
                        //     workshopCategory1: workshopCategory1,
                        //     workshopCategory2: workshopCategory2,
                        //     companyName: workshopOwnerCompanyName,
                        //     reviews: workshopOwnerReviews,
                        //     workshopPicUrl: workshopPicUrl,
                        // });

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
            <div className={`inner-container ${styles["workshop-page-container"]}`}>
                <h1>{singleWorkshopData.title}</h1>

                <section className={styles["top-part__workshop-page__overview"]}>


                    <div className={styles["left-side__top__workshop"]}>

                        <div className={styles["workshop-owner-rating"]}>
                            <StarRating rating={singleWorkshopData.averageRatingWorkshopOwnerReviews}></StarRating>
                            <p>
                                {singleWorkshopData.averageRatingWorkshopOwnerReviews} / 5 (
                                {singleWorkshopData.numberOfReviews === 1
                                    ? `${singleWorkshopData.numberOfReviews} review`
                                    : `${singleWorkshopData.numberOfReviews} reviews`}
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

                    </div>
                    {Object.keys(singleWorkshopData).length > 0 &&
                        <div className={styles["right-side__top__workshop"]}>
                            <div className={styles["top__column__workshop-info"]}>

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
                            </div>

                            <div className={styles["bottom__column__workshop-info"]}>
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
                            </div>
                        </div>
                    }
                </section>

                {Object.keys(singleWorkshopData).length > 0 &&
                    <section className={styles["bottom-part__workshop-page__overview"]}>
                        <div className={styles["left-side__bottom__workshop"]}>
                            <h4>{singleWorkshopData.title}</h4>
                            <p>{singleWorkshopData.description}</p>
                        </div>

                        <div className={styles["right-side__bottom__workshop"]}>
                            <h5>Belangrijk om te weten</h5>

                            {singleWorkshopData.highlightedInfo &&
                                <ul>{(singleWorkshopData.highlightedInfo.split(".")).map((info) => {
                                    return (
                                        <li key={info.slice(0,3)}>{info}</li>
                                    )
                                })
                                }</ul>
                            }

                        </div>


                    </section>

                }


            </div>
        </main>

    )
        ;
}

export default WorkshopPage;