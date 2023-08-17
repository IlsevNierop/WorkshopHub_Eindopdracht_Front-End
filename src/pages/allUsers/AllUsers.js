import React, {useEffect, useState} from 'react';
import styles from "./AllUsers.module.css";
import {Link} from "react-router-dom";
import {fetchAllUsers, verifyWorkshopOwnerByAdmin} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import CustomModal from "../../components/CustomModal/CustomModal";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import {useForm} from "react-hook-form";
import Select from "react-select";
import {sortArrayAllUsers} from "../../helper/sortArrayAllUsers";

function AllUsers() {
    const token = localStorage.getItem('token');

    const {register, handleSubmit, formState: {errors}, reset} = useForm({mode: 'onBlur'});


    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [needUpdateUsersData, toggleNeedUpdateUsersData] = useState(false);

    const [sortValue, setSortValue] = useState([]);

    const [modalIsOpenError, setIsOpenError] = useState(false);
    const [modalIsOpenVerifySuccessful, setIsOpenVerifySuccessful] = useState(false);
    const [modalIsOpenVerifyWorkshopOwner, setIsOpenVerifyWorkshopOwner] = useState(false);
    const [toVerifyWorkshopOwnerId, setToVerifyWorkshopOwnerId] = useState(null);

    const controller = new AbortController();

    const optionsSortValue =
        [
            {value: 'userId', label: 'Gebruikers ID'},
            {value: 'firstName', label: 'Voornaam'},
            {value: 'verified', label: 'Geverifieerd'},
        ];


    useEffect(() => {
        async function getAllUsers() {
            toggleLoading(true);
            setError('');
            try {
                const response = await fetchAllUsers(token);
                setUsersData(response);
                setError('');

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

        void getAllUsers();

        return function cleanup() {
            controller.abort();
        }
    }, [needUpdateUsersData]);

    useEffect(() => {
        setUsersData(sortArrayAllUsers(usersData, sortValue.value));
    }, [sortValue]);


    async function handleFormSubmit(data) {
        console.log(data)
        setError('');

        try {
            const response = await verifyWorkshopOwnerByAdmin(token, toVerifyWorkshopOwnerId, data.verify);
            setError('');
            closeModalVerifyWorkshopOwner();
            toggleNeedUpdateUsersData(!needUpdateUsersData);
            openModalVerifySuccessful();
            setTimeout(() => {
                closeModalVerifySuccessful();
            }, 4000);

        } catch (e) {
            setError(errorHandling(e));
            openModalError();
            setTimeout(() => {
                closeModalError();
            }, 4000);
            console.log(error);
        }

    }

    function verifyWorkshopOwner(workshopOwnerId) {
        openModalVerifyWorkshopOwner();
        setToVerifyWorkshopOwnerId(workshopOwnerId);
    }

    function openModalError() {
        setIsOpenError(true);
    }

    function afterOpenModalError() {
    }

    function closeModalError() {
        setIsOpenError(false);
    }

    function openModalVerifySuccessful() {
        setIsOpenVerifySuccessful(true);
    }

    function afterModalVerifySuccessful() {
    }

    function closeModalVerifySuccessful() {
        setIsOpenVerifySuccessful(false);
    }

    function openModalVerifyWorkshopOwner() {
        setIsOpenVerifyWorkshopOwner(true);
    }

    function afterOpenModalVerifyWorkshopOwner() {
    }

    function closeModalVerifyWorkshopOwner() {
        setIsOpenVerifyWorkshopOwner(false);
        setToVerifyWorkshopOwnerId(null);
        reset();
    }


    return (
        <main className={`outer-container ${styles["all-users__outer-container"]}`}>
            <div className={`inner-container ${styles["all-users__inner-container"]}`}>

                <h1>Alle gebruikers</h1>

                {loading &&
                    <p>Loading...</p>}

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
                    modalIsOpen={modalIsOpenVerifySuccessful}
                    afterOpenModal={afterModalVerifySuccessful}
                    closeModal={closeModalVerifySuccessful}
                    contentLabel="Verify workshop owner successful"
                    updateHeader={`De workshop eigenaar is succesvol afgekeurd of geverifieerd`}
                ></CustomModal>

                <CustomModal
                    modalIsOpen={modalIsOpenVerifyWorkshopOwner}
                    afterOpenModal={afterOpenModalVerifyWorkshopOwner}
                    closeModal={closeModalVerifyWorkshopOwner}
                    contentLabel="Verify workshop owner"
                    functionalModalHeader={`Keur deze workshop eigenaar goed of af`}
                >

                    <div className={styles["verify-workshopowner__modal"]}>
                        <form className={styles["verify-workshopowner__form"]}
                              onSubmit={handleSubmit(handleFormSubmit)}>
                            <label htmlFor="verify">Goed of afkeuren van workshop eigenaar met
                                ID: {toVerifyWorkshopOwnerId}
                                <div className={styles["workshop-owner-verified-radio-checkboxes"]}>

                                    <InputField
                                        classNameInputField="radio-checkbox__verify"
                                        classNameLabel="label__radio-checkbox__verify"
                                        name="verify"
                                        type="radio"
                                        value={true}
                                        validation={{
                                            required:
                                                {
                                                    value: true,
                                                    message: "Het is verplicht de workshop eigenaar goed of af te keuren. ",
                                                }
                                        }
                                        }
                                        register={register}
                                        errors={errors}
                                    >
                                        Goedkeuren
                                    </InputField>
                                    <InputField
                                        classNameInputField="radio-checkbox__verify"
                                        classNameLabel="label__radio-checkbox__verify"
                                        name="verify"
                                        type="radio"
                                        value={false}
                                        validation={{
                                            required:
                                                {
                                                    value: true,
                                                    message: "Het is verplicht de workshop eigenaar goed of af te keuren. ",
                                                }
                                        }
                                        }
                                        register={register}
                                        errors={errors}
                                    >
                                        Afkeuren
                                    </InputField>
                                </div>
                            </label>


                            <Button
                                type="submit"
                            >Verstuur</Button>
                        </form>
                    </div>
                </CustomModal>

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

                <table className={"table"}>
                    <thead>
                        <tr className={"table-header-row"}>
                            <th>Gebruikers ID</th>
                            <th>Profielfoto</th>
                            <th>Naam</th>
                            <th>Email</th>
                            <th>Workshop eigenaar</th>
                            <th>Bedrijf</th>
                            <th>KvK Nummer</th>
                            <th>Vat Nummer</th>
                            <th>Eigenaar geverifieerd</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersData && usersData.map((user) => {
                            return (<tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.profilePicUrl &&
                                    <img className={styles["profile-pic"]} src={user.profilePicUrl}
                                         alt={user.firstName}/>}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.workshopOwner ? "Workshop eigenaar" : "Klant"}</td>
                                <td>{user.companyName}</td>
                                <td>{user.kvkNumber}</td>
                                <td>{user.vatNumber}</td>
                                <td className={user.workshopOwnerVerified ? "td-verified" : "td-not-verified"}>{
                                    user.workshopOwner &&
                                    (user.workshopOwnerVerified ?
                                        (
                                            "Geverifieerd"
                                        ) :
                                        user.workshopOwnerVerified === false ?
                                            <Link
                                                className={"link-table-text-not-verified"}
                                                to="#"
                                                onClick={() => verifyWorkshopOwner(user.id, true)}
                                            >
                                                Afgekeurd (direct verifieren)
                                            </Link>
                                            :
                                            (
                                                <Link
                                                    className={"link-table-text"}
                                                    to="#"
                                                    onClick={() => verifyWorkshopOwner(user.id, true)}
                                                >
                                                    Verifieren
                                                </Link>
                                            ))}</td>
                            </tr>)
                        })}
                    </tbody>
                </table>

            </div>
        </main>
    );
}

export default AllUsers;