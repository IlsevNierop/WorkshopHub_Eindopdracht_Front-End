import React, {useContext, useEffect, useState} from 'react';
import styles from "../profile/Profile.module.css";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
import InputField from "../../components/InputField/InputField";
import {useForm} from "react-hook-form";
import Button from "../../components/Button/Button";
import {useNavigate} from "react-router-dom";
import {Check} from "@phosphor-icons/react";
import bakken1 from "../../assets/temppicsworkshop/Bakken1.jpg";
import {fetchDataCustomer, fetchDataWorkshopOwner, updateCustomer, updateWorkshopOwner} from "../../api/api";

function Profile() {

    const {user: {id, authorities, workshopowner}} = useContext(AuthContext);

    const [userData, setUserData] = useState(null);
    const [editProfile, toggleEditProfile] = useState(false);
    // const [editedValues, setEditedValues] = useState({
    //     firstname: userData.firstname,
    //     lastname: userData.lastname,
    //     email: userData.email,
    //     companyname: userData.companyname,
    //     kvknumber: userData.kvknumber,
    //     vatnumber: userData.vatnumber,
    // });


    const handleChange = (event) => {
        const {name, value} = event.target;
        setUserData((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));

        // setEditedValues((prevValues) => ({
        //     ...prevValues,
        //     [name]: value,
        // }));
    };

    const {register, handleSubmit, formState: {errors}} = useForm();

    const navigate = useNavigate();

    // const controller = new AbortController();

    const token = localStorage.getItem('token');

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
                        console.log(e);
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
                        console.log(e);
                    }
                }

            }

            void fetchUserData();
            // return function cleanup() {
//     //     console.log("cleanup profile aangeroepen")
//     //     controller.abort();
//     // }
        }, []
    );
//
//     // TODO re-usable try and catch block
//     // TODO js file for all api requests
//

    async function handleFormSubmit(data) {
        console.log(data)

        if (workshopowner) {
            try {
                const response = await updateWorkshopOwner(token, id, data.firstname, data.lastname, data.email, data.companyname, data.kvknumber, data.vatnumber, workshopowner);

            } catch (e) {
                console.log(e);
            }

        } else {
            try {

                const response = await updateCustomer(token, id, data.firstname, data.lastname, data.email, workshopowner);

            } catch (e) {
                console.log(e);
            }

        }
        window.location.reload();
    }


    return (
        <>
            <main className={`outer-container ${styles["profile__outer-container"]}`}>
                <div className={`inner-container ${styles["profile__inner-container"]}`}>

                    {/* TODO change pic to profile pic*/}

                    <div className={styles["profile"]}>
                        <section className={styles["left-side__profile"]}>
                            {/*TODO placeholder voor als iemnad geen foto heeft*/}
                            {userData && userData.profilepic != null &&
                                <img className={styles["profile-pic"]} src={userData.profilepic} alt="Profielfoto"/>}
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
                            <h1>Mijn Profiel</h1>

                            <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                                    </div>

                                }

                                {userData && workshopowner &&
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


                                    </div>
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
    );
}

export default Profile;