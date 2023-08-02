import React, {useContext, useEffect, useState} from 'react';
import styles from "./AllBookings.module.css";
import {Link} from "react-router-dom";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";
import {NotePencil, TrashSimple} from "@phosphor-icons/react";
import {
    fetchAllBookingsAdmin, fetchAllBookingsCustomer, fetchAllBookingsWorkshopOwner,
    getCsvFileAdmin, getCsvFileWorkshop, getCsvFileWorkshopOwner, removeBooking, updateBooking
} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {AuthContext} from "../../context/AuthContext";
import CustomModal from "../../components/CustomModal/CustomModal";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import {useForm} from "react-hook-form";
import Select from "react-select";
import {sortArrayBookings} from "../../helper/sortArrayBookings";
import {createOptionsObjectSelectDropdown} from "../../helper/createOptionsObjectSelectDropdown";

function AllBookings() {
    const token = localStorage.getItem('token');
    const {user: {highestAuthority, id}} = useContext(AuthContext);

    const {register, setValue, handleSubmit, formState: {errors}, reset} = useForm({mode: 'onBlur'});

    const controller = new AbortController();

    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);
    const [bookingsData, setBookingsData] = useState([]);
    const [originalBookingsData, setOriginalBookingsData] = useState([]);
    const [needUpdateBookingData, toggleNeedUpdateBookingData] = useState(false);
    const [sortValue, setSortValue] = useState([]);
    const [optionsWorkshopId, setOptionsWorkshopId] = useState([]);
    const [workshopId, setWorkshopId] = useState({});


    const [modalIsOpenError, setIsOpenError] = useState(false);
    const [modalIsOpenDeleteCheck, setIsOpenDeleteCheck] = useState(false);
    const [modalIsOpenDeleteSuccessful, setIsOpenDeleteSuccessful] = useState(false);
    const [toDeleteBookingId, setToDeleteBookingId] = useState(null);

    const [modalIsOpenUpdateBooking, setIsOpenUpdateBooking] = useState(false);
    const [modalIsOpenUpdateBookingSuccessful, setIsOpenUpdateBookingSuccessful] = useState(false);

    const [toUpdateBookingData, setToUpdateBookingData] = useState({
        booking: {
            sppotsAvailableWorkshop: '',
            amount: '',
        }
    });

    const optionsSortValue =
        [{value: 'bookingId', label: 'Boeking ID'},
            {value: 'workshopId', label: 'Workshop ID'},
            {value: 'dateBooking', label: 'Datum Boeking'},
            {value: 'firstNameCustomer', label: 'Voornaam klant'},];


    useEffect(() => {
            async function getAllBookings() {
                toggleLoading(true);
                setError('');
                try {
                    let response;
                    if (highestAuthority === 'admin') {
                        response = await fetchAllBookingsAdmin(token);
                    } else if (highestAuthority === 'customer') {
                        response = await fetchAllBookingsCustomer(token, id);
                    } else {
                        response = await fetchAllBookingsWorkshopOwner(token, id);
                    }
                    setOriginalBookingsData(response);
                    setBookingsData(response);
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
                toggleLoading(false);
            }

            void getAllBookings();

            return function cleanup() {
                controller.abort();
            }
        }
        ,
        [needUpdateBookingData]
    )
    ;

    useEffect(() => {
        function setOptions() {
            setOptionsWorkshopId(createOptionsObjectSelectDropdown(bookingsData, "workshopId",));
        }

        void setOptions();
    }, [originalBookingsData]);


    useEffect(() => {
        setBookingsData(sortArrayBookings(bookingsData, sortValue.value));
    }, [sortValue]);


    useEffect(() => {
        if (Object.keys(workshopId).length !== 0) {
            setBookingsData(originalBookingsData.filter((booking) => {
                return `${booking.workshopId}` === workshopId.value;
            }));
        }
    }, [workshopId]);


    function removeWorkshopIdFilter() {
        setWorkshopId([]);
        setBookingsData(originalBookingsData);
    }


    const validateSpotsAvailable = (value) => {
        if ((toUpdateBookingData.booking.sppotsAvailableWorkshop + toUpdateBookingData.booking.amount) < value) {
            return `Er zijn maar ${(toUpdateBookingData.booking.sppotsAvailableWorkshop + toUpdateBookingData.booking.amount)} plekken beschikbaar, en je probeert ${value} plekken te boeken`;
        }
        return true;
    };

    function changeBooking(bookingId, firstNameCustomer, lastNameCustomer, amount, commentsCustomer, workshopId, sppotsAvailableWorkshop) {
        setToUpdateBookingData({
            booking: {
                sppotsAvailableWorkshop,
                amount
            }
        });
        setValue('bookingId', bookingId);
        setValue('firstNameCustomer', firstNameCustomer)
        setValue('lastNameCustomer', lastNameCustomer)
        setValue('amount', amount);
        setValue('commentsCustomer', commentsCustomer);
        setValue('workshopId', workshopId);

        openModalUpdateBooking();
    }

    async function handleFormSubmit(data) {
        try {
            await updateBooking(token, data.amount, data.commentsCustomer, data.workshopId, data.bookingId);
            closeModalUpdateBooking();
            openModalUpdateBookingSuccessful();
            toggleNeedUpdateBookingData(!needUpdateBookingData);
            setTimeout(() => {
                closeModalUpdateBookingSuccessful();
            }, 4000);


        } catch (e) {
            setError(errorHandling(e));
            console.log(e)
            openModalError();
            setTimeout(() => {
                closeModalError();
            }, 3000);
        }
    }

    async function deleteBooking(bookingId) {
        closeModalDeleteCheck();
        setError('');
        try {
            await removeBooking(token, bookingId);
            setError('');
            openModalDeleteSuccessful();
            toggleNeedUpdateBookingData(!needUpdateBookingData);
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
        setToDeleteBookingId(null);
    }

    async function downloadCsvFileBookings(type, workshopId) {
        try {
            let response;
            if (workshopId) {
                response = await getCsvFileWorkshop(token, workshopId);
            } else if (type === 'admin') {
                response = await getCsvFileAdmin(token);
            } else if (type === 'workshopowner') {
                response = await getCsvFileWorkshopOwner(token, id);
            }
            setError('');
            const blob = new Blob([response], {type: 'text/csv'});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "boekingen.csv";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (e) {
            setError(errorHandling(e));
            openModalError();
            setTimeout(() => {
                closeModalError();
            }, 4000);
            console.log(error);
        }
    }

    function openModalError() {
        setIsOpenError(true);
    }

    function afterOpenModalError() {
    }

    function closeModalError() {
        setIsOpenError(false);
    }

    function checkDeleteBooking(bookingId) {
        openModalDeleteCheck();
        setToDeleteBookingId(bookingId);
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
        setToDeleteBookingId(null);
    }

    function openModalUpdateBooking() {
        setIsOpenUpdateBooking(true);
    }

    function afterOpenModalUpdateBooking() {
    }

    function closeModalUpdateBooking() {
        setIsOpenUpdateBooking(false);
        reset();
    }

    function openModalUpdateBookingSuccessful() {
        setIsOpenUpdateBookingSuccessful(true);
    }

    function afterOpenModalUpdateBookingSuccessful() {
    }

    function closeModalUpdateBookingSuccessful() {
        setIsOpenUpdateBookingSuccessful(false);
    }


    return (
        <main className={`outer-container ${styles["all-bookings__outer-container"]}`}>
            <div className={`inner-container ${styles["all-bookings__inner-container"]}`}>
                {bookingsData && bookingsData.length > 0 ?
                    <h1>{(highestAuthority === 'admin' || highestAuthority === 'workshopowner')  ? "Alle boekingen" : "Mijn boekingen"} </h1>
                    :
                    <h1>{(highestAuthority === 'admin' || highestAuthority === 'workshopowner') ? "Er zijn nog geen boekingen" : "Je hebt nog geen boekingen"} </h1>
                }

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
                    modalIsOpen={modalIsOpenDeleteCheck}
                    afterOpenModal={afterOpenModalDeleteCheck}
                    closeModal={closeModalDeleteCheck}
                    contentLabel="Check deleting booking"
                    checkModalHeader="Weet je het zeker?"
                    buttonHeaderCheckModalYes="Ja ik weet het zeker"
                    onclickHandlerCheckModalYes={() => deleteBooking(toDeleteBookingId)}
                    onclickHandlerCheckModalBack={closeModalDeleteCheck}
                    checkMessage="Wil je de boeking echt verwijderen? -Door op Ja te klikken wordt de boeking verwijderd"
                ></CustomModal>

                <CustomModal
                    modalIsOpen={modalIsOpenDeleteSuccessful}
                    afterOpenModal={afterOpenModalDeleteSuccessful}
                    closeModal={closeModalDeleteSuccessful}
                    contentLabel="Delete booking successful"
                    updateHeader={`De boeking is succesvol verwijderd`}
                ></CustomModal>

                <CustomModal
                    modalIsOpen={modalIsOpenUpdateBooking}
                    afterOpenModal={afterOpenModalUpdateBooking}
                    closeModal={closeModalUpdateBooking}
                    contentLabel="Update booking"
                    functionalModalHeader={`Wijzig deze boeking`}
                >

                    <div className={styles["booking__modal"]}>
                        <form className={styles["update-booking__form"]} onSubmit={handleSubmit(handleFormSubmit)}>

                            <p className={styles["subheader__input-fields"]}>Niet te wijzigen:</p>

                            <InputField
                                type="number"
                                name="bookingId"
                                label="Boeking ID"
                                register={register}
                                errors={errors}
                                readOnly={true}
                            >
                            </InputField>
                            <InputField
                                type="text"
                                name="firstNameCustomer"
                                label="Voornaam klant"
                                register={register}
                                errors={errors}
                                readOnly={true}
                            >
                            </InputField>
                            <InputField
                                type="text"
                                name="lastNameCustomer"
                                label="Achternaam klant"
                                register={register}
                                errors={errors}
                                readOnly={true}
                            >
                            </InputField>

                            <p className={styles["subheader__input-fields"]}>Wijzigen:</p>

                            <InputField
                                type="number"
                                name="workshopId"
                                label="Workshop ID*"
                                validation={{
                                    required:
                                        {
                                            value: true,
                                            message: "Workshop ID is verplicht",
                                        },
                                }}
                                register={register}
                                errors={errors}
                            >
                            </InputField>
                            <InputField
                                type="number"
                                name="amount"
                                label="Aantal plekken* "
                                validation={{
                                    required:
                                        {
                                            value: true,
                                            message: "Aantal plekken is verplicht",
                                        },
                                    validate: validateSpotsAvailable
                                }
                                }
                                register={register}
                                errors={errors}
                            >
                            </InputField>
                            <InputField
                                type="text"
                                name="commentsCustomer"
                                label="Opmerkingen"
                                register={register}
                                errors={errors}
                            >
                            </InputField>

                            <Button
                                type="submit"
                            >Boeking plaatsen</Button>
                        </form>
                    </div>
                </CustomModal>

                <CustomModal
                    modalIsOpen={modalIsOpenUpdateBookingSuccessful}
                    afterOpenModal={afterOpenModalUpdateBookingSuccessful}
                    closeModal={closeModalUpdateBookingSuccessful}
                    contentLabel="Successful update booking"
                    updateHeader="De boeking is succesvol gewijzigd"
                ></CustomModal>

                {(bookingsData && bookingsData.length > 0 && highestAuthority !== 'customer') &&
                    <div className={styles["top__bookings__dropdown-menu"]}>

                        <div className={styles["dropdown"]}>
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

                        <div className={styles["container__filter-dropdown__button"]}>
                            <div className={styles["dropdown"]}>
                                <h4>Kies workshop ID:</h4>
                                <Select className={styles["filter__dropdown"]}
                                        id="select-dropdown-workshopId"
                                        name="select-dropdown-workshopId"
                                        label="select-dropdown-workshopId"
                                        placeholder="Selecteer.."
                                        value={workshopId}
                                        onChange={setWorkshopId}
                                        options={optionsWorkshopId}
                                        isMulti={false}
                                />
                            </div>
                            <Button type="text" onClick={removeWorkshopIdFilter}>Alle workshops</Button>
                        </div>
                    </div>
                }

                {bookingsData && bookingsData.length > 0 &&
                    <table className={"table"}>
                        <thead>
                            <tr className={"table-header-row"}>
                                <th>Boeking</th>
                                <th>Datum boeking</th>
                                <th>Aantal</th>
                                <th>Naam</th>
                                <th>Email</th>
                                <th>Opmerkingen klant</th>
                                <th>Totaal bedrag</th>
                                <th>Workshop</th>
                                <th>Titel workshop</th>
                                <th>Datum workshop</th>
                                {(highestAuthority === 'admin' || highestAuthority === 'customer') &&
                                    <>
                                        <th>Wijzigen</th>
                                        <th>Verwijderen</th>
                                        <th>Review</th>
                                    </>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {bookingsData && bookingsData.map((booking) => {
                                return (<tr key={booking.id}>
                                        <td>{booking.id}</td>
                                        <td>{updateDateFormatShort(booking.dateOrder)}</td>
                                        <td>{booking.amount}</td>
                                        <td>{booking.firstNameCustomer} {booking.lastNameCustomer} </td>
                                        <td>{booking.emailCustomer}</td>
                                        <td>{booking.commentsCustomer}</td>
                                        <td>{booking.totalPrice} euro</td>
                                        <td>{booking.workshopId}</td>
                                        <td>{booking.workshopTitle}</td>
                                        <td>{updateDateFormatShort(booking.workshopDate)}</td>

                                        {(highestAuthority === 'admin' || highestAuthority === 'customer') &&
                                            <>
                                                <td>
                                                    {new Date(booking.workshopDate) < new Date() ? (
                                                        "De boeking kan niet gewijzigd worden"
                                                    ) : (
                                                        <Link
                                                            className={"link-icon"}
                                                            to="#"
                                                            onClick={() => changeBooking(booking.id, booking.firstNameCustomer, booking.lastNameCustomer, booking.amount, booking.commentsCustomer, booking.workshopId, booking.sppotsAvailableWorkshop)}
                                                        >
                                                            <NotePencil size={20} weight="regular"/>
                                                        </Link>
                                                    )}
                                                </td>
                                                <td>
                                                    {new Date(booking.workshopDate) < new Date() ? (
                                                        "De boeking kan niet verwijderd worden"
                                                    ) : (
                                                        <Link
                                                            className={"link-icon"}
                                                            to="#"
                                                            onClick={() => checkDeleteBooking(booking.id)}
                                                        >
                                                            <TrashSimple size={20} weight="regular"/>
                                                        </Link>
                                                    )}
                                                </td>
                                                <td>
                                                    {new Date(booking.workshopDate) < new Date() ?
                                                        booking.reviewCustomerWritten ? (
                                                            "Heeft al een review"
                                                        ) : (
                                                            <Link className={"link-table-text"}
                                                                  to={`/nieuwereview/${booking.workshopId}/${booking.workshopTitle}/${booking.workshopDate}`}>Laat
                                                                review
                                                                achter</Link>
                                                        )
                                                        :
                                                        "Na afloop kun je hier een review achterlaten"
                                                    }
                                                </td>
                                            </>
                                        }
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>}

                {(highestAuthority !== 'customer' && Object.keys(workshopId).length === 0) &&
                    <Button type="text" onClick={() => downloadCsvFileBookings(highestAuthority)}>Download csv</Button>
                }

                {(highestAuthority !== 'customer' && Object.keys(workshopId).length !== 0) &&
                    <Button type="text"
                            onClick={() => downloadCsvFileBookings(highestAuthority, parseInt(workshopId.value))}>Download
                        csv</Button>
                }
            </div>
        </main>
    );
}

export default AllBookings;