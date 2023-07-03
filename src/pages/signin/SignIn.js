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

    // TODO password & email validation should match back-end : @NotBlank (message = "Email field shouldn't be empty.")
    //     @Email(regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}",
    //             flags = Pattern.Flag.CASE_INSENSITIVE, message = "This email doesn't meet e-mail requirements (@ symbol and .com/nl etc)")
    //     public String email;
    //     @NotBlank (message = "Password field shouldn't be empty.")
    //     @Pattern(regexp = "^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[\\!\\#\\@\\$\\%\\&\\/\\(\\)\\=\\?\\*\\-\\+\\_\\.\\:\\;\\,\\{\\}\\^])[A-Za-z0-9!#@$%&/()=?*+-_.:;,{}]{8,20}", message = "Password needs to contain the following: " +
    //             "1. Minimum of 1 lowercase letter. 2. Minimum of 1 uppercase letter. 3. Minimum of 1 number 4. Minimum of 1 symbol. 5. It should be between 8 and 20 characters long.")
    //     public String password;
    {/*TODO errors toevoegen bij verkeerde inloggegevens*/}
    return (
        <>
            <main className={`outer-container ${styles["signin__outer-container"]}`}>
                <div className={`inner-container ${styles["" +
                "signin__inner-container"]}`}>
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
                </div>
            </main>
        </>
    );
}

export default SignIn;