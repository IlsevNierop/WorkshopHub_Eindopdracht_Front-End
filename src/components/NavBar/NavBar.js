import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "../../../../workshophub-eindopdracht/src/assets/logo-default.svg";
import logoMobile from "../../../../workshophub-eindopdracht/src/assets/logo-mobile.svg";
import {Heart} from "@phosphor-icons/react";
import {checkAuthorityLevel} from "../../helper/checkAuthorityLevel";
import {AuthContext} from "../../context/AuthContext";

function NavBar() {

    const {isAuth, user} = useContext(AuthContext)

    return (
        <>
            <div className={`outer-container ${styles["nav-outer-top"]}`}>
                <nav className={`inner-container ${styles["nav-inner-top"]}`}>
                    <NavLink to="/"><img src={logo} alt="WorkshopHub logo"/></NavLink>
                    <ul className={styles["nav-ul-top"]}>
                        {!isAuth && <li className={styles["nav-li-top"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/login">Inloggen</NavLink></li>}
                        {isAuth && <li className={styles["nav-li-top"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/loguit">Uitloggen</NavLink></li>}

                        <li className={styles["nav-li"]}><NavLink to="/"><Heart size={32} color="black"
                                                                                weight="regular"/></NavLink></li>
                    </ul>
                </nav>
            </div>

            {/*Ingelogde admin: */}
            {user!= null && (checkAuthorityLevel(user.authorities) === 'admin') && <div className={`outer-container ${styles["nav-outer-bottom"]}`}>
                <nav className={`inner-container ${styles["nav-inner-bottom"]}`}>
                    <ul className={styles["nav-ul-bottom"]}>
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Mijn Account</NavLink></li>
                        |
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Goedkeuren Workshops</NavLink></li>
                        |
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Goedkeuren Reviews</NavLink></li>
                        |
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Workshops</NavLink></li>
                        |
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Reviews</NavLink></li>
                        |
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Boekingen</NavLink></li>
                        |
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Gebruikers</NavLink></li>
                    </ul>

                </nav>
            </div>}

            {/*Ingelogde workshopeigenaar: */}
            {user!= null && (checkAuthorityLevel(user.authorities) === 'workshopowner') && <div className={`outer-container ${styles["nav-outer-bottom"]}`}>
                <nav className={`inner-container ${styles["nav-inner-bottom"]}`}>
                    <ul className={styles["nav-ul-bottom"]}>
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Mijn Account</NavLink></li>
                        |
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Mijn Workshops</NavLink></li>
                        |
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Reviews</NavLink></li>
                        |
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Boekingen</NavLink></li>
                        |
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Nieuwe Workshop</NavLink></li>
                    </ul>

                </nav>
            </div>}


            {/*Ingelogde klant: */}
            {user!= null && (checkAuthorityLevel(user.authorities) === 'customer') && <div className={`outer-container ${styles["nav-outer-bottom"]}`}>
                <nav className={`inner-container ${styles["nav-inner-bottom"]}`}>
                    <ul className={styles["nav-ul-bottom"]}>
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Mijn Account</NavLink></li>
                        |
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Mijn Boekingen</NavLink></li>
                        |
                        <li className={styles["nav-li-bottom"]}><NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/test">Mijn Reviews</NavLink></li>
                    </ul>

                </nav>
            </div>}


            {/*{isAuth && <div className={`outer-container ${styles["nav-outer-bottom"]}`}>*/}
            {/*    <nav className={`inner-container ${styles["nav-inner-bottom"]}`}>*/}
            {/*        <ul className={styles["nav-ul-bottom"]}>*/}
            {/*            <li className={styles["nav-li-bottom"]}><NavLink*/}
            {/*                className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}*/}
            {/*                to="/test">Mijn Account</NavLink></li>*/}
            {/*            |*/}
            {/*            <li className={styles["nav-li-bottom"]}><NavLink*/}
            {/*                className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}*/}
            {/*                to="/test">Mijn Workshops</NavLink></li>*/}
            {/*            |*/}
            {/*            <li className={styles["nav-li-bottom"]}><NavLink*/}
            {/*                className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}*/}
            {/*                to="/test">Mijn Reviews</NavLink></li>*/}
            {/*            |*/}
            {/*            <li className={styles["nav-li-bottom"]}><NavLink*/}
            {/*                className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}*/}
            {/*                to="/test">Boekingen</NavLink></li>*/}
            {/*            |*/}
            {/*            <li className={styles["nav-li-bottom"]}><NavLink*/}
            {/*                className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}*/}
            {/*                to="/test">Nieuwe Workshop</NavLink></li>*/}
            {/*        </ul>*/}

            {/*    </nav>*/}
            {/*</div>}*/}


        </>


    );
}

export default NavBar;