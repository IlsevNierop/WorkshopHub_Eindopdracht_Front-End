import React, {useContext, useEffect, useState} from 'react';
import styles from "./AllWorkshopsFromOwner.module.css";
import {Confetti} from "@phosphor-icons/react";
import WorkshopTile from "../../components/WorkshopTile/WorkshopTile";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";
import {AuthContext} from "../../context/AuthContext";
import {
    fetchWorkshopsFromOwner,
    fetchWorkshopsFromOwnerLoggedIn,
} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {useParams} from "react-router-dom";

function AllWorkshopsFromOwner() {
    const token = localStorage.getItem('token');
    const controller = new AbortController();
    const {user} = useContext(AuthContext);
    const {workshopOwnerId} = useParams();


    const [workshopsFromOwner, setWorkshopsFromOwner] = useState([]);
    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);
    const [workshopOwnerName, setworkshopOwnerName] = useState('');

    useEffect(() => {
            async function getWorkshopsFromOwner() {
                toggleLoading(true);
                setError('');

                if (user !== null) {
                    try {
                        const response = await fetchWorkshopsFromOwnerLoggedIn(token, workshopOwnerId, user.id);
                        setWorkshopsFromOwner(response);
                        setworkshopOwnerName(response[0].workshopOwnerCompanyName);

                        if (response) {
                            setError('');
                        }

                    } catch (e) {
                        setError(errorHandling(e));
                        console.log(error);
                    }
                    toggleLoading(false);
                } else {
                    try {
                        const response = await fetchWorkshopsFromOwner(workshopOwnerId);
                        setWorkshopsFromOwner(response);
                        setworkshopOwnerName(response[0].workshopOwnerCompanyName);

                        if (response) {
                            setError('');
                        }

                    } catch (e) {
                        setError(errorHandling(e));
                        console.log(error);
                    }
                    toggleLoading(false);
                }
            }
            void getWorkshopsFromOwner();

            return function cleanup() {
                controller.abort();
            }
        }

        , []);


    return (
        <main className={`outer-container ${styles["all-workshops-owner__outer-container"]}`}>
            <div className={`inner-container ${styles["all-workshops-owner__inner-container"]}`}>


                {workshopsFromOwner &&
                <h1>Alle workshops van {workshopOwnerName}</h1>
                }

                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}

                <section className={styles["overview__workshop-tiles"]}>
                    {workshopsFromOwner.length === 0 &&
                            <h3>Er zijn geen workshops in de toekomst van deze workshop eigenaar.</h3>
                    }
                    {workshopsFromOwner && workshopsFromOwner.map((workshop) => {
                        return (
                            <WorkshopTile
                                key={workshop.id}
                                workshopId={workshop.id}
                                image={workshop.workshopPicUrl}
                                isFavourite={workshop.isFavourite}
                                workshoptitle={workshop.title}
                                price={workshop.price}
                                location={workshop.location}
                                date={updateDateFormatShort(workshop.date)}
                                category1={workshop.workshopCategory1}
                                category2={workshop.workshopCategory2}
                                link={`/workshop/${workshop.id}`}
                            ></WorkshopTile>
                        )
                    })
                    }
                </section>

            </div>
        </main>
    );
}

export default AllWorkshopsFromOwner;