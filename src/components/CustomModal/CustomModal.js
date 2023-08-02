import React from 'react';
import styles from "./CustomModal.module.css";
import {Link} from "react-router-dom";
import {Confetti, X} from "@phosphor-icons/react";
import Modal from "react-modal";
import Button from "../Button/Button";

function CustomModal({
                         modalIsOpen,
                         afterOpenModal,
                         closeModal,
                         contentLabel,
                         children,
                         updateHeader,
                         updateMessage,
                         errorMessage,
                         functionalModalHeader,
                         buttonHeaderCheckModalYes,
                         onclickHandlerCheckModalYes,
                         onclickHandlerCheckModalBack,
                         checkMessage
                     }) {


    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            overlay: {zIndex: 3000},
        },
    };

    Modal.setAppElement('#root');

    return (
        <>
            {updateHeader &&
                (<Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel={contentLabel}
                >
                    <section className={styles["column__modal__successful"]}>
                        <div className={styles["row__modal__successful"]}>
                            <Confetti size={32} color="#c45018" weight="fill"/>
                            <h3>{updateHeader}</h3>
                            <Confetti size={32} color="#c45018" weight="fill"/>
                        </div>
                        {updateMessage && (updateMessage.split("-")).filter(sentence => sentence.trim() !== "").map((sentence) => {
                            return (
                                <p className={styles["sentence-modal"]} key={sentence.slice(0, 3)}>{sentence}</p>
                            )
                        })}
                    </section>
                </Modal>)
            }
            {errorMessage &&
                (<Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel={contentLabel}
                >
                    <div className={styles["column__modal__error"]}>

                        <p className="error-message">Er gaat iets mis</p>
                        <p className="error-message">{errorMessage}</p>
                    </div>
                </Modal>)

            }
            {functionalModalHeader &&
                (<Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel={contentLabel}
                >
                    <div className={styles["top-row__functional-modal"]}>
                        <h3>{functionalModalHeader}</h3>
                        <Link to="#" onClick={closeModal}><X size={18}/></Link>
                    </div>
                    {children}
                </Modal>)
            }
            {checkMessage &&
                (<Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel={contentLabel}
                >
                    <section className={styles["column__modal-check"]}>
                        <div className={styles["top-row__modal-check"]}>
                            <h3>Weet je het zeker?</h3>
                            <Link to="#" onClick={closeModal}><X size={18}/></Link>
                        </div>
                        {checkMessage && (checkMessage.split("-")).filter(sentence => sentence.trim() !== "").map((sentence) => {
                            return (
                                <h4 className={styles["h4__modal-check"]} key={sentence.slice(0, 3)}>{sentence}</h4>
                            )
                        })}
                        <div className={styles["bottom-row__modal-check"]}>
                            <Button type="text"
                                    onClick={onclickHandlerCheckModalYes}
                            >{buttonHeaderCheckModalYes}</Button>
                            <Button type="text"
                                    onClick={onclickHandlerCheckModalBack}>Terug</Button>
                        </div>
                    </section>
                </Modal>)
            }
        </>

    );
}

export default CustomModal;