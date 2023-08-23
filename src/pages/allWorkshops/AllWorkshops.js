import React, {useContext, useEffect, useState} from 'react';
import styles from "./AllWorkshops.module.css"
import {
    fetchAllWorkshopsAdmin,
    fetchAllWorkshopsOwnerByOwner,
    removeWorkshop,
    publishWorkshopByOwner
} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {NotePencil, TrashSimple} from "@phosphor-icons/react";
import {Link, useNavigate} from "react-router-dom";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";
import Select from "react-select";
import CustomModal from "../../components/CustomModal/CustomModal";
import {AuthContext} from "../../context/AuthContext";
import {sortArrayTable} from "../../helper/sortArrayTable";

function AllWorkshops() {
    const token = localStorage.getItem('token');
    const {user: {highestAuthority, id}} = useContext(AuthContext);

    const controller = new AbortController();
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);
    const [workshopsData, setWorkshopsData] = useState([]);
    const [needUpdateWorkshopsData, toggleNeedUpdateWorkshopsData] = useState(false);

    const [sortValue, setSortValue] = useState([]);
    const [modalIsOpenDeleteSuccessful, setIsOpenDeleteSuccessful] = useState(false);
    const [modalIsOpenPublishSuccessful, setIsOpenPublishSuccessful] = useState(false);
    const [modalIsOpenError, setIsOpenError] = useState(false);
    const [modalIsOpenDeleteCheck, setIsOpenDeleteCheck] = useState(false);
    const [modalIsOpenEditCheck, setIsOpenEditCheck] = useState(false);
    const [toDeleteWorkshopId, setToDeleteWorkshopId] = useState(null);
    const [toEditWorkshopId, setToEditWorkshopId] = useState(null);

    const optionsSortValue =
        highestAuthority === 'admin'
            ? [
                {value: 'workshopId', label: 'Workshop ID'},
                {value: 'title', label: 'Titel'},
                {value: 'workshopDate', label: 'Datum'},
                {value: 'companyname', label: 'Bedrijf'},
                {value: 'workshopVerified', label: 'Goedgekeurd'},
            ]
            : [
                {value: 'workshopId', label: 'Workshop ID'},
                {value: 'title', label: 'Titel'},
                {value: 'workshopDate', label: 'Datum'},
                {value: 'workshopVerified', label: 'Goedgekeurd'},
            ];

    useEffect(() => {
            async function getAllWorkshops() {
                toggleLoading(true);
                setError('');
                try {
                    let response;
                    if (highestAuthority === 'admin') {
                        response = await fetchAllWorkshopsAdmin(token);
                    } else {
                        response = await fetchAllWorkshopsOwnerByOwner(token, id);
                    }
                    setWorkshopsData(response);
                    setError('');
                } catch (e) {
                    setError(errorHandling(e));
                    openModalError();
                    setTimeout(() => {
                        closeModalError();
                    }, 4000);
                }
                toggleLoading(false);
            }

            void getAllWorkshops();

            return function cleanup() {
                controller.abort();
            }
        }
        , [needUpdateWorkshopsData]);

    useEffect(() => {
        setWorkshopsData(sortArrayTable(workshopsData, sortValue.value));
    }, [sortValue]);


    async function publishWorkshop(workshopId, publishWorkshop) {
        setError('');
        try {
            await publishWorkshopByOwner(token, workshopId, publishWorkshop);
            toggleNeedUpdateWorkshopsData(!needUpdateWorkshopsData);
            openModalPublishSuccessful();
            setTimeout(() => {
                closeModalPublishSuccessful();
            }, 4000);

        } catch (e) {
            setError(errorHandling(e));
            openModalError();
            setTimeout(() => {
                closeModalError();
            }, 4000);
        }
    }

    function checkDeleteWorkshop(workshopId) {
        openModalDeleteCheck();
        setToDeleteWorkshopId(workshopId);
    }

    async function deleteWorkshop(workshopId) {
        closeModalDeleteCheck();
        toggleLoading(true);
        setError('');
        try {
            await removeWorkshop(token, workshopId);
            setError('');
            openModalDeleteSuccessful();
            toggleNeedUpdateWorkshopsData(!needUpdateWorkshopsData);
            setTimeout(() => {
                closeModalDeleteSuccessful();
            }, 4000);

        } catch (e) {
            setError(errorHandling(e));
            openModalError();
            setTimeout(() => {
                closeModalError();
            }, 4000);
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

    function openModalPublishSuccessful() {
        setIsOpenPublishSuccessful(true);
    }

    function afterOpenModalPublishSuccessful() {
    }

    function closeModalPublishSuccessful() {
        setIsOpenPublishSuccessful(false);
    }

    function openModalError() {
        setIsOpenError(true);
    }

    function afterOpenModalError() {
    }

    function closeModalError() {
        setIsOpenError(false);
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

    function openModalEditCheck(workshopId) {
        setToEditWorkshopId(workshopId);
        setIsOpenEditCheck(true);
    }

    function afterOpenModalEditCheck() {
    }

    function closeModalEditCheck() {
        setIsOpenEditCheck(false);
        setToEditWorkshopId(null);
    }


    return (
        <main className={`outer-container ${styles["all-workshops__outer-container"]}`}>
            <div className={`inner-container ${styles["all-workshops__inner-container"]}`}>
                <h1>Alle workshops</h1>
                {loading && <p>Loading...</p>}

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
                    modalIsOpen={modalIsOpenDeleteSuccessful}
                    afterOpenModal={afterOpenModalDeleteSuccessful}
                    closeModal={closeModalDeleteSuccessful}
                    contentLabel="Delete workshop successful"
                    updateHeader={`De workshop is succesvol verwijderd`}
                ></CustomModal>

                <CustomModal
                    modalIsOpen={modalIsOpenPublishSuccessful}
                    afterOpenModal={afterOpenModalPublishSuccessful}
                    closeModal={closeModalPublishSuccessful}
                    contentLabel="Publish workshop successful"
                    updateHeader={`De workshop is succesvol gepubliceerd en staat online`}
                ></CustomModal>

                <CustomModal
                    modalIsOpen={modalIsOpenDeleteCheck}
                    afterOpenModal={afterOpenModalDeleteCheck}
                    closeModal={closeModalDeleteCheck}
                    contentLabel="Check deleting workshop"
                    checkModalHeader="Weet je het zeker?"
                    buttonHeaderCheckModalYes="Ja ik weet het zeker"
                    onclickHandlerCheckModalYes={() => deleteWorkshop(toDeleteWorkshopId)}
                    onclickHandlerCheckModalBack={closeModalDeleteCheck}
                    checkMessage="Wil je de workshop echt verwijderen? -Door op Ja te klikken wordt de workshop verwijderd"
                ></CustomModal>
                <CustomModal
                    modalIsOpen={modalIsOpenEditCheck}
                    afterOpenModal={afterOpenModalEditCheck}
                    closeModal={closeModalEditCheck}
                    contentLabel="Check editing workshop"
                    checkModalHeader="Weet je het zeker?"
                    buttonHeaderCheckModalYes="Workshop
                                    wijzigen"
                    onclickHandlerCheckModalYes={() => navigate(`/aanpassenworkshop/${toEditWorkshopId}`)}
                    onclickHandlerCheckModalBack={closeModalEditCheck}
                    checkMessage="Deze workshop is gepubliceerd en staat online. - Als je de workshop wijzigt, wordt deze offline gehaald en moet die eerst geverifieerd
                                worden door een administrator voordat de workshop weer gepubliceerd kan worden."
                ></CustomModal>

                <div className={styles["sort"]}>
                    <label className="select-dropdown" htmlFor="select-dropdown-sort">Sorteer op:</label>
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

                {highestAuthority === 'admin' &&
                    <table className={"table"}>
                        <thead>
                            <tr className={"table-header-row"}>
                                <th>Workshop ID</th>
                                <th>Titel</th>
                                <th>Datum</th>
                                <th>Bedrijf</th>
                                <th>Goedgekeurd</th>
                                <th>Gepubliceerd</th>
                                <th>Wijzigen</th>
                                <th>Verwijderen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workshopsData && workshopsData.map((workshop) => {
                                return (<tr key={workshop.id}>
                                        <td><Link
                                            aria-label="link__workshop-page"
                                            className={"link-table-text"}
                                            to={`/workshop/${workshop.id}`}>{workshop.id}</Link></td>
                                        <td>{workshop.title}</td>
                                        <td>{updateDateFormatShort(workshop.date)}</td>
                                        <td>{workshop.workshopOwnerCompanyName}</td>
                                        <td className={workshop.workshopVerified ? "td-verified" : "td-not-verified"}>{workshop.workshopVerified ? "Goedgekeurd" : (workshop.workshopVerified === false ? "Afgekeurd" : "Nog niet goedgekeurd")}</td>
                                        <td className={workshop.workshopVerified ? "td-published" : "td-not-published"}>{workshop.publishWorkshop ? (
                                            "Gepubliceerd"
                                        ) : workshop.workshopVerified ? (
                                            <Link
                                                className={"link-table-text"}
                                                to="#"
                                                onClick={() => publishWorkshop(workshop.id, true)}
                                            >
                                                Direct publiceren
                                            </Link>
                                        ) : (
                                            "Nog niet gepubliceerd"
                                        )}</td>
                                        <td><Link
                                            aria-label="link__edit-workshop"
                                            className={"link-icon"}
                                            to={workshop.publishWorkshop === true ?
                                                "#"
                                                :
                                                `/aanpassenworkshop/${workshop.id}`}

                                            onClick={() => {
                                                if (workshop.publishWorkshop === true) {
                                                    openModalEditCheck(workshop.id);
                                                }
                                            }}
                                        ><NotePencil
                                            size={20}
                                            weight="regular"/></Link>
                                        </td>
                                        <td><Link
                                            aria-label="link__delete-workshop"
                                            className={"link-icon"} to="#"
                                            onClick={() => checkDeleteWorkshop(workshop.id)}><TrashSimple
                                            size={20}
                                            weight="regular"/></Link>
                                        </td>

                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                }
                {highestAuthority === 'workshopowner' &&
                    <table className={"table"}>
                        <thead>
                            <tr className={"table-header-row"}>
                                <th>Workshop ID</th>
                                <th>Titel</th>
                                <th>Datum</th>
                                <th>Goedgekeurd door admin</th>
                                <th>Gepubliceerd</th>
                                <th>Feedback Admin</th>
                                <th>Wijzigen</th>
                                <th>Verwijderen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workshopsData && workshopsData.map((workshop) => {
                                return (<tr key={workshop.id}>
                                        <td><Link
                                            aria-label="link__workshop-page"
                                            className={"link-table-text"}
                                            to={`/workshop/${workshop.id}`}>{workshop.id}</Link></td>
                                        <td>{workshop.title}</td>
                                        <td>{updateDateFormatShort(workshop.date)}</td>
                                        <td className={workshop.workshopVerified ? "td-verified" : "td-not-verified"}>{workshop.workshopVerified ? "Goedgekeurd" : (workshop.workshopVerified === false ? "Afgekeurd" : "Nog niet goedgekeurd")}</td>
                                        <td className={workshop.workshopVerified ? "td-published" : "td-not-published"}>{workshop.publishWorkshop ? (
                                            "Gepubliceerd"
                                        ) : workshop.workshopVerified ? (
                                            <Link
                                                className={"link-table-text"}
                                                to="#"
                                                onClick={() => publishWorkshop(workshop.id, true)}
                                            >
                                                Direct publiceren
                                            </Link>
                                        ) : (
                                            "Nog niet gepubliceerd"
                                        )}</td>
                                        <td>{workshop.feedbackAdmin}</td>
                                        <td><Link
                                            aria-label="link__edit-workshop"
                                            className={"link-icon"}
                                            to={workshop.publishWorkshop === true ?
                                                "#"
                                                :
                                                `/aanpassenworkshop/${workshop.id}`}

                                            onClick={() => {
                                                if (workshop.publishWorkshop === true) {
                                                    openModalEditCheck(workshop.id);
                                                }
                                            }}
                                        ><NotePencil
                                            size={20}
                                            weight="regular"/></Link>
                                        </td>
                                        <td><Link
                                            aria-label="link__delete-workshop"
                                            className={"link-icon"} to="#"
                                            onClick={() => checkDeleteWorkshop(workshop.id)}><TrashSimple
                                            size={20}
                                            weight="regular"/></Link>
                                        </td>

                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                }
            </div>
        </main>

    );
}

export default AllWorkshops;