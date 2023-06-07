import {components} from "react-select";
import React from 'react';

export const categoryOptions = [
    { value: "all", label: "Alle workshops" },
    { value: "baking", label: "Bakken" },
    { value: "knitting", label: "Breien" },
    { value: "dance", label: "Dans" },
    { value: "cooking", label: "Koken" },
];
const Option = (props) => {

    return (
        <div>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />{" "}
                <label>{props.label}</label>
            </components.Option>
        </div>
    );
};

export default Option;