import React, {useContext, useState} from 'react';
import {NavLink} from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "../../../../workshophub-eindopdracht/src/assets/logo-default.svg";
import {Heart, X} from "@phosphor-icons/react";
import {AuthContext} from "../../context/AuthContext";
import {navLinks} from "./navLinks";
import Modal from "react-modal";
import {useForm} from "react-hook-form";
import {signIn} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import SignIn from "../SignIn/SignIn";

function NavBar() {


    const {isAuth, user, logout, login} = useContext(AuthContext);
    const {register, handleSubmit, formState: {errors}, reset} = useForm({mode: 'onTouched'});
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    // ...................MODAL
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            overlay: {zIndex: 1000}
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
        setError('');
        setShowPassword(false);
        reset();
    }

    async function handleFormSubmit(data) {
        //React hook form should take care of prevent default, but for some reason, the page refreshes on pressing enter.
        // data.preventDefault();
        setError('');
        try {
            const {jwt} = await signIn(data.email, data.password);
            reset();
            login(jwt, "/profiel");
            closeModal();

        } catch (e) {
            setError(errorHandling(e));
            console.log(error);
        }
    }


    return (
        <>
            <div className={`outer-container ${styles["nav-outer-top"]}`}>
                <nav className={`inner-container ${styles["nav-inner-top"]}`}>
                    <NavLink to="/"><img src={logo} alt="WorkshopHub logo"/>
                    </NavLink>
                    <ul className={styles["nav-ul-top"]}>

                        {!isAuth && <li className={styles["nav-li-top"]}>
                            <NavLink
                                className={styles['default-nav-link']}
                                to="#" onClick={openModal}>Inloggen</NavLink>
                        </li>}

                        {isAuth && <li className={styles["nav-li-top"]}>
                            <NavLink className={styles['default-nav-link']}
                                     to="/" onClick={() => logout()}>
                                Uitloggen</NavLink></li>}

                        <li className={styles["nav-li"]}>
                            <NavLink to="/"><Heart size={32} color="black"
                                                   weight="regular"/>
                            </NavLink>
                        </li>
                    </ul>

                    <SignIn  modalIsOpen={modalIsOpen} afterOpenModal={afterOpenModal} closeModal={closeModal} customStyles={customStyles} handleSubmit={handleSubmit} handleFormSubmit={handleFormSubmit} register={register} errors={errors} showPassword={showPassword} setShowPassword={setShowPassword} error={error}> </SignIn>

                    {/*<Modal*/}
                    {/*    isOpen={modalIsOpen}*/}
                    {/*    onAfterOpen={afterOpenModal}*/}
                    {/*    onRequestClose={closeModal}*/}
                    {/*    style={customStyles}*/}
                    {/*    contentLabel="Sign in"*/}
                    {/*>*/}

                    {/*    <div className={styles["top-row__signin"]}>*/}
                    {/*        <h3>Inloggen</h3>*/}
                    {/*        <Link to="#" onClick={closeModal}><X size={18}/></Link>*/}
                    {/*    </div>*/}
                    {/*    <form className={styles["signin__form"]} onSubmit={handleSubmit(handleFormSubmit)}>*/}
                    {/*        <InputField*/}
                    {/*            type="text"*/}
                    {/*            name="email"*/}
                    {/*            label="Email: "*/}
                    {/*            validation={{*/}
                    {/*                required:*/}
                    {/*                    {*/}
                    {/*                        value: true,*/}
                    {/*                        message: "E-mail is verplicht",*/}
                    {/*                    }, pattern: {*/}
                    {/*                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i,*/}
                    {/*                    message: "Vul een geldig e-mailadres in"*/}
                    {/*                }*/}
                    {/*            }}*/}
                    {/*            register={register}*/}
                    {/*            errors={errors}*/}
                    {/*        >*/}
                    {/*        </InputField>*/}
                    {/*        <InputField classNameLabel="password-input-field"*/}
                    {/*                    type={showPassword ? "text" : "password"}*/}
                    {/*                    name="password"*/}
                    {/*                    label="Wachtwoord: "*/}
                    {/*                    validation={{*/}
                    {/*                        required:*/}
                    {/*                            {*/}
                    {/*                                value: true,*/}
                    {/*                                message: "Wachtwoord is verplicht",*/}
                    {/*                            }*/}
                    {/*                    }}*/}
                    {/*                    register={register}*/}
                    {/*                    errors={errors}*/}
                    {/*                    setShowPassword={setShowPassword}*/}
                    {/*                    showPassword={showPassword}*/}
                    {/*        >*/}
                    {/*        </InputField>*/}
                    {/*        {error && <p className="error-message">{error}</p>}*/}
                    {/*        <Button*/}
                    {/*            type="submit"*/}
                    {/*        >Inloggen</Button>*/}
                    {/*    </form>*/}


                    {/*    <div className={styles["bottom-links__signin"]}>*/}
                    {/*        <Link className={styles["bottom-link"]} to="/wachtwoordvergeten" onClick={closeModal}>*/}
                    {/*            <p>Wachtwoord vergeten?</p></Link>*/}

                    {/*        <p>Heb je nog geen account? <Link className={styles["bottom-link"]} to="/registreren"*/}
                    {/*                                          onClick={closeModal}>Registreer</Link> je*/}
                    {/*            dan eerst.</p>*/}
                    {/*    </div>*/}

                    {/*</Modal>*/}

                </nav>
            </div>

            {isAuth && <div className={`outer-container ${styles["nav-outer-bottom"]}`}>
                <nav className={`inner-container ${styles["nav-inner-bottom"]}`}>
                    <ul className={styles["nav-ul-bottom"]}>

                        {/* TODO add navbar dropdown for sub menus*/}

                        {
                            navLinks(user.authorities).map((navlink) => {
                                return (<li key={`${navlink.title}`} className={styles["nav-li-bottom"]}><NavLink
                                    className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                                    to={navlink.link}>{navlink.title}</NavLink>
                                </li>)
                            })
                        }

                    </ul>


                </nav>
            </div>}


        </>


    );
}

export default NavBar;