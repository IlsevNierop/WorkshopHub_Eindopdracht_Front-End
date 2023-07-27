import React, {useContext, useEffect, useState} from 'react';
import styles from "./AllBookings.module.css";
import {Link} from "react-router-dom";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";
import {NotePencil, TrashSimple} from "@phosphor-icons/react";
import {
    createBooking,
    fetchAllBookingsAdmin, fetchAllBookingsCustomer, fetchAllBookingsWorkshopOwner,
    fetchAllWorkshopsAdmin,
    fetchAllWorkshopsOwnerByOwner, removeBooking,
    removeWorkshop
} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {AuthContext} from "../../context/AuthContext";
import CustomModal from "../../components/CustomModal/CustomModal";
import {updateDateFormatLong} from "../../helper/updateDateFormatLong";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import {useForm} from "react-hook-form";

function AllBookings() {
    const token = localStorage.getItem('token');
    const {user: {highestAuthority, id}} = useContext(AuthContext);

    const {register, setValue, handleSubmit, formState: {errors}, reset} = useForm({mode: 'onBlur'});

    const controller = new AbortController();

    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);
    const [bookingsData, setBookingsData] = useState([]);
    const [needUpdateBookingData, toggleNeedUpdateBookingData] = useState(false);


    const [modalIsOpenError, setIsOpenError] = useState(false);
    const [modalIsOpenUpdateBooking, setIsOpenUpdateBooking] = useState(false);
    const [modalIsOpenDeleteCheck, setIsOpenDeleteCheck] = useState(false);
    const [modalIsOpenDeleteSuccessful, setIsOpenDeleteSuccessful] = useState(false);
    const [toDeleteBookingId, setToDeleteBookingId] = useState(null);
    const [toUpdateBookingData, setToUpdateBookingData] = useState({booking: {
            bookingId: '',
            amount: '',
            commentsCustomer: '',
            customerId: '',
            workshopId: '',
            sppotsAvailableWorkshop: '',
        }});


    useEffect(() => {
            async function getAllBookings() {
                toggleLoading(true);
                setError('');
                if (highestAuthority === 'admin') {
                    try {
                        const response = await fetchAllBookingsAdmin(token);
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
                } else if (highestAuthority === 'customer') {
                    try {
                        const response = await fetchAllBookingsCustomer(token, id);
                        setBookingsData(response);
                        console.log("response")
                        console.log(response)

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
                        const response = await fetchAllBookingsWorkshopOwner(token, id);
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
                }
                toggleLoading(false);
            }

            void getAllBookings();

            return function cleanup() {
                controller.abort();
            }
        }
        , [needUpdateBookingData])


    async function handleFormSubmit(data) {
        console.log(data)
        // console.log(id);
        // console.log(workshopId);
        // try {
        //     const response = await createBooking (token, data.amount, data.comments, user.id, workshopId);
        //     console.log(response);
        //     setTotalPriceBooking(response.totalPrice);
        //
        //     openModalBookingSuccessful();
        //     setTimeout(() => {
        //         closeModalBookingSuccessful();
        //     }, 4000);
        //
        //
        // } catch (e) {
        //     setError(errorHandling(e));
        //     openModalError();
        //     setTimeout(() => {
        //         closeModalError();
        //     }, 3000);
    }

    const validateSpotsAvailable = (value) => {
        if ((toUpdateBookingData.booking.sppotsAvailableWorkshop + toUpdateBookingData.booking.amount) < value) {
            return `Er zijn maar ${(toUpdateBookingData.booking.sppotsAvailableWorkshop + toUpdateBookingData.booking.amount)} plekken beschikbaar, en je probeert ${value} plekken te boeken`;
        }
        return true;
    };

    const handleChange = (event) => {
        // const {name, value} = event.target;
        // setBookingData((prevValues) => ({
        //     ...prevValues,
        //     [name]: value,
        // }));
    };

    function updateBooking(bookingId, amount, commentsCustomer, customerId, workshopId, sppotsAvailableWorkshop) {
        setToUpdateBookingData({
            booking: {
                bookingId,
                amount,
                commentsCustomer,
                customerId,
                workshopId,
                sppotsAvailableWorkshop
            }
        });
        setValue('bookingId', bookingId);
        setValue('amount', amount);
        setValue('commentsCustomer', commentsCustomer);
        setValue('workshopId', workshopId);

        openModalUpdateBooking();
    }


    async function deleteBooking(bookingId) {
        console.log("delete booking")
        closeModalDeleteCheck();
        toggleLoading(true);
        setError('');
        try {
            const response = await removeBooking(token, bookingId);
            console.log(response);
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
        toggleLoading(false);
        setToDeleteBookingId(null);
    }


    function openModalError() {
        setIsOpenError(true);
    }

    function afterOpenModalError() {
    }

    function closeModalError() {
        setIsOpenError(false);
    }

    function openModalUpdateBooking() {
        setIsOpenUpdateBooking(true);
    }

    function afterOpenModalUpdateBooking() {
    }

    function closeModalUpdateBooking() {
        setIsOpenUpdateBooking(false);
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


    return (
        <main className={`outer-container ${styles["all-bookings__outer-container"]}`}>
            <div className={`inner-container ${styles["all-bookings__inner-container"]}`}>
                <h1>{highestAuthority === 'admin' ? "Alle" : "Al mijn"} boekingen</h1>

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
                        <form className={styles["create-booking__form"]} onSubmit={handleSubmit(handleFormSubmit)}>

                            <InputField
                                type="number"
                                name="bookingId"
                                label="Boeking ID"
                                disabled="true"
                                register={register}
                                errors={errors}
                                validation={{
                                    disabled: true,
                                }}
                                value = {toUpdateBookingData.booking.bookingId}
                                // onChangeHandler={handleChange}
                            >
                            </InputField>
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
                                // value={toUpdateBookingData.booking.workshopId}
                                // onChangeHandler={handleChange}
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
                                    //TODO validate date workshop future
                                }
                                }
                                register={register}
                                errors={errors}
                                // value={toUpdateBookingData.booking.amount}
                                // onChangeHandler={handleChange}
                            >
                            </InputField>
                            <InputField
                                type="text"
                                name="comments"
                                label="Opmerkingen"
                                register={register}
                                errors={errors}
                                // value={toUpdateBookingData.booking.commentsCustomer}
                                // onChangeHandler={handleChange}
                            >
                            </InputField>

                            <Button
                                type="submit"
                            >Boeking plaatsen</Button>

                        </form>
                    </div>


                </CustomModal>

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

                <table className={styles["table__bookings"]}>
                    <thead>
                        <tr className={styles["table-header-row__bookings"]}>
                            <th>Boeking</th>
                            <th>Datum boeking</th>
                            <th>Aantal</th>
                            <th>Naam</th>
                            <th>Email</th>
                            <th>Opmerkingen klant</th>
                            <th>Totaal bedrag</th>
                            <th>Workshop</th>
                            <th>Titel workshop</th>
                            {(highestAuthority === 'admin' || highestAuthority === 'customer') &&
                                <>
                                    <th>Wijzigen</th>
                                    <th>Verwijderen</th>
                                </>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {bookingsData && bookingsData.map((booking) => {
                            return (<tr key={booking.id}>
                                    <td>{booking.id}</td>
                                    <td className={styles["date__booking"]}>{updateDateFormatShort(booking.dateOrder)}</td>
                                    <td>{booking.amount}</td>
                                    <td>{booking.firstNameCustomer} {booking.lastNameCustomer} </td>
                                    <td>{booking.emailCustomer}</td>
                                    <td>{booking.commentsCustomer}</td>
                                    <td>{booking.totalPrice} euro</td>
                                    <td>{booking.workshopId}</td>
                                    <td>{booking.workshopTitle}</td>

                                    {(highestAuthority === 'admin' || highestAuthority === 'customer') &&
                                        <>
                                            <td><Link className={styles["link"]}
                                                      to="#"
                                                // onClick={openModalUpdateBooking}
                                                      onClick={() => updateBooking(booking.id, booking.amount, booking.commentsCustomer, booking.customerId, booking.workshopId, booking.sppotsAvailableWorkshop)}
                                            ><NotePencil
                                                size={20}
                                                weight="regular"/></Link>
                                            </td>
                                            <td><Link className={styles["link"]} to="#"
                                                      onClick={() => checkDeleteBooking(booking.id)}><TrashSimple
                                                size={20}
                                                weight="regular"/></Link>
                                            </td>
                                        </>
                                    }

                                </tr>
                            )
                        })}
                    </tbody>
                </table>


            </div>
        </main>
    );
}

export default AllBookings;