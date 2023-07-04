import React, {useContext, useEffect, useState} from 'react';
import styles from "../profile/Profile.module.css";
import {AuthContext} from "../../context/AuthContext";
import InputField from "../../components/InputField/InputField";
import {useForm} from "react-hook-form";
import Button from "../../components/Button/Button";
import {Link, useNavigate} from "react-router-dom";
import {Camera, Check, Image} from "@phosphor-icons/react";
import {fetchDataCustomer, fetchDataWorkshopOwner, signIn, updateCustomer, updateWorkshopOwner} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import Select from "react-select";

function Profile() {

    const {login, user: {id, authorities, workshopowner}} = useContext(AuthContext);
    const token = localStorage.getItem('token');

    const [userData, setUserData] = useState(null);
    const [editProfile, toggleEditProfile] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [error, setError] = useState('');
    const [updateMessage, toggleUpdateMessage] = useState(false);
    const [userType, setUserType] = useState(workshopowner ? {
        value: true,
        label: "Workshop eigenaar"
    } : {value: false, label: "Consument"});
    const navigate = useNavigate();
    const controller = new AbortController();

    const optionsUserType = [
        {value: false, label: "Consument"},
        {value: true, label: "Workshop eigenaar"}
    ];

    // console.log(userType);


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
//
//     // TODO re-usable try and catch block
//

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


    return (
        <>
            <main className={`outer-container ${styles["profile__outer-container"]}`}>
                <div className={`inner-container ${styles["profile__inner-container"]}`}>


                    <div className={styles["profile"]}>
                        <section className={styles["left-side__profile"]}>
                            {/*TODO placeholder voor als iemnad geen foto heeft*/}
                            {userData && userData.profilepic == null &&
                                <>
                                <Link className={styles["link__upload-photo"]} to="/uploadprofielfoto"><Camera className={styles["photo-icon"]} size={32} />
                                <p className={styles["placeholder-photo"]}>Upload een profielfoto</p></Link>
                                </>
                            }

                            {userData && userData.profilepic != null &&
                                <>
                                    <Link className={styles["link__upload-photo"]} to="/uploadprofielfoto"><Camera className={styles["photo-icon"]} size={32} /></Link>
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

                            {error && <p className="error-message">{error}</p>}

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
                                                        message: "Dit veld is verplicht",
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
                                                        message: "Dit veld is verplicht",
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
                                                        message: "Dit veld is verplicht",
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
                                                    type="password"
                                                    name="password"
                                                    label="Wachtwoord: "
                                                    validation={{
                                                        required:
                                                            {
                                                                value: true,
                                                                message: "Dit veld is verplicht",
                                                            }
                                                    }
                                                    }
                                                    register={register}
                                                    errors={errors}
                                                    value={userData.password}
                                                    onChange={handleChange}
                                                >
                                                </InputField>
                                                <div className={styles["user-type__row"]}>
                                                    <h4 className={styles["user-type__label"]}>Consument/
                                                        workshop eigenaar: </h4>
                                                    <Select className={styles["user-type__dropdown"]}
                                                            defaultValue={userType}
                                                            onChange={setUserType}
                                                            options={optionsUserType}
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
                                                                message: "Dit veld is verplicht",
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
                                                    type="text"
                                                    name="kvknumber"
                                                    label="KvK nummer: "
                                                    validation={{
                                                        disabled: !editProfile,
                                                        required:
                                                            {
                                                                value: true,
                                                                message: "Dit veld is verplicht",
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
                                                                message: "Dit veld is verplicht",
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


                    {/*TODO add wijzig profiel - input fields & wijzig password*/}

                </div>
            </main>

        </>
    )
        ;
}

export default Profile;