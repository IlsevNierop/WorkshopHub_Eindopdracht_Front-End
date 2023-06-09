import styles from "./WorkshopTile.module.css";

import React from 'react';
import {Heart} from "@phosphor-icons/react";
import bakken1 from "../../assets/temppicsworkshop/Bakken1.jpg";

// image nog als variabele invoegen
function WorkshopTile({workshoptitle, price, location, date, category1, category2, heartColor, heartWeight}) {
    return (
        <div className={styles["workshop-tile"]}>
            <img className={styles["workshop-image"]} src={bakken1} alt={category1}/>
            <Heart className={styles["favourite-icon"]} size={24} color={heartColor}
                   weight={heartWeight}/>
            {/*<Heart className={styles["favourite-icon"]} size={24} color="#fe5c5c"*/}
            {/*       weight="fill"/>*/}
            <div className={styles["information-workshop-column"]}>
                <div className={styles["top-row-workshop"]}>
                    <h5>{workshoptitle}</h5>
                    <h7>€{price},00</h7>
                </div>
                <div className={styles["bottom-row-workshop"]}>
                    <div className={styles["bottom-column-workshop"]}>
                        <h7>{location}</h7>
                        <p>{date}</p>
                    </div>
                    <div className={styles["category-workshop-row"]}>
                        <p>{category1}</p>
                        {category2 && <p>{category2}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkshopTile;