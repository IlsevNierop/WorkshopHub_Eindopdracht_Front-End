import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "../../../../workshophub-eindopdracht/src/assets/logo-default.svg";
import {Heart} from "@phosphor-icons/react";
import {AuthContext} from "../../context/AuthContext";
import {navLinks} from "./navLinks";
import SignIn from "../SignIn/SignIn";
import {ModalSignInContext} from "../../context/ModalSigninContext";

function NavBar() {


    const {isAuth, user, logout} = useContext(AuthContext);
    const {setModalIsOpenSignIn, setSignInSubHeader} = useContext(ModalSignInContext);

    function signInWithSubHeader(subheader) {
        setModalIsOpenSignIn(true);
        setSignInSubHeader(subheader);
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
                                to="#" onClick={() => signInWithSubHeader('')}>Inloggen</NavLink>
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
                                <NavLink to="#" onClick={() => signInWithSubHeader("Om je favoriete workshops te zien, dien je eerst in te loggen")}><Heart size={32} color="black"
                                                                 weight="regular"/>
                                </NavLink>
                            </li>
                        }
                    </ul>

                    <SignIn></SignIn>

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