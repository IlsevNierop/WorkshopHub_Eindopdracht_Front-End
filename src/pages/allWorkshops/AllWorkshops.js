import React, {useEffect, useState} from 'react';
import styles from "./AllWorkshops.module.css"
import {fetchAllWorkshopsAdmin} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {NotePencil, TrashSimple} from "@phosphor-icons/react";
import {Link} from "react-router-dom";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";
import Select from "react-select";
import {sortArrayAllWorkshops} from "../../helper/sortArrayAllWorkshops";

function AllWorkshops() {
    const token = localStorage.getItem('token');
    const controller = new AbortController();

    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);

    const [workshopsData, setWorkshopsData] = useState([]);

    const [sortValue, setSortValue] = useState([]);


    const optionsSortValue = [
        {value: "workshopId", label: "Workshop ID"},
        {value: "title", label: "Titel"},
        {value: "date", label: "Datum"},
        {value: "companyname", label: "Bedrijf"},
        {value: "verified", label: "Geaccordeerd"},
    ];

    //TODO search quiery and getrequest on backend

    useEffect(() => {
            async function getAllWorkshopsAdmin() {
                toggleLoading(true);
                setError('');
                try {
                    const response = await fetchAllWorkshopsAdmin(token);
                    setWorkshopsData(response);

                    if (response) {
                        setError('');
                    }

                } catch (e) {
                    setError(errorHandling(e));
                    console.log(error);
                }
                toggleLoading(false);
            }

            void getAllWorkshopsAdmin();

            return function cleanup() {
                controller.abort();
            }
        }
        , [])

    useEffect(() => {
        setWorkshopsData(sortArrayAllWorkshops(workshopsData, sortValue.value));
    }, [sortValue]);



    return (
        <main className={`outer-container ${styles["all-workshops__outer-container"]}`}>
            <div className={`inner-container ${styles["all-workshops__inner-container"]}`}>
                <h1>Alle workshops</h1>
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                {/*//TODO zoeken op toevoegen en sorteren*/}


                <div className={styles["sort"]}>
                    <h4>Sorteer op:</h4>
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

                <table className={styles["table__workshops"]}>
                    <thead>
                        <tr className={styles["table-header-row__workshops"]}>
                            <th>Workshop ID</th>
                            <th>Titel</th>
                            <th>Datum</th>
                            <th>Bedrijf</th>
                            <th>Geaccordeerd</th>
                            <th>Gepubliceerd</th>
                            <th>Wijzigen</th>
                            <th>Verwijderen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workshopsData && workshopsData.map((workshop) => {
                            return (<tr key={workshop.id}>
                                    <td><Link className={styles["link__workshoppage"]} to={`/workshop/${workshop.id}`}>{workshop.id}</Link></td>
                                    <td>{workshop.title}</td>
                                    <td>{updateDateFormatShort(workshop.date)}</td>
                                    <td>{workshop.workshopOwnerCompanyName}</td>
                                    <td className={workshop.workshopVerified ? `${styles["td-verified"]}` : `${styles["td-not-verified"]}`}>{workshop.workshopVerified ? "Geaccordeerd" : (workshop.workshopVerified === false ? "Afgekeurd" : "Nog niet akkoord")}</td>
                                    <td className={workshop.workshopVerified ? `${styles["td-published"]}` : `${styles["td-not-published"]}`}>{workshop.publishWorkshop ? "Gepubliceerd" : "Nog niet gepubliceerd"}</td>
                                    <td><Link className={styles["link"]}
                                              to={`/aanpassenworkshop/${workshop.id}`}><NotePencil size={20}
                                                                                                   weight="regular"/></Link>
                                    </td>
                                    {/*//TODO modal toevoegen en link naar delete*/}
                                    <td><Link className={styles["link"]} to="#"><TrashSimple size={20}
                                                                                             weight="regular"/></Link>
                                    </td>

                                </tr>
                            )
                        })}
                    </tbody>
                </table>


            </div>
        </main>

    );
}

export default AllWorkshops;