import React, {useContext, useEffect, useState} from 'react';
import styles from "../profile/Profile.module.css";
import {AuthContext} from "../../context/AuthContext";
import InputField from "../../components/InputField/InputField";
import {useForm} from "react-hook-form";
import Button from "../../components/Button/Button";
import {Link, useNavigate} from "react-router-dom";
import {Camera, Check} from "@phosphor-icons/react";
import {
    fetchDataCustomer,
    fetchDataWorkshopOwner, resetPasswordLoggedIn,
    updateCustomer,
    updateWorkshopOwner,
    uploadProfilePic
} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import Select from "react-select";
import CustomModal from "../../components/CustomModal/CustomModal";

function Profile() {

    const {login, user: {id, workshopowner}} = useContext(AuthContext);
    const token = localStorage.getItem('token');

    const [userData, setUserData] = useState(null);
    const [editProfile, toggleEditProfile] = useState(false);
    const [needToUpdateProfile, toggleNeedToUpdateProfile] = useState(false);
    const {register, handleSubmit, setValue, formState: {errors}, reset} = useForm({mode: 'onBlur'});
    const {
        register: registerResetPassword,
        handleSubmit: handleSubmitResetPassword,
        formState: {errors: errorsResetPassword},
        reset: resetResetPassword
    } = useForm({mode: 'onBlur'});
    const [error, setError] = useState('');
    const [userType, setUserType] = useState(workshopowner ? {
        value: true,
        label: "Workshop eigenaar"
    } : {value: false, label: "Consument"});
    const [file, setFile] = useState([]);
    const [previewUrl, setPreviewUrl] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalIsOpenUpdateProfile, setIsOpenUpdateProfile] = React.useState(false);
    const [modalIsOpenResetPassword, setIsOpenResetPassword] = React.useState(false);
    const [modalIsOpenUpdatePassword, setIsOpenUpdatePassword] = React.useState(false);

    const navigate = useNavigate();
    const controller = new AbortController();

    const optionsUserType = [
        {value: false, label: "Consument"},
        {value: true, label: "Workshop eigenaar"}
    ];

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
        setIsOpen(false);
        setPreviewUrl('');
    }

    function openModalUpdateProfile() {
        setIsOpenUpdateProfile(true);
    }

    function afterOpenModalUpdateProfile() {
    }

    function closeModalUpdateProfile() {
        setIsOpenUpdateProfile(false);
    }

    function openModalUpdatePassword() {
        setIsOpenUpdatePassword(true);
    }

    function afterOpenModalUpdatePassword() {
    }

    function closeModalUpdatePassword() {
        setIsOpenUpdatePassword(false);
    }

    function openModalResetPassword() {
        setIsOpenResetPassword(true);
    }

    function afterOpenModalResetPassword() {
    }

    function closeModalResetPassword() {
        setIsOpenResetPassword(false);
        resetResetPassword();
    }

    useEffect(() => {
        async function fetchUserData() {
            if (workshopowner) {
                try {
                    const {
                        firstName,
                        lastName,
                        email,
                        profilePicUrl,
                        companyName,
                        kvkNumber,
                        vatNumber,
                        workshopOwnerVerified
                    } = await fetchDataWorkshopOwner(token, id);

                    setValue('firstName', firstName);
                    setValue('lastName', lastName);
                    setValue('email', email);
                    setValue('companyName', companyName);
                    setValue('kvkNumber', kvkNumber);
                    setValue('vatNumber', vatNumber);

                    setUserData({
                        profilepic: profilePicUrl,
                        workshopownerverified: workshopOwnerVerified
                    });
                    setError('');
                } catch (e) {
                    console.error(e);
                    setError(errorHandling(e));
                }
            } else {
                try {
                    const {
                        firstName,
                        lastName,
                        email,
                        profilePicUrl,
                    } = await fetchDataCustomer(token, id);

                    setValue('firstName', firstName);
                    setValue('lastName', lastName);
                    setValue('email', email);

                    setUserData({
                        profilepic: profilePicUrl,
                    });
                    setError('');
                } catch (e) {
                    console.error(e);
                    setError(errorHandling(e));
                }
            }
        }

        void fetchUserData();
        return function cleanup() {
            controller.abort();
        }
    }, [needToUpdateProfile]);

    async function handleFormSubmit(data) {
        setError('');
        try {
            let response;
            if (userType.value) {
                response = await updateWorkshopOwner(token, id, data.firstName, data.lastName, data.email, data.companyName, data.kvkNumber, data.vatNumber,
                    userType.value);
            } else {
                response = await updateCustomer(token, id, data.firstName, data.lastName, data.email, userType.value);
            }
            try {
                login(response.jwt);
                openModalUpdateProfile();
                setTimeout(() => {
                    closeModalUpdateProfile();
                }, 2000);
                toggleEditProfile(false);
            } catch (e) {
                console.error(e);
                setError(errorHandling(e));
            }
        } catch (e) {
            console.error(e);
            setError(errorHandling(e));
        }
    }

    function handleImageChange(e) {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        setPreviewUrl(URL.createObjectURL(uploadedFile));
    }

    async function sendImage(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await uploadProfilePic(token, id, formData);
            closeModal();
            setUserData({
                ...userData,
                profilepic: response.data,
            });
            window.location.reload();
        } catch (e) {
            console.error(e);
            setError(errorHandling(e));
        }
    }

    async function handleFormSubmitResetPassword(data) {

        try {
            await resetPasswordLoggedIn(token, data.email, data.password);
            closeModalResetPassword();
            openModalUpdatePassword();
            setTimeout(() => {
                closeModalUpdatePassword();
            }, 2000);
        } catch (e) {
            console.error(e);
            setError(errorHandling(e));
            setTimeout(() => {
                setError('');
            }, 4000);
        }
    }

    function cancelEditProfile() {
        toggleNeedToUpdateProfile(!needToUpdateProfile);
        reset();
        toggleEditProfile(false);
    }

    return (
        <main className={`outer-container ${styles["profile__outer-container"]}`}>
            <div className={`inner-container ${styles["profile__inner-container"]}`}>
                <div>
                    <CustomModal
                        modalIsOpen={modalIsOpenUpdateProfile}
                        afterOpenModal={afterOpenModalUpdateProfile}
                        closeModal={closeModalUpdateProfile}
                        contentLabel="Update profile successful"
                        updateHeader="Je profiel is succesvol aangepast"
                    ></CustomModal>

                    <CustomModal
                        modalIsOpen={modalIsOpenResetPassword}
                        afterOpenModal={afterOpenModalResetPassword}
                        closeModal={closeModalResetPassword}
                        contentLabel="Reset Password"
                        functionalModalHeader="Wachtwoord wijzigen"
                    >
                        <h4 className={styles["content__modal__reset-password"]}>Vul hieronder je e-mailadres in en
                            een
                            nieuw wachtwoord.</h4>
                        <form className={styles["reset-password__form"]}
                              onSubmit={handleSubmitResetPassword(handleFormSubmitResetPassword)}>
                            <InputField
                                type="text"
                                name="email"
                                label="Email: "
                                validation={{
                                    required:
                                        {
                                            value: true,
                                            message: "E-mail is verplicht",
                                        }, pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i,
                                        message: "Vul een geldig e-mailadres in"
                                    }
                                }}
                                register={registerResetPassword}
                                errors={errorsResetPassword}
                            >
                            </InputField>
                            <InputField classNameLabel="password-input-field"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        label="Wachtwoord: "
                                        validation={{
                                            required:
                                                {
                                                    value: true,
                                                    message: "Wachtwoord is verplicht",
                                                },
                                            minLength: {
                                                value: 8,
                                                message: 'Wachtwoord moet minstens 8 karakters lang zijn',
                                            },
                                            maxLength: {
                                                value: 20,
                                                message: 'Wachtwoord mag niet meer dan 20 karakters lang zijn',
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*?[!#@$%&\/()=?*\-+_.:;,{}^\[\]])[A-Za-z0-9!#@$%&/()=?*+\-\[\]_.:;,{}].+$/,
                                                message: "Ongeldig wachtwoord. Het moet aan de volgende eisen voldoen: \n- Minimaal 1 kleine letter. \n- Minimaal 1 hoofdletter. \n- Minimaal 1 getal \n- Minimaal 1 symbool."
                                            }
                                        }
                                        }
                                        register={registerResetPassword}
                                        errors={errorsResetPassword}
                                        setShowPassword={setShowPassword}
                                        showPassword={showPassword}
                            >
                            </InputField>
                            {error && <p className="error-message">{error}</p>}
                            <Button
                                type="submit"
                            >Verstuur</Button>
                        </form>
                    </CustomModal>

                    <CustomModal
                        modalIsOpen={modalIsOpenUpdatePassword}
                        afterOpenModal={afterOpenModalUpdatePassword}
                        closeModal={closeModalUpdatePassword}
                        contentLabel="Update password successful"
                        updateHeader="Je wachtwoord is succesvol aangepast"
                    ></CustomModal>

                    <CustomModal
                        modalIsOpen={modalIsOpen}
                        afterOpenModal={afterOpenModal}
                        closeModal={closeModal}
                        contentLabel="Upload profile picture"
                        functionalModalHeader="Afbeelding uploaden"
                    >
                        <form className={styles["form__upload-profile-picture"]} onSubmit={sendImage}>
                            <label className={styles["label__input-field__profile-picture"]}
                                   htmlFor="profile-picture">
                                Kies afbeelding:
                                <input className={styles["input-field__profile-picture"]} type="file"
                                       name="profile-picture" id="profile-picture"
                                       onChange={handleImageChange}/>
                            </label>
                            {previewUrl &&
                                <label className={styles["profile-picture__preview__label"]}>
                                    Preview:
                                    <img className={styles["profile-picture__preview"]} src={previewUrl}
                                         alt="Voorbeeld van de gekozen afbeelding"
                                    />
                                </label>
                            }
                            <Button
                                type="submit"
                            >Uploaden</Button>
                        </form>
                    </CustomModal>
                </div>

                <div className={styles["profile"]}>
                    <aside className={styles["left-side__profile"]}>
                        {userData &&
                            <>
                                <Link
                                    aria-label="link__upload-profile-photo"
                                    className={styles["link__upload-photo"]} to="#" onClick={openModal}><Camera
                                    className={userData.profilepic != null ? styles["photo-icon__profile-pic"] : styles["photo-icon__placeholder"]}
                                    size={32}/>
                                    {userData.profilepic == null &&
                                        <p className={styles["placeholder-photo"]}>Upload een profielfoto</p>
                                    }
                                </Link>
                                {userData.profilepic != null &&
                                    <img className={styles["profile-pic"]} src={userData.profilepic}
                                         alt="Profielfoto"/>
                                }
                            </>
                        }

                        {userData && userData.workshopownerverified &&
                            <div className={styles["verification"]}>
                                <Check size={20} color="#52B706"/>
                                <p>Geverifieerd door administrator</p>
                            </div>
                        }

                        {!editProfile &&
                            <>
                                <Button
                                    type="text"
                                    onClick={openModalResetPassword}
                                >Wijzig wachtwoord
                                </Button>
                                <Button
                                    type="text"
                                    onClick={() => toggleEditProfile(true)}
                                >Wijzig profiel
                                </Button>
                            </>
                        }

                    </aside>

                    <section className={styles["profile-fields"]}>

                        <h1>Mijn Profiel</h1>

                        <form className={styles["profile__form"]} onSubmit={handleSubmit(handleFormSubmit)}>
                            {userData &&

                                <div className={styles["profile-fields-personal"]}>
                                    <InputField
                                        type="text"
                                        name="firstName"
                                        label="Voornaam: "
                                        readOnly={!editProfile}
                                        validation={{
                                            required:
                                                {
                                                    value: true,
                                                    message: "Voornaam is verplicht",
                                                }
                                        }
                                        }
                                        register={register}
                                        errors={errors}
                                    >
                                    </InputField>


                                    <InputField
                                        type="text"
                                        name="lastName"
                                        label="Achternaam: "
                                        readOnly={!editProfile}
                                        validation={{
                                            required:
                                                {
                                                    value: true,
                                                    message: "Achternaam is verplicht",
                                                }
                                        }
                                        }
                                        register={register}
                                        errors={errors}
                                    >
                                    </InputField>

                                    <InputField
                                        type="text"
                                        name="email"
                                        label="Email: "
                                        readOnly={!editProfile}
                                        validation={{
                                            required:
                                                {
                                                    value: true,
                                                    message: "E-mail is verplicht",
                                                }, pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i,
                                                message: "Vul een geldig e-mailadres in"
                                            }
                                        }
                                        }
                                        register={register}
                                        errors={errors}
                                    >
                                    </InputField>
                                    {editProfile &&
                                        <label
                                            className={`select-dropdown ${styles["user-type__label"]}`}>Consument/
                                            workshop eigenaar:
                                            <Select className={styles["user-type__dropdown"]}
                                                    defaultValue={userType}
                                                    onChange={setUserType}
                                                    options={optionsUserType}
                                                    isMulti={false}
                                            />
                                        </label>
                                    }
                                </div>
                            }
                            {userType.value &&
                                <>
                                    {(userData && workshopowner) || (editProfile && userType.value) ?
                                        <div className={styles["profile-fields-company"]}>
                                            <InputField
                                                type="text"
                                                name="companyName"
                                                label="Bedrijfsnaam: "
                                                readOnly={!editProfile}
                                                validation={{
                                                    required:
                                                        {
                                                            value: true,
                                                            message: "Bedrijfsnaam is verplicht",
                                                        }
                                                }
                                                }
                                                register={register}
                                                errors={errors}
                                            >
                                            </InputField>


                                            <InputField
                                                type="number"
                                                name="kvkNumber"
                                                label="KvK nummer: "
                                                readOnly={!editProfile}
                                                validation={{
                                                    required:
                                                        {
                                                            value: true,
                                                            message: "KvK nummer is verplicht en moet uit getallen bestaan",
                                                        },
                                                    maxLength: {
                                                        value: 10,
                                                        message: 'KvK nummer mag niet meer dan 10 getallen zijn',
                                                    },
                                                }
                                                }
                                                register={register}
                                                errors={errors}
                                            >
                                            </InputField>

                                            <InputField
                                                type="text"
                                                name="vatNumber"
                                                label="BTW nummer: "
                                                readOnly={!editProfile}
                                                register={register}
                                                errors={errors}
                                            >
                                            </InputField>
                                        </div> : null
                                    }
                                </>
                            }
                            {editProfile &&
                                <>
                                    <Button
                                        type="submit"
                                    >Verstuur
                                    </Button>
                                    <Button
                                        type="text"
                                        onClick={() => cancelEditProfile()}
                                    >Annuleren
                                    </Button>
                                </>
                            }
                            {error && <p className="error-message">{error}</p>}
                        </form>

                    </section>

                </div>

                {userData && !editProfile &&
                    <div>
                        {workshopowner &&
                            <div>
                                {userData.workshopownerverified ?
                                    <div className={styles["button"]}>
                                        <Button
                                            type="button"
                                            onClick={() => navigate(`/nieuweworkshop`)}

                                        >
                                            Maak nieuwe workshop aan

                                        </Button>

                                    </div> :
                                    <div>
                                        <p>Je profiel is nog niet geverifieerd door de administrator</p>
                                        <p>Na verificatie kun je workshops aanmaken</p>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                }
            </div>
        </main>
    )
        ;
}

export default Profile;