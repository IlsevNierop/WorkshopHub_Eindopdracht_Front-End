import React from 'react';
import {Star} from "@phosphor-icons/react";
import styles from "../StarRating/StarRating.module.css";


function StarRating({rating, size}) {
    const totalStars = 5;
    const activeStars = Math.round(rating * 2) / 2;
    let totalFilledStars = Math.floor(activeStars);
    let hasHalfStar = false;

    if (activeStars % 1 !== 0) {
        hasHalfStar = true;
    }

    return (
        <section className={`${styles["container__rating"]} ${styles["size-" + size]}`}>
            {[...new Array(totalStars)].map((_, index) => {
                if (index < totalFilledStars) {
                    return <Star className={styles["star__rating"]} size={size} color="#F6AE2D" weight="fill"
                                 key={index}/>;
                } else if (index === totalFilledStars && hasHalfStar) {
                    return (
                        <div className={`${styles["container-half-star"]} ${styles["size-" + size]}`} key={index}>
                            <Star size={size}
                                  className={`${styles["star__rating"]} ${styles["star__rating__full-half-star"]}`}
                                  color="#F6AE2D" weight="fill"/>
                            <Star size={size}
                                  className={`${styles["star__rating"]} ${styles["star__rating__empty-half-star"]}`}
                                  color="#bfbdbd" weight="light"/>
                        </div>
                    );
                } else {
                    return <Star className={`${styles["star__rating"]} ${styles["star__rating__empty_star"]}`}
                                 size={size}
                                 color="#bfbdbd" weight="light" key={index}/>;
                }
            })}
        </section>
    );
}

export default StarRating;