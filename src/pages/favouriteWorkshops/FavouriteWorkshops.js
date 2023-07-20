import React, {useContext, useEffect, useState} from 'react';
import styles from "./FavouriteWorkshops.module.css";
import {Confetti} from "@phosphor-icons/react";
import WorkshopTile from "../../components/WorkshopTile/WorkshopTile";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";
import {errorHandling} from "../../helper/errorHandling";
import {AuthContext} from "../../context/AuthContext";
import {fetchFavouriteWorkshops} from "../../api/api";

function FavouriteWorkshops() {

    const token = localStorage.getItem('token');
    const {user: {id}} = useContext(AuthContext);
    const controller = new AbortController();


    const [favouriteWorkshops, setFavouriteWorkshops] = useState([]);
    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);

    useEffect(() => {
            async function getFavouriteWorkshops() {
                toggleLoading(true);
                setError('');
                try {
                    const response = await fetchFavouriteWorkshops(token, id);
                    setFavouriteWorkshops(response);

                    favouriteWorkshops.sort((a, b) => new Date(a.date) - new Date(b.date));

                    if (response) {
                        setError('');
                    }

                } catch (e) {
                    setError(errorHandling(e));
                    console.log(error);
                }
                toggleLoading(false);
            }
            void getFavouriteWorkshops();

            return function cleanup() {
                controller.abort();
            }
        }
        , [])


    return (
        <main className={`outer-container ${styles["favourite-workshops__outer-container"]}`}>
            <div className={`inner-container ${styles["favourite-workshops__inner-container"]}`}>
                <h1>Mijn favoriete workshops</h1>

                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}

                <section className={styles["overview__workshop-tiles"]}>

                    {favouriteWorkshops && favouriteWorkshops.map((workshop) => {
                        return (
                            //TODO default pic toevoegen?
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

export default FavouriteWorkshops;