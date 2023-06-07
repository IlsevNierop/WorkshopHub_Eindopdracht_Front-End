import React, {useState} from 'react';
import styles from "./Home.module.css";
import {categoryOptions} from "../../components/Option";
import {components} from "react-select";
import Select from 'react-select';

{/*De value opties moeten vanuit de bank-end ingeladen worden - lijst is langer*/}
const options = [
    // { value: "all", label: "Alle workshops" },
    { value: "baking", label: "Bakken" },
    { value: "knitting", label: "Breien" },
    { value: "dance", label: "Dans" },
    { value: "cooking", label: "Koken" },
];


function Home() {
    const [category, setCategory] = useState([]);
    console.log(category);


    return (
        <div className={`outer-container ${styles["home-outer-container"]}`}>
            <div className={`inner-container ${styles["home-inner"]}`}>
                <section className={styles["sidebar-filter-section"]}>
                    <h4>Filter je zoekopdracht</h4>

                    <Select
                        placeholder="Selecteer.."
                        defaultValue={category}
                        onChange={setCategory}
                        options={options}
                        isMulti={true}
                    />


                </section>

                <section className={styles["overview-workshop-tiles"]}>


                </section>

            <h1>Homepage test</h1>
            </div>
        </div>
    );
}

export default Home;