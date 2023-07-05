import React, {useContext, useEffect, useState} from 'react';
import styles from "./SignIn.module.css";
import {AuthContext} from "../../context/AuthContext";
import {useForm} from 'react-hook-form';
import Button from "../../components/Button/Button";
import {signIn} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";

//TODO check of met modal kan in navbar

function SignIn() {
    const {login} = useContext(AuthContext);

    const {register, formState: {errors}, handleSubmit} = useForm();
    const [error, toggleError] = useState('');
    const controller = new AbortController();

    //TODO styling main gaat niet goed  - zie achtergrond kleur en footer helemaal beneden
    //TODO wachtwoord vergeten - link naar registreren - validatie input field email

    useEffect(() => {

        return function cleanup() {
            controller.abort();
        }
    }, []);

    const handleFormSubmit = async (data) => {

        try {
            const {jwt} = await signIn(data.email, data.password);
            console.log(jwt);
            login(jwt, "/profiel");

        } catch (e) {
            toggleError(errorHandling(e));
            console.log(error);
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
    return (
        <>
            <main className={`outer-container ${styles["signin__outer-container"]}`}>
                <div className={`inner-container ${styles["" +
                "signin__inner-container"]}`}>
                    <h1>Inloggen</h1>

                    {/*TODO input field componenten van maken*/}

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

                        {error && <p className="error-message">{error}</p>}


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