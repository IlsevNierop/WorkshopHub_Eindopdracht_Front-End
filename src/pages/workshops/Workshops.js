import React, {useContext, useEffect, useState} from 'react';
import styles from "./Workshops.module.css"
import {
    fetchAllWorkshopsAdmin,
    fetchAllWorkshopsOwnerByOwner,
    removeWorkshop,
    verifyWorkshopByOwner
} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {NotePencil, TrashSimple} from "@phosphor-icons/react";
import {Link, useNavigate} from "react-router-dom";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";
import Select from "react-select";
import {sortArrayAllWorkshops} from "../../helper/sortArrayAllWorkshops";
import CustomModal from "../../components/CustomModal/CustomModal";
import {AuthContext} from "../../context/AuthContext";

function Workshops() {
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
                {value: 'date', label: 'Datum'},
                {value: 'companyname', label: 'Bedrijf'},
                {value: 'verified', label: 'Geaccordeerd'},
            ]
            : [
                {value: 'workshopId', label: 'Workshop ID'},
                {value: 'title', label: 'Titel'},
                {value: 'date', label: 'Datum'},
                {value: 'verified', label: 'Geaccordeerd'},
            ];


    //TODO search quiery and getrequest on backend

    useEffect(() => {
            async function getAllWorkshops() {
                toggleLoading(true);
                setError('');
                if (highestAuthority === 'admin') {
                    try {
                        const response = await fetchAllWorkshopsAdmin(token);
                        setWorkshopsData(response);

                        if (response) {
                            setError('');
                        }

                    } catch (e) {
                        setError(errorHandling(e));
                        openModalError();
                        setTimeout(() => {
                            closeModalError();
                        }, 4000);
                        console.log(error);
                    }
                } else {
                    try {
                        const response = await fetchAllWorkshopsOwnerByOwner(token, id);
                        setWorkshopsData(response);

                        if (response) {
                            setError('');
                        }

                    } catch (e) {
                        setError(errorHandling(e));
                        openModalError();
                        setTimeout(() => {
                            closeModalError();
                        }, 4000);
                        console.log(error);
                    }

                }
                toggleLoading(false);
            }

            void getAllWorkshops();

            return function cleanup() {
                controller.abort();
            }
        }
        , [needUpdateWorkshopsData])

    useEffect(() => {
        setWorkshopsData(sortArrayAllWorkshops(workshopsData, sortValue.value));
    }, [sortValue]);


    async function publishWorkshop(workshopId, publishWorkshop) {
        setError('');
        try {
            await verifyWorkshopByOwner(token, workshopId, publishWorkshop);
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
            console.log(e);
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
            const response = await removeWorkshop(token, workshopId);
            console.log(response);
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
        console.log(workshopId);
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

                {highestAuthority === 'admin' &&
                    <table className={"table"}>
                        <thead>
                            <tr className={"table-header-row"}>
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
                                        <td><Link className={"link-table-text"}
                                                  to={`/workshop/${workshop.id}`}>{workshop.id}</Link></td>
                                        <td>{workshop.title}</td>
                                        <td>{updateDateFormatShort(workshop.date)}</td>
                                        <td>{workshop.workshopOwnerCompanyName}</td>
                                        {/*//TODO een link met direct verifieren met modal ter check*/}
                                        <td className={workshop.workshopVerified ? "td-verified" : "td-not-verified"}>{workshop.workshopVerified ? "Geaccordeerd" : (workshop.workshopVerified === false ? "Afgekeurd" : "Nog niet akkoord")}</td>
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
                                        <td><Link className={"link-icon"}
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
                                        <td><Link className={"link-icon"} to="#"
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
                    <table className={styles["table__workshops"]}>
                        <thead>
                            <tr className={styles["table-header-row__workshops"]}>
                                <th>Workshop ID</th>
                                <th>Titel</th>
                                <th>Datum</th>
                                <th>Geaccordeerd</th>
                                <th>Gepubliceerd</th>
                                <th>Feedback Admin</th>
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
                                        <td className={workshop.workshopVerified ? `${styles["td-verified"]}` : `${styles["td-not-verified"]}`}>{workshop.workshopVerified ? "Geaccordeerd" : (workshop.workshopVerified === false ? "Afgekeurd" : "Nog niet akkoord")}</td>
                                        <td className={workshop.workshopVerified ? `${styles["td-published"]}` : `${styles["td-not-published"]}`}>{workshop.publishWorkshop ? (
                                            "Gepubliceerd"
                                        ) : workshop.workshopVerified ? (
                                            <Link
                                                className={styles["link-publish"]}
                                                to="#"
                                                onClick={() => publishWorkshop(workshop.id, true)}
                                            >
                                                Direct publiceren
                                            </Link>
                                        ) : (
                                            "Nog niet gepubliceerd"
                                        )}</td>
                                        <td>{workshop.feedbackAdmin}</td>
                                        <td><Link className={styles["link"]}
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
                                        <td><Link className={styles["link"]} to="#"
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

export default Workshops;