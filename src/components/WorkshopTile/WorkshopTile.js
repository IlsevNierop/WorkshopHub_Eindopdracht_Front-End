import styles from "./WorkshopTile.module.css";

import React, {useContext, useEffect, useState} from 'react';
import {Heart} from "@phosphor-icons/react";
import {addOrRemoveWorkshopFavourites} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {AuthContext} from "../../context/AuthContext";
import {Link} from "react-router-dom";
import CustomModal from "../CustomModal/CustomModal";
import {ModalSignInContext} from "../../context/ModalSigninContext";
import defaultworkshoppic from "../../assets/defaultworkshoppic.webp";

function WorkshopTile({
                          workshoptitle,
                          image,
                          price,
                          location,
                          date,
                          category1,
                          category2,
                          isFavourite,
                          link,
                          workshopId,
                      }) {
    const {user} = useContext(AuthContext);
    const {setModalIsOpenSignIn, setSignInSubHeader} = useContext(ModalSignInContext);

    const token = localStorage.getItem('token');

    const [error, setError] = useState('');
    const [favourite, setFavourite] = useState(isFavourite);

    const [modalIsOpenError, setIsOpenError] = useState(false);

    async function addOrRemoveFavouriteWorkshop() {
        setError('');
        if (user == null) {
            signInWithSubHeader("Om deze workshop aan je favorieten toe te voegen, dien je eerst in te loggen");
        }
        if (user != null) {
            try {
                await addOrRemoveWorkshopFavourites(token, user.id, workshopId, favourite);
                setFavourite(!favourite);

            } catch (e) {
                console.error(e);
                setError(errorHandling(e));
                openModalError();
                setTimeout(() => {
                    closeModalError();
                }, 2000);
            }
        }
    }

    function openModalError() {
        setIsOpenError(true);
    }

    function afterOpenModalError() {
    }

    function closeModalError() {
        setIsOpenError(false);
        setError('');
    }

    useEffect(() => {
        setFavourite(isFavourite);
    }, [isFavourite]);

    function signInWithSubHeader(subheader) {
        setModalIsOpenSignIn(true);
        setSignInSubHeader(subheader);
    }

    return (
        <>

            {error &&
                <CustomModal
                    modalIsOpen={modalIsOpenError}
                    afterOpenModal={afterOpenModalError}
                    closeModal={closeModalError}
                    contentLabel="Error"
                    errorMessage={error}
                >
                </CustomModal>
            }

            <article className={styles["workshop-tile"]}>
                <Link
                    aria-label="link__add-remove-favourite-workshop"
                    to="#" onClick={addOrRemoveFavouriteWorkshop}>
                    <Heart className={styles["favourite-icon"]} size={24}
                           color={favourite ? "#fe5c5c" : "282828"}
                           weight={favourite ? "fill" : "light"}/></Link>

                <Link
                    aria-label="link__workshop-page"
                    className={styles["workshop-tile__link"]} to={link}>
                    <img className={styles["workshop-image"]} src={image ? image : defaultworkshoppic}
                         alt={`Foto van de workshop ${workshoptitle}`}/>
                    <aside className={styles["information-workshop-column"]}>
                        <section className={styles["top-row-workshop"]}>
                            <h4>{workshoptitle}</h4>
                            <h6>€ {price.toFixed(2).replace('.', ',')}</h6>
                        </section>
                        <section className={styles["bottom-row-workshop"]}>
                            <div className={styles["bottom-column-workshop"]}>
                                <h6>{location}</h6>
                                <p>{date}</p>
                            </div>
                            <div className={styles["category-workshop-row"]}>
                                <p>{category1}</p>
                                {category2 && <p>{category2}</p>}
                            </div>
                        </section>
                    </aside>
                </Link>
            </article>
        </>
    );
}

export default WorkshopTile;