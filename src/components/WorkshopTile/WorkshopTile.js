import styles from "./WorkshopTile.module.css";

import React, {useContext, useEffect, useState} from 'react';
import {Heart, X} from "@phosphor-icons/react";
import {addOrRemoveWorkshopFavourites, signIn, uploadProfilePic} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {AuthContext} from "../../context/AuthContext";
import Modal from "react-modal";
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import SignIn from "../SignIn/SignIn";

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
                          workshopId
                      }) {
    const {user, login} = useContext(AuthContext);
    const {register, handleSubmit, formState: {errors}, reset} = useForm({mode: 'onTouched'});
    const token = localStorage.getItem('token');
    const [error, setError] = useState('');
    const [favourite, setFavourite] = useState(isFavourite);
    const [showPassword, setShowPassword] = useState(false);


    async function addOrRemoveFavouriteWorkshop() {
        setError('');
        if (user == null) {
            openModal();
        }
        if (user != null) {
            try {
                await addOrRemoveWorkshopFavourites(token, user.id, workshopId, favourite);
                setFavourite(!favourite);

            } catch (e) {
                setError(errorHandling(e));
                openModalError();
                setTimeout(() => {
                    closeModalError();
                }, 2000);
                console.log(e);
            }
        }
    }

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
    const [modalIsOpenError, setIsOpenError] = React.useState(false);

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

    function openModalError() {
        setIsOpenError(true);
    }

    function afterOpenModalError() {

    }

    function closeModalError() {
        setIsOpenError(false);
        setError('');
    }

    async function handleFormSubmit(data) {
        setError('');
        try {
            const {jwt} = await signIn(data.email, data.password);
            reset();
            login(jwt, "/");
            closeModal();

        } catch (e) {
            setError(errorHandling(e));
            console.log(error);
        }
    }

    useEffect(() => {
        setFavourite(isFavourite);
    }, [isFavourite]);

    return (
        <>
            <Modal
                isOpen={modalIsOpenError}
                onAfterOpen={afterOpenModalError}
                onRequestClose={closeModalError}
                style={customStyles}
                contentLabel="Data error"
            >
                {error && <p className="error-message">{error}</p>}
            </Modal>

            <SignIn modalIsOpen={modalIsOpen} afterOpenModal={afterOpenModal} closeModal={closeModal}
                    customStyles={customStyles} handleSubmit={handleSubmit} handleFormSubmit={handleFormSubmit}
                    register={register} errors={errors} showPassword={showPassword} setShowPassword={setShowPassword}
                    error={error}> </SignIn>


            <article className={styles["workshop-tile"]}>
                <Link to="#" onClick={addOrRemoveFavouriteWorkshop}>
                    <Heart className={styles["favourite-icon"]} size={24}
                           color={favourite ? "#fe5c5c" : "282828"}
                           weight={favourite ? "fill" : "light"}/></Link>

                <Link className={styles["workshop-tile__link"]} to={link}>
                    <img className={styles["workshop-image"]} src={image} alt={category1}/>

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
    )
        ;
}

export default WorkshopTile;