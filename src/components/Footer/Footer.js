import React from 'react';
import {Copyright} from "@phosphor-icons/react";
import styles from "./Footer.module.css";

function Footer() {
    return (
        <div className={`outer-container ${styles["footer-outer"]}`}>
            <div className={`inner-container ${styles["footer-inner"]}`}>
                <p className={styles["footer-text"]}><Copyright size={12} color="black"
                                                                weight="thin"/> 2023 <span>Ilse van Nierop</span></p>

            </div>
        </div>
    );
}

export default Footer;