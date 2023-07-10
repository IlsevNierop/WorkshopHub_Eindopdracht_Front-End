import React from 'react';
import {Star} from "@phosphor-icons/react";
import styles from "../StarRating/StarRating.module.css";


function StarRating({rating}) {
    const totalStars = 5;
    const activeStars = Math.round(rating * 2) / 2;
    let totalFilledStars = Math.floor(activeStars);
    let hasHalfStar = false;

    if (activeStars % 1 !== 0) {
        hasHalfStar = true;
    }

    return (
        <div className={styles["container__rating"]}>
            {[...new Array(totalStars)].map((_, index) => {
                if (index < totalFilledStars) {
                    return <Star className={styles["star__rating"]} size={20} color="#e7cf07" weight="fill"
                                 key={index}/>;
                } else if (index === totalFilledStars && hasHalfStar) {
                    return (
                        <div className={styles["container-half-star"]} key={index}>
                            <Star size={20}
                                  className={`${styles["star__rating"]} ${styles["star__rating__full-half-star"]}`}
                                  color="#e7cf07" weight="fill"/>
                            <Star size={20}
                                  className={`${styles["star__rating"]} ${styles["star__rating__empty-half-star"]}`}
                                  color="#bfbdbd" weight="light"/>
                        </div>
                    );
                } else {
                    return <Star className={`${styles["star__rating"]} ${styles["star__rating__empty_star"]}`} size={20}
                                 color="#bfbdbd" weight="light" key={index}/>;
                }
            })}
        </div>
    );
}

export default StarRating;