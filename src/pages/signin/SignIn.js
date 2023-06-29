import React, {useContext, useEffect, useState} from 'react';
import styles from "./SignIn.module.css";
import {AuthContext} from "../../context/AuthContext";
import {useForm} from 'react-hook-form';
import axios from "axios";
import Button from "../../components/Button/Button";

function SignIn() {
    const {login} = useContext(AuthContext);

    const {register, formState: {errors}, handleSubmit} = useForm();
    const controller = new AbortController();

    // useEffect(() => {
    //
    //     return function cleanup() {
    //         console.log("cleanup sign in aangeroepen")
    //         controller.abort();
    //     }
    // }, []);


    const handleFormSubmit = async (data) => {
        try {
            const response = await axios.post("http://localhost:8080/signin", {
                email: data.email,
                password: data.password
            }, {signal: controller.signal,});
            console.log(response.data.jwt);
            login(response.data.jwt, "/");

        } catch (data) {
            console.error("Onjuist email en wachtwoord combinatie", data);
        }
    }

    return (
        <>
            <main className={styles["main-login"]}>

                <h1>Inloggen</h1>

                <form className={styles["form"]} onSubmit={handleSubmit(handleFormSubmit)}>
                    <label htmlFor="email-field">
                        Email:
                        <input
                            type="text"
                            id="email-field"
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: 'Dit veld is verplicht',
                                },
                                validate: (value) => value.includes('@') || 'Email moet een @ bevatten',
                            })}
                        />
                        {errors.email && <p>{errors.email.message}</p>}
                    </label>
                    <label htmlFor="password-field">
                        Wachtwoord:
                        <input
                            type="password"
                            id="password-field"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: 'Dit veld is verplicht',
                                }
                            })}
                        />
                        {errors.password && <p>{errors.password.message}</p>}
                    </label>

                    {/*button component van maken*/}

                    <Button
                        type="submit"
                    >Inloggen</Button>

                </form>

                <p>Wachtwoord vergeten?</p>
                <p>Heb je nog geen account? Registreer je dan eerst.</p>

                 {/*TODO add wachtwoord vergeten linkt en registreer link, add styling, add inner outer container etc, add capslock on password, and add view password button*/}
                 {/*TODO error als verkeerde inloggegevens*/}

            </main>
        </>
    );
}

export default SignIn;