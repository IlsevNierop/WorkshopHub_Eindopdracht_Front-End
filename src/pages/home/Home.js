import React, {useState} from 'react';
import styles from "./Home.module.css";
import Select from 'react-select';
import 'react-date-range/dist/styles.css'; // main css file of date range calendar
import 'react-date-range/dist/theme/default.css'; // theme css file of date range calendar
import {DateRange} from 'react-date-range';
import Slider from "../../components/Slider/Slider";

{/*De value opties voor categorie, locatie, omgeving moeten vanuit de bank-end ingeladen worden - lijst is langer*/
}
const optionsCategory = [
    // { value: "all", label: "Alle workshops" },
    {value: "baking", label: "Bakken"},
    {value: "knitting", label: "Breien"},
    {value: "dance", label: "Dans"},
    {value: "cooking", label: "Koken"},
];

const optionsLocation = [
    {value: "amsterdam", label: "Amsterdam"},
    {value: "utrecht", label: "Utrecht"},
    {value: "leiden", label: "Leiden"},
    {value: "woerden", label: "Woerden"},
];

const optionsEnvironment = [
    {value: "indoors", label: "Binnen"},
    {value: "outdoors", label: "Buiten"},
    {value: "inandoutdoors", label: "Binnen en buiten"},
];


function Home() {
    const [category, setCategory] = useState([]);
    const [location, setLocation] = useState([]);
    const [environment, setEnvironment] = useState([]);
    const [valueSlider, setValueSlider] = useState(0);


    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);

    // console.log(category);
    // console.log(location);
    // console.log(environment);
    console.log(valueSlider);
    // console.log(dateRange);

    const changeValueSlider = (e) => {
        setValueSlider(e.target.value);
    }


    return (
        <div className={`outer-container ${styles["home-outer-container"]}`}>
            <div className={`inner-container ${styles["home-inner"]}`}>
                <h1>WorkshopHub</h1>
                <h2>De plek om een creatieve workshop te boeken</h2>
                <section className={styles["sidebar-filter-section"]}>
                    <h4>Filter je zoekopdracht:</h4>

                    <h5>Categorie</h5>
                    <Select
                        placeholder="Selecteer.."
                        defaultValue={category}
                        onChange={setCategory}
                        options={optionsCategory}
                        isMulti={true}

                    />

                    <h5>Wanneer</h5>
                    {/*Onderstreept vandaag nog in het blauw, kijken of ik dat kan wijzigen*/}
                    <DateRange
                        editableDateInputs={true}
                        onChange={item => setDateRange([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                        minDate={new Date()}
                        rangeColors={['#c2683a', '#c2683a', '#c2683a']}
                        color={'#c2683a'}
                    />
                    <h5>Locatie</h5>
                    <Select
                        placeholder="Selecteer.."
                        defaultValue={location}
                        onChange={setLocation}
                        options={optionsLocation}
                        isMulti={true}

                    />
                    <h5>Maximale prijs</h5>
                    <p>{valueSlider}</p>
                    <label>
                        <input
                            type='range'
                            onChange={changeValueSlider}
                            min={1}
                            max={400}
                            step={1}
                            value={valueSlider}
                            className={styles["price-slider"]}>
                        </input>
                    </label>

                    <h5>Minimale beoordeling</h5>

                    <h5>Omgeving</h5>
                    <Select
                        placeholder="Selecteer.."
                        defaultValue={environment}
                        onChange={setEnvironment}
                        options={optionsEnvironment}
                        isMulti={false}

                    />


                </section>

                <section className={styles["overview-workshop-tiles"]}>


                </section>

            </div>
        </div>
    );
}

export default Home;