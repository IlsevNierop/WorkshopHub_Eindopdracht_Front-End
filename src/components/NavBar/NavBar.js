import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "../../../../workshophub-eindopdracht/src/assets/logo-default.svg";
import logoMobile from "../../../../workshophub-eindopdracht/src/assets/logo-mobile.svg";
import {Heart} from "@phosphor-icons/react";
import {AuthContext} from "../../context/AuthContext";
import {navLinks} from "./navLinks";
import Button from "../Button/Button";

function NavBar() {



    const {isAuth, user, logout} = useContext(AuthContext)

    return (
        <>
            <div className={`outer-container ${styles["nav-outer-top"]}`}>
                <nav className={`inner-container ${styles["nav-inner-top"]}`}>
                    <NavLink to="/"><img src={logo} alt="WorkshopHub logo"/>
                    </NavLink>
                    <ul className={styles["nav-ul-top"]}>

                        {!isAuth && <li className={styles["nav-li-top"]}>
                            <NavLink
                            className={({isActive}) => isActive ? styles['active-nav-link'] : styles['default-nav-link']}
                            to="/login">Inloggen</NavLink>
                        </li>}

                        {isAuth && <li className={styles["nav-li-top"]}>
                            <NavLink className={styles['default-nav-link']}
                            to="/" onClick={() => logout()}>
                        Uitloggen</NavLink></li>}

                        <li className={styles["nav-li"]}><NavLink to="/"><Heart size={32} color="black"
                                                                                weight="regular"/></NavLink></li>
                    </ul>
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
                            </li> )
                        })
                        }

                    </ul>

                </nav>
            </div>}


        </>


    );
}

export default NavBar;