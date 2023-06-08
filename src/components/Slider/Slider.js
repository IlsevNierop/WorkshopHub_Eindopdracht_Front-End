import React from 'react';
import styles from "./Slider.module.css";

function Slider({ minRange, maxRange}) {
    return (
        <label>
            <input
                type="range"
                min={minRange}
                max={maxRange}
                value="test"
            />
        </label>
    );
}

export default Slider;