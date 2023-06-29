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

function Profile() {

    const {user: {id, authorities, workshopowner}} = useContext(AuthContext);

    const [userData, setUserData] = useState(null);

    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onTouched"});

    const navigate = useNavigate();

    // const controller = new AbortController();

    const token = localStorage.getItem('token');


    useEffect(() => {
        async function fetchUserData() {

            if (workshopowner) {
                try {
                    const {
                        data: {
                            firstName,
                            lastName,
                            email,
                            companyName,
                            kvkNumber,
                            vatNumber,
                            workshopOwnerVerified
                        }
                    } = await axios.get(`http://localhost:8080/users/workshopowner/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        // signal: controller.signal,
                    });

                    console.log(firstName, lastName, email, workshopOwnerVerified, companyName, kvkNumber, vatNumber);
                    setUserData({
                        firstname: firstName,
                        lastname: lastName,
                        email: email,
                        companyname: companyName,
                        kvknumber: kvkNumber,
                        vatnumber: vatNumber,
                        workshopownerverified: workshopOwnerVerified
                    })

                } catch (e) {
                    console.log(e);
                }

            } else {
                try {
                    const {
                        data: {
                            firstName,
                            lastName,
                            email
                        }
                    } = await axios.get(`http://localhost:8080/users/customer/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        // signal: controller.signal,
                    });
                    console.log(firstName, lastName, email);
                    setUserData({
                        firstname: firstName,
                        lastname: lastName,
                        email: email
                    })

                } catch (e) {
                    console.log(e);
                }

            }


        }

        // TODO re-usable try and catch block
        // TODO js file for all api requests


        void fetchUserData();

        // return function cleanup() {
        //     console.log("cleanup profile aangeroepen")
        //     controller.abort();
        // }

    }, [])


    return (
        <>
            <main className={`outer-container ${styles["profile__outer-container"]}`}>
                <div className={`inner-container ${styles["profile__inner-container"]}`}>

                    {/* TODO change pic to profile pic*/}
                    <div className={styles["profile"]}>
                        <section className={styles["left-side__profile"]}>
                            <img className={styles["profile-pic"]} src={bakken1} alt="Profielfoto"/>
                            {userData && userData.workshopownerverified &&
                                <div className={styles["verification"]}>
                                    <Check size={20} color="#52B706"/>
                                    <p>Profiel geverifieerd door administrator</p>
                                </div>
                            }
                            <Button
                                type="button"
                                //TODO onclick toevoegen
                            >
                                Wijzig profiel
                            </Button>

                        </section>

                        <section className={styles["profile-fields"]}>
                            <h1>Mijn Profiel</h1>

                            {userData &&

                                <div className={styles["profile-fields-personal"]}>

                                    <InputField
                                        type="text"
                                        name="first-name"
                                        label="Voornaam: "
                                        readOnly="readOnly"
                                        register={register}
                                        errors={errors}
                                        value={userData.firstname}
                                    >
                                    </InputField>


                                    <InputField
                                        type="text"
                                        name="last-name"
                                        label="Achternaam: "
                                        readOnly="readOnly"
                                        register={register}
                                        errors={errors}
                                        value={userData.lastname}
                                    >
                                    </InputField>

                                    <InputField
                                        type="text"
                                        name="email"
                                        label="Email: "
                                        readOnly="readOnly"
                                        register={register}
                                        errors={errors}
                                        value={userData.email}
                                    >
                                    </InputField>
                                </div>

                            }

                            {userData && workshopowner &&
                                <div className={styles["profile-fields-company"]}>
                                    <InputField
                                        type="text"
                                        name="company-name"
                                        label="Bedrijfsnaam: "
                                        readOnly="readOnly"
                                        register={register}
                                        errors={errors}
                                        value={userData.companyname}
                                    >
                                    </InputField>


                                    <InputField
                                        type="text"
                                        name="kvk-number"
                                        label="KvK nummer: "
                                        readOnly="readOnly"
                                        register={register}
                                        errors={errors}
                                        value={userData.kvknumber}
                                    >
                                    </InputField>

                                    <InputField
                                        type="text"
                                        name="vat-number"
                                        label="BTW nummer: "
                                        readOnly="readOnly"
                                        register={register}
                                        errors={errors}
                                        value={userData.vatnumber}
                                    >
                                    </InputField>

                                </div>
                            }


                        </section>
                    </div>

                    {userData && userData.workshopownerverified &&
                        <div className={styles["button"]}>
                            <Button
                                type="button"
                                onClick={() => navigate(`/nieuweworkshop`)}

                            >
                                Maak nieuwe workshop aan

                            </Button>

                        </div>
                    }


                    {/*TODO add wijzig profiel - input fields & wijzig password*/}

                </div>
            </main>

        </>
    );
}

export default Profile;