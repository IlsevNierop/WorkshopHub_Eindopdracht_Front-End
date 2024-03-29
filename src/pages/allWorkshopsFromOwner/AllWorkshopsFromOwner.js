import React, {useContext, useEffect, useState} from 'react';
import styles from "./AllWorkshopsFromOwner.module.css";
import WorkshopTile from "../../components/WorkshopTile/WorkshopTile";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";
import {AuthContext} from "../../context/AuthContext";
import {
    fetchWorkshopsFromOwner,
    fetchWorkshopsFromOwnerLoggedIn,
} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {Link, useParams} from "react-router-dom";

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
                try {
                    let response;
                    if (user !== null) {
                        response = await fetchWorkshopsFromOwnerLoggedIn(token, workshopOwnerId, user.id);
                    } else {
                        response = await fetchWorkshopsFromOwner(workshopOwnerId);
                    }
                    setWorkshopsFromOwner(response);
                    setworkshopOwnerName(response[0].workshopOwnerCompanyName);
                    setError('');

                } catch (e) {
                    console.error(e);
                    setError(errorHandling(e));
                }
                toggleLoading(false);
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
                    <h1>Alle workshops van {workshopOwnerName}</h1>}

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
                    })}
                </section>

                <Link className={styles["link"]} to="/">Terug naar de homepage</Link>

            </div>
        </main>
    );
}

export default AllWorkshopsFromOwner;