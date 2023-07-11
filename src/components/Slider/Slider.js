import React from 'react';
import styles from "./Slider.module.css";

function Slider({type, minRange, maxRange, step, value, changeHandler}) {
    return (
        <label>
            <input
                id={`${type}-slider`}
                type='range'
                onChange={changeHandler}
                min={minRange}
                max={maxRange}
                step={step}
                value={value}
                className={styles["slider"]}>
            </input>
        </label>
    );
}

export default Slider;