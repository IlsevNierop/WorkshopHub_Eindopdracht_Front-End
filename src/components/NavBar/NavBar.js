import React, {useContext, useState} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "../../../../workshophub-eindopdracht/src/assets/logo-default.svg";
import {Heart, X} from "@phosphor-icons/react";
import {AuthContext} from "../../context/AuthContext";
import {navLinks} from "./navLinks";
import {useForm} from "react-hook-form";
import {resetPassword, signIn} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import SignIn from "../SignIn/SignIn";

function NavBar() {


    const {isAuth, user, logout, login} = useContext(AuthContext);
    const {register, handleSubmit, formState: {errors}, reset} = useForm({mode: 'onTouched'});
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalIsOpenResetPassword, setIsOpenResetPassword] = useState(false);

    const navigate = useNavigate();

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
    function openModalResetPassword() {
        setIsOpenResetPassword(true);
    }

    function afterOpenModalResetPassword() {

    }

    function closeModalResetPassword() {
        setIsOpenResetPassword(false);
        setError('');
        setShowPassword(false);
        reset();
    }

    async function handleFormSubmit(data) {
        setError('');
        try {
            const {jwt} = await signIn(data.email, data.password);
            reset();
            login(jwt);
            closeModal();

        } catch (e) {
            setError(errorHandling(e));
            console.log(error);
        }
    }

    async function handleFormSubmitResetPassword(data) {

        try {
            const response = await resetPassword(data.email, data.password);
            console.log(response);
            reset();
            // openModal();
            // setTimeout(() => {
            //     closeModal();
            //     navigate("/")
            //
            // }, 2000);


        } catch (e) {
            setError(errorHandling(e));
            setTimeout(() => {
                setError('');

            }, 4000);
            console.log(error);
        }
    }



    return (
        <>
            <div className={`outer-container ${styles["nav-outer-top"]}`}>
                <nav className={`inner-container ${styles["nav-inner-top"]}`}>
                    <NavLink to="/"><img className={styles["image-logo"]} src={logo} alt="WorkshopHub logo"/>
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

                        {isAuth?
                            <li className={styles["nav-li-top"]}>
                                <NavLink to="/favorieten"><Heart size={32} color="black"
                                                                 weight="regular"/>
                                </NavLink>
                            </li>
                            :
                            <li className={styles["nav-li-top"]}>
                                <NavLink to="#" onClick={openModal}><Heart size={32} color="black"
                                                                 weight="regular"/>
                                </NavLink>
                            </li>
                        }


                    </ul>

                    <SignIn  modalIsOpen={modalIsOpen} afterOpenModal={afterOpenModal} closeModal={closeModal}
                             handleSubmit={handleSubmit} handleFormSubmit={handleFormSubmit} register={register} errors={errors} showPassword={showPassword} setShowPassword={setShowPassword} error={error}
                        modalIsOpenResetPassword={modalIsOpenResetPassword} afterOpenModalResetPassword={afterOpenModalResetPassword} closeModalResetPassword={closeModalResetPassword}
                             handleFormSubmitResetPassword={handleFormSubmitResetPassword}
                             openModalResetPassword={openModalResetPassword}
                        >
                    </SignIn>

                </nav>
            </div>

            {isAuth && <div className={`outer-container ${styles["nav-outer-bottom"]}`}>
                <nav className={`inner-container ${styles["nav-inner-bottom"]}`}>
                    <ul className={styles["nav-ul-bottom"]}>
                        {
                            navLinks(user.highestAuthority).map((navlink) => {

                                return (    <li key={`${navlink.title}`} className={styles["nav-li-bottom"]}>
                                        {navlink.submenu ? (
                                            <div className={styles["nav__dropdown_menu"]}>
                                                <span className={styles['default-nav-link']}>{navlink.title}</span>

                                                <div className={styles["nav__dropdown_content"]}>
                                                    {navlink.submenu.map((submenuItem) => (
                                                        <NavLink
                                                            key={submenuItem.title}
                                                            to={submenuItem.link}
                                                            className={styles['default-nav-link']}
                                                        >
                                                            {submenuItem.title}
                                                        </NavLink>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <NavLink
                                                className={({ isActive }) =>
                                                    isActive ? styles['active-nav-link'] : styles['default-nav-link']
                                                }
                                                to={navlink.link}
                                            >
                                                {navlink.title}
                                            </NavLink>
                                        )}
                                    </li>
                                );
                            })
                        }

                    </ul>


                </nav>
            </div>}


        </>


    );
}

export default NavBar;