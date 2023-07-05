import React, {useContext, useEffect, useState} from 'react';
import styles from "../profile/Profile.module.css";
import {AuthContext} from "../../context/AuthContext";
import InputField from "../../components/InputField/InputField";
import {useForm} from "react-hook-form";
import Button from "../../components/Button/Button";
import {Link, useNavigate} from "react-router-dom";
import {Camera, Check, Eye, EyeClosed, Image, X} from "@phosphor-icons/react";
import {
    fetchDataCustomer,
    fetchDataWorkshopOwner,
    signIn,
    updateCustomer,
    updateWorkshopOwner,
    uploadProfilePic
} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import Select from "react-select";
import Modal from 'react-modal';

function Profile() {

    const {login, user: {id, workshopowner}} = useContext(AuthContext);
    const token = localStorage.getItem('token');

    const [userData, setUserData] = useState(null);
    const [editProfile, toggleEditProfile] = useState(false);
    const {register, handleSubmit, formState: {errors}, reset} = useForm({mode: 'onTouched'});
    const [error, setError] = useState('');
    const [updateMessage, toggleUpdateMessage] = useState(false);
    const [userType, setUserType] = useState(workshopowner ? {
        value: true,
        label: "Workshop eigenaar"
    } : {value: false, label: "Consument"});
    const [file, setFile] = useState([]);
    const [previewUrl, setPreviewUrl] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const controller = new AbortController();

    const optionsUserType = [
        {value: false, label: "Consument"},
        {value: true, label: "Workshop eigenaar"}
    ];

    // ...................MODAL
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    //TODO below seems to be unneccesary?
    Modal.setAppElement('#root');


    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {

    }

    function closeModal() {
        setIsOpen(false);
        reset();
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

                    setUserData({
                        firstname: firstName,
                        lastname: lastName,
                        email: email,
                        profilepic: profilePicUrl,
                        companyname: companyName,
                        kvknumber: kvkNumber,
                        vatnumber: vatNumber,
                        workshopownerverified: workshopOwnerVerified
                    });
                } catch (e) {
                    setError(errorHandling(e));
                    console.log(error);
                }
            } else {
                try {
                    const {
                        firstName,
                        lastName,
                        email,
                        profilePicUrl,
                    } = await fetchDataCustomer(token, id);


                    setUserData({
                        firstname: firstName,
                        lastname: lastName,
                        email: email,
                        profilepic: profilePicUrl,
                    });
                } catch (e) {
                    setError(errorHandling(e));
                    console.log(error);
                }
            }

        }

        void fetchUserData();
        return function cleanup() {
            controller.abort();
        }
    }, []);


    const handleChange = (event) => {
        const {name, value} = event.target;
        setUserData((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    async function handleFormSubmit(data) {

        if (userType.value) {
            try {
                const response = await updateWorkshopOwner(token, id, data.firstname, data.lastname, data.email, data.password, data.companyname, data.kvknumber, data.vatnumber,
                    userType.value);
                if (response.status === 200) {
                    // after updating profile information (like workshopowner & email, which are part of the jwt token) the user needs to be automatically logged in again, in order to also update the jwt token to match new user details.
                    try {
                        const {jwt} = await signIn(data.email, data.password);
                        login(jwt);
                        toggleUpdateMessage(true);
                        setTimeout(() => {
                            toggleUpdateMessage(false);
                        }, 2000);
                        toggleEditProfile(false);
                    } catch (e) {
                        setError(errorHandling(e));
                    }
                }
            } catch (e) {
                setError(errorHandling(e));
            }

        } else {
            try {

                const response = await updateCustomer(token, id, data.firstname, data.lastname, data.email, data.password, userType.value);
                if (response.status === 200) {
                    // after updating profile information (like workshopowner & email, which are part of the jwt token) the user needs to be automatically logged in again, in order to also update the jwt token to match new user details.
                    try {
                        const {jwt} = await signIn(data.email, data.password);
                        console.log(jwt);
                        login(jwt);
                        toggleUpdateMessage(true);
                        setTimeout(() => {
                            toggleUpdateMessage(false);
                        }, 2000);
                        toggleEditProfile(false);


                    } catch (e) {
                        setError(errorHandling(e));
                    }

                }
            } catch (e) {
                setError(errorHandling(e));
            }
        }
    }

    function handleImageChange(e) {
        // Sla het gekozen bestand op
        const uploadedFile = e.target.files[0];
        console.log(uploadedFile);
        // Sla het gekozen bestand op in de state
        setFile(uploadedFile);
        // Sla de preview URL op zodat we deze kunnen laten zien in een <img>
        setPreviewUrl(URL.createObjectURL(uploadedFile));
    }

    async function sendImage(e) {
        // Voorkom een refresh op submit
        e.preventDefault();
        // maak een nieuw FormData object (ingebouwd type van JavaScript)
        const formData = new FormData();
        // Voeg daar ons bestand uit de state aan toe onder de key "file"
        formData.append("file", file);

        try {
            const response = await uploadProfilePic(token, id, formData);
            console.log(response);
            closeModal();
            reset();

            setUserData({
                ...userData,
                profilepic: response.data,
            });
            window.location.reload();

        } catch (e) {
            setError(errorHandling(e));
            console.log(error);
        }
    }


    return (
        <>


            <main className={`outer-container ${styles["profile__outer-container"]}`}>
                <div className={`inner-container ${styles["profile__inner-container"]}`}>

                    <div>
                        <Modal
                            isOpen={modalIsOpen}
                            onAfterOpen={afterOpenModal}
                            onRequestClose={closeModal}
                            style={customStyles}
                            contentLabel="Upload profile picture"
                        >
                            <div className={styles["top-row__upload-profile-picture"]}>
                            <h3>Afbeelding uploaden</h3>
                            <Link to="#" onClick={closeModal}><X size={18}/></Link>
                        </div>
                            <form className={styles["form__upload-profile-picture"]} onSubmit={sendImage}>
                                <label className={styles["label__input-field__profile-picture"]} htmlFor="profile-picture">
                                    Kies afbeelding:
                                    <input className={styles["input-field__profile-picture"]} type="file" name="profile-picture" id="profile-picture"
                                           onChange={handleImageChange}/>
                                </label>
                                {previewUrl &&
                                    <label className={styles["profile-picture__preview__label"]}>
                                        Preview:
                                        <img className={styles["profile-picture__preview"]} src={previewUrl} alt="Voorbeeld van de gekozen afbeelding"
                                             />
                                    </label>
                                }
                                <Button
                                    type="submit"
                                >Uploaden</Button>
                            </form>
                        </Modal>
                    </div>


                    <div className={styles["profile"]}>
                        <section className={styles["left-side__profile"]}>
                            {userData && userData.profilepic == null &&
                                <>
                                    <Link className={styles["link__upload-photo"]} to="#" onClick={openModal}><Camera
                                        className={styles["photo-icon"]} size={32}/>
                                        <p className={styles["placeholder-photo"]}>Upload een profielfoto</p></Link>
                                </>
                            }

                            {userData && userData.profilepic != null &&
                                <>
                                    <Link to="#" className={styles["link__upload-photo"]} onClick={openModal}><Camera
                                        className={styles["photo-icon"]} size={32}/></Link>
                                    <img className={styles["profile-pic"]} src={userData.profilepic}
                                         alt="Profielfoto"/>
                                </>
                            }
                            {userData && userData.workshopownerverified &&
                                <div className={styles["verification"]}>
                                    <Check size={20} color="#52B706"/>
                                    <p>Geverifieerd door administrator</p>
                                </div>
                            }

                            {!editProfile &&
                                <Button
                                    type="text"
                                    onClick={() => toggleEditProfile(true)}
                                >Wijzig profiel
                                </Button>
                            }


                        </section>

                        <section className={styles["profile-fields"]}>

                            {updateMessage && <h4>Je profiel is succesvol aangepast</h4>

                            }
                            <h1>Mijn Profiel</h1>

                            <form className={styles["profile__form"]} onSubmit={handleSubmit(handleFormSubmit)}>
                                {userData &&

                                    <div className={styles["profile-fields-personal"]}>

                                        <InputField
                                            type="text"
                                            name="firstname"
                                            label="Voornaam: "
                                            validation={{
                                                disabled: !editProfile,
                                                required:
                                                    {
                                                        value: true,
                                                        message: "Voornaam is verplicht",
                                                    }
                                            }
                                            }
                                            register={register}
                                            errors={errors}
                                            value={userData.firstname}
                                            onChange={handleChange}
                                        >
                                        </InputField>


                                        <InputField
                                            type="text"
                                            name="lastname"
                                            label="Achternaam: "
                                            validation={{
                                                disabled: !editProfile,
                                                required:
                                                    {
                                                        value: true,
                                                        message: "Achternaam is verplicht",
                                                    }
                                            }
                                            }
                                            register={register}
                                            errors={errors}
                                            value={userData.lastname}
                                            onChange={handleChange}
                                        >
                                        </InputField>

                                        <InputField
                                            type="text"
                                            name="email"
                                            label="Email: "
                                            validation={{
                                                disabled: !editProfile,
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
                                            value={userData.email}
                                            onChange={handleChange}
                                        >
                                        </InputField>
                                        {editProfile &&
                                            <>
                                                <InputField
                                                    classNameLabel="password-input-field"
                                                    type={showPassword? "text" : "password"}
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
                                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*?[\\!\\#\\@\\$\\%\\&\\/\\(\\)\\=\\?\\*\\-\\+\\_\\.\\:\\;\\,\\{\\}\\^])[A-Za-z0-9!#@$%&/()=?*+-_.:;,{}].+$/,
                                                            message: "Ongeldig wachtwoord. Het moet aan de volgende eisen voldoen: \n- Minimaal 1 kleine letter. \n- Minimaal 1 hoofdletter. \n- Minimaal 1 getal \n- Minimaal 1 symbool."
                                                        }
                                                    }
                                                    }
                                                    register={register}
                                                    errors={errors}
                                                    value={userData.password}
                                                    onChange={handleChange}
                                                    setShowPassword={setShowPassword}
                                                    showPassword={showPassword}
                                                >
                                                </InputField>
                                                <div className={styles["user-type__row"]}>
                                                    <h4 className={styles["user-type__label"]}>Consument/
                                                        workshop eigenaar: </h4>
                                                    <Select className={styles["user-type__dropdown"]}       defaultValue={userType} onChange={setUserType} options={optionsUserType}
                                                            isMulti={false}
                                                    />
                                                </div>
                                            </>


                                        }
                                    </div>
                                }

                                {userType.value &&
                                    <>
                                        {(userData && workshopowner) || (editProfile && userType.value) ?
                                            <div className={styles["profile-fields-company"]}>
                                                <InputField
                                                    type="text"
                                                    name="companyname"
                                                    label="Bedrijfsnaam: "
                                                    validation={{
                                                        disabled: !editProfile,
                                                        required:
                                                            {
                                                                value: true,
                                                                message: "Bedrijfsnaam is verplicht",
                                                            }
                                                    }
                                                    }
                                                    register={register}
                                                    errors={errors}
                                                    value={userData.companyname}
                                                    onChange={handleChange}
                                                >
                                                </InputField>


                                                <InputField
                                                    type="number"
                                                    name="kvknumber"
                                                    label="KvK nummer: "
                                                    validation={{
                                                        disabled: !editProfile,
                                                        required:
                                                            {
                                                                value: true,
                                                                message: "KvK nummer is verplicht en moet uit getallen bestaan",
                                                            }
                                                    }
                                                    }
                                                    register={register}
                                                    errors={errors}
                                                    value={userData.kvknumber}
                                                    onChange={handleChange}
                                                >
                                                </InputField>

                                                <InputField
                                                    type="text"
                                                    name="vatnumber"
                                                    label="BTW nummer: "
                                                    validation={{
                                                        disabled: !editProfile,
                                                        required:
                                                            {
                                                                value: true,
                                                                message: "BTW nummer is verplicht",
                                                            }
                                                    }
                                                    }
                                                    register={register}
                                                    errors={errors}
                                                    value={userData.vatnumber}
                                                    onChange={handleChange}
                                                >
                                                </InputField>


                                            </div> : null
                                        }

                                    </>
                                }
                                {editProfile &&
                                    <Button
                                        type="submit"
                                    >Verstuur
                                    </Button>
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

                    {/*TODO add wijzig password - dubbel veld?*/}

                </div>
            </main>

        </>
    )
        ;
}

export default Profile;