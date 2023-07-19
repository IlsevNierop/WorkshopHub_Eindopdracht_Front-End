import React, {useEffect, useState} from 'react';
import styles from './VerifyWorkshops.module.css';
import WorkshopTile from "../../components/WorkshopTile/WorkshopTile";
import {errorHandling} from "../../helper/errorHandling";
import {fetchWorkshopsToVerifyByAdmin} from "../../api/api";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";

function VerifyWorkshops() {

    const token = localStorage.getItem('token');
    const controller = new AbortController();


    const [workshopsToVerifyData, setWorkshopsToVerifyData] = useState([]);
    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);

    useEffect(() => {
        async function getWorkshopsToVerifyByAdmin() {
            toggleLoading(true);
            setError('');
                try {
                    const response = await fetchWorkshopsToVerifyByAdmin(token);
                    setWorkshopsToVerifyData(response);

                    if (response) {
                        setError('');
                    }

                } catch (e) {
                    setError(errorHandling(e));
                    console.log(error);
                }
                toggleLoading(false);
            }
            void getWorkshopsToVerifyByAdmin();

            return function cleanup() {
                controller.abort();
            }
        }
        , [])


    return (
        <main className={`outer-container ${styles["verify-workshop__outer-container"]}`}>
            <div className={`inner-container ${styles["verify-workshop__inner-container"]}`}>

                <h1>Te accorderen workshops</h1>

                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}

                <section className={styles["overview__workshop-tiles"]}>
                    {workshopsToVerifyData && workshopsToVerifyData.map((workshop) => {
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
                                link={`/aanpassenworkshop/${workshop.id}`}
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