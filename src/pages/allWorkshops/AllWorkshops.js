import React, {useEffect, useState} from 'react';
import styles from "./AllWorkshops.module.css"
import {fetchAllWorkshopsAdmin, removeWorkshop} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {NotePencil, TrashSimple} from "@phosphor-icons/react";
import {Link} from "react-router-dom";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";
import Select from "react-select";
import {sortArrayAllWorkshops} from "../../helper/sortArrayAllWorkshops";
import CustomModal from "../../components/CustomModal/CustomModal";
import Button from "../../components/Button/Button";

function AllWorkshops() {
    const token = localStorage.getItem('token');
    const controller = new AbortController();

    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);

    const [workshopsData, setWorkshopsData] = useState([]);
    const [needUpdateWorkshopsData, toggleNeedUpdateWorkshopsData] = useState(false);

    const [sortValue, setSortValue] = useState([]);
    const [modalIsOpenDeleteSuccessful, setIsOpenDeleteSuccessful] = useState(false);
    const [modalIsOpenDeleteCheck, setIsOpenDeleteCheck] = useState(false);
    const [toDeleteWorkshopId, setToDeleteWorkshopId] = useState(null);


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
        , [needUpdateWorkshopsData])

    useEffect(() => {
        setWorkshopsData(sortArrayAllWorkshops(workshopsData, sortValue.value));
    }, [sortValue]);

    function checkDeleteWorkshop(workshopId) {
        openModalDeleteCheck();
        setToDeleteWorkshopId(workshopId);
    }

    async function deleteWorkshop(workshopId) {
        closeModalDeleteCheck();
        toggleLoading(true);
        setError('');
        try {
            const response = await removeWorkshop(token, workshopId);
            console.log(response);
            setError('');
            openModalDeleteSuccessful();
            toggleNeedUpdateWorkshopsData(!needUpdateWorkshopsData);
            setTimeout(() => {
                closeModalDeleteSuccessful();
            }, 3000);

        } catch (e) {
            setError(errorHandling(e));
            console.log(error);
        }
        toggleLoading(false);
        setToDeleteWorkshopId(null);
    }

    function openModalDeleteSuccessful() {
        setIsOpenDeleteSuccessful(true);
    }

    function afterOpenModalDeleteSuccessful() {
    }

    function closeModalDeleteSuccessful() {
        setIsOpenDeleteSuccessful(false);
    }

    function openModalDeleteCheck() {
        setIsOpenDeleteCheck(true);
    }

    function afterOpenModalDeleteCheck() {
    }

    function closeModalDeleteCheck() {
        setIsOpenDeleteCheck(false);
        setToDeleteWorkshopId(null);
    }


    return (
        <main className={`outer-container ${styles["all-workshops__outer-container"]}`}>
            <div className={`inner-container ${styles["all-workshops__inner-container"]}`}>
                <h1>Alle workshops</h1>
                {loading && <p>Loading...</p>}

                {/*//TODO make modal for error*/}
                {error && <p className="error-message">{error}</p>}

                <CustomModal
                    modalIsOpen={modalIsOpenDeleteSuccessful}
                    afterOpenModal={afterOpenModalDeleteSuccessful}
                    closeModal={closeModalDeleteSuccessful}
                    contentLabel="Delete workshop successful"
                    updateHeader={`De workshop met is succesvol verwijderd`}
                ></CustomModal>

                <CustomModal
                    modalIsOpen={modalIsOpenDeleteCheck}
                    afterOpenModal={afterOpenModalDeleteCheck}
                    closeModal={closeModalDeleteCheck}
                    contentLabel="Check deleting workshop"
                    functionalModalHeader="Weet je zeker dat je deze workshop wilt verwijderen?"
                >

                    <div className={styles["bottom-row__modal-check"]}>
                        <Button type="text"
                                onClick={() => deleteWorkshop(toDeleteWorkshopId)}
                        >Ja ik weet het zeker</Button>
                        <Button type="text"
                                onClick={closeModalDeleteCheck}>Terug</Button>
                    </div>
                    ></CustomModal>

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
                                    <td><Link className={styles["link__workshoppage"]}
                                              to={`/workshop/${workshop.id}`}>{workshop.id}</Link></td>
                                    <td>{workshop.title}</td>
                                    <td>{updateDateFormatShort(workshop.date)}</td>
                                    <td>{workshop.workshopOwnerCompanyName}</td>
                                    <td className={workshop.workshopVerified ? `${styles["td-verified"]}` : `${styles["td-not-verified"]}`}>{workshop.workshopVerified ? "Geaccordeerd" : (workshop.workshopVerified === false ? "Afgekeurd" : "Nog niet akkoord")}</td>
                                    <td className={workshop.workshopVerified ? `${styles["td-published"]}` : `${styles["td-not-published"]}`}>{workshop.publishWorkshop ? "Gepubliceerd" : "Nog niet gepubliceerd"}</td>
                                    <td><Link className={styles["link"]}
                                              to={`/aanpassenworkshop/${workshop.id}`}><NotePencil size={20}
                                                                                                   weight="regular"/></Link>
                                    </td>
                                    {/*//TODO modal  ter check */}
                                    <td><Link className={styles["link"]} to="#"
                                              onClick={() => checkDeleteWorkshop(workshop.id)}><TrashSimple size={20}
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