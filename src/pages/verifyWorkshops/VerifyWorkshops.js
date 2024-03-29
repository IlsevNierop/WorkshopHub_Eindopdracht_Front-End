import React, {useContext, useEffect, useState} from 'react';
import styles from './VerifyWorkshops.module.css';
import WorkshopTile from "../../components/WorkshopTile/WorkshopTile";
import {errorHandling} from "../../helper/errorHandling";
import {fetchWorkshopsToVerifyByAdmin, fetchWorkshopsToPublishByOwner} from "../../api/api";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";
import {Confetti} from "@phosphor-icons/react";
import {AuthContext} from "../../context/AuthContext";

function VerifyWorkshops() {

    const token = localStorage.getItem('token');
    const controller = new AbortController();
    const {user: {highestAuthority, id}} = useContext(AuthContext);

    const [workshopsToVerifyData, setWorkshopsToVerifyData] = useState([]);
    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);

    useEffect(() => {
        async function getWorkshopsToVerify() {
            toggleLoading(true);
            setError('');
            try {
                let response;
                if (highestAuthority === 'admin') {
                    response = await fetchWorkshopsToVerifyByAdmin(token);
                } else {
                    response = await fetchWorkshopsToPublishByOwner(token, id);
                }
                setWorkshopsToVerifyData(response);
                setError('');
            } catch (e) {
                console.error(e);
                setError(errorHandling(e));
            }
            toggleLoading(false);
        }

        void getWorkshopsToVerify();

        return function cleanup() {
            controller.abort();
        }
    }, []);


    return (
        <main className={`outer-container ${styles["verify-workshop__outer-container"]}`}>
            <div className={`inner-container ${styles["verify-workshop__inner-container"]}`}>

                <h1>{highestAuthority === 'admin' ? "Openstaande workshops" : "Goedgekeurde workshops: te publiceren"}</h1>

                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}

                <section className={styles["overview__workshop-tiles"]}>
                    {workshopsToVerifyData.length === 0 &&
                        <>
                            <Confetti size={32} color="#c45018" weight="fill"/>
                            <h3>Er zijn momenteel geen openstaande workshops.</h3>
                            <Confetti size={32} color="#c45018" weight="fill"/>
                        </>
                    }
                    {workshopsToVerifyData && workshopsToVerifyData.map((workshop) => {
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

export default VerifyWorkshops;