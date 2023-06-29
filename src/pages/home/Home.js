import React, {useContext, useState} from 'react';
import styles from "./Home.module.css";
import Select from 'react-select';
import 'react-date-range/dist/styles.css'; // main css file of date range calendar
import 'react-date-range/dist/theme/default.css'; // theme css file of date range calendar
import {DateRange} from 'react-date-range';
import {Heart, Star} from "@phosphor-icons/react";
import bakken1 from "../../../../workshophub-eindopdracht/src/assets/temppicsworkshop/Bakken1.jpg";
import WorkshopTile from "../../components/WorkshopTile/WorkshopTile";
import {AuthContext} from "../../context/AuthContext";

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

const optionsSortValue = [
    {value: "date", label: "Datum"},
    {value: "price", label: "Prijs"},
    {value: "popular", label: "Populariteit"},
];


function Home() {
    const {user} = useContext(AuthContext);
    console.log(user);


    const [category, setCategory] = useState([]);
    const [location, setLocation] = useState([]);
    const [environment, setEnvironment] = useState([]);
    const [sortValue, setSortValue] = useState([]);
    const [valueSlider, setValueSlider] = useState(0);
    const [minRating, setMinRating] = useState(0);


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
    // console.log(valueSlider);
    // console.log(dateRange);
    // console.log(minRating);

    const changeValueSlider = (e) => {
        setValueSlider(e.target.value);
    }

    const handleChangeRating = (e) => {
        setMinRating(e.target.value);
    }


    return (

        <main className={`outer-container ${styles["home__outer-container"]}`}>
            <div className={`inner-container ${styles["home__inner"]}`}>
                <header className={styles["homepage__header"]}>
                    <h1 className={styles["homepage__header__h1"]}><span className={styles["logo__capital-letter"]}>W</span>orkshop<span className={styles["logo__capital-letter"]}>H</span>ub</h1>
                    <h3>De plek om een creatieve workshop te boeken</h3>
                </header>

                <section className={styles["filter__row__workshop-tiles"]}>
                    <h4>Filter je zoekopdracht:</h4>

                    <div className={styles["sort"]}>
                        <h4>Sorteer op:</h4>
                        <Select className={styles["sort__dropdown"]}
                            placeholder="Datum"
                            defaultValue={sortValue}
                            onChange={setSortValue}
                            options={optionsSortValue}
                            isMulti={false}

                        />
                    </div>
                </section>

                <div className={styles["sidebar__workshop-tiles"]}>
                    <section className={styles["sidebar__filter"]}>

                        <div className={styles["filter-item"]}>

                            <h5>Categorie</h5>
                            <Select
                                placeholder="Selecteer.."
                                defaultValue={category}
                                onChange={setCategory}
                                options={optionsCategory}
                                isMulti={true}

                            />
                        </div>

                        <div className={styles["filter-item"]}>


                            <h5>Wanneer</h5>
                            {/*Onderstreept nog in het blauw, kijken of ik dat kan wijzigen*/}
                            {/*kijken of ik de kalendar kleiner kan maken*/}
                            <DateRange
                                // className={styles["calendar-item"]}
                                editableDateInputs={true}
                                onChange={item => setDateRange([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={dateRange}
                                minDate={new Date()}
                                rangeColors={['#c2683a', '#c2683a', '#c2683a']}
                                color={'#c2683a'}
                            />
                        </div>

                        <div className={styles["filter-item"]}>

                            <h5>Locatie</h5>
                            <Select
                                placeholder="Selecteer.."
                                defaultValue={location}
                                onChange={setLocation}
                                options={optionsLocation}
                                isMulti={true}

                            />
                        </div>
                        <div className={styles["filter-item"]}>
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
                        </div>

                        <div className={styles["filter-item"]}>

                            <h5>Minimale beoordeling</h5>
                            <div className={styles["rating-column"]}>
                                <label className={styles["rating-row"]} htmlFor="zero-star">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value="0"
                                        id="zero-star"
                                        checked={minRating === 0 ? "checked"
                                            : null}
                                        onChange={handleChangeRating}
                                    />
                                    <div className={styles["label-stars"]}>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                    </div>
                                </label>
                                <label className={styles["rating-row"]} htmlFor="one-star">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value="1"
                                        id="one-star"
                                        checked={minRating === 1 ? "checked"
                                            : null}
                                        onChange={handleChangeRating}
                                    />
                                    <div className={styles["label-stars"]}>
                                        <Star size={20} color="#e7cf07"
                                              weight="fill"/>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                    </div>
                                </label>
                                <label className={styles["rating-row"]} htmlFor="two-star">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value="2"
                                        id="two-star"
                                        checked={minRating === 2 ? "checked"
                                            : null}
                                        onChange={handleChangeRating}
                                    />
                                    <div className={styles["label-stars"]}>
                                        <Star size={20} color="#e7cf07"
                                              weight="fill"/>
                                        <Star size={20} color="#e7cf07"
                                              weight="fill"/>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                    </div>
                                </label>
                                <label className={styles["rating-row"]} htmlFor="three-star">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value="3"
                                        id="three-star"
                                        checked={minRating === 3 ? "checked"
                                            : null}
                                        onChange={handleChangeRating}
                                    />
                                    <div className={styles["label-stars"]}>
                                        <Star size={20} color="#e7cf07"
                                              weight="fill"/>
                                        <Star size={20} color="#e7cf07"
                                              weight="fill"/>
                                        <Star size={20} color="#e7cf07"
                                              weight="fill"/>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                    </div>
                                </label>
                                <label className={styles["rating-row"]} htmlFor="four-star">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value="4"
                                        id="four-star"
                                        checked={minRating === 4 ? "checked"
                                            : null}
                                        onChange={handleChangeRating}
                                    />
                                    <div className={styles["label-stars"]}>
                                        <Star size={20} color="#e7cf07"
                                              weight="fill"/>
                                        <Star size={20} color="#e7cf07"
                                              weight="fill"/>
                                        <Star size={20} color="#e7cf07"
                                              weight="fill"/>
                                        <Star size={20} color="#e7cf07"
                                              weight="fill"/>
                                        <Star size={20} color="black"
                                              weight="light"/>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className={styles["filter-item"]}>


                            <h5>Omgeving</h5>
                            <Select
                                placeholder="Selecteer.."
                                defaultValue={environment}
                                onChange={setEnvironment}
                                options={optionsEnvironment}
                                isMulti={false}

                            />
                        </div>


                    </section>

                    <section className={styles["overview__workshop-tiles"]}>
                        <WorkshopTile
                            image={bakken1}
                            heartColor="#fe5c5c"
                            heartWeight="fill"
                            workshoptitle="Indonesische kook workshop"
                            price="99"
                            location="Utrecht"
                            date="01-01-2023"
                            category1="koken"
                            category2="bakken"
                        ></WorkshopTile>
                        <WorkshopTile
                            image={bakken1}
                            workshoptitle="Indonesische kook workshop"
                            price="75"
                            location="Utrecht"
                            date="01-01-2023"
                            category1="koken"
                            category2="bakken"
                        >

                        </WorkshopTile>
                        <WorkshopTile
                            image={bakken1}
                            heartColor="#fe5c5c"
                            heartWeight="fill"
                            workshoptitle="Indonesische kook workshop"
                            price="33"
                            location="Utrecht"
                            date="01-01-2023"
                            category1="koken"
                            category2="bakken"
                        >

                        </WorkshopTile>
                        <WorkshopTile
                            image={bakken1}
                            workshoptitle="Indonesische kook workshop"
                            price="99"
                            location="Utrecht"
                            date="01-01-2023"
                            category1="koken"
                            category2="bakken"
                        ></WorkshopTile>
                        <WorkshopTile
                            image={bakken1}
                            workshoptitle="Indonesische kook workshop"
                            price="42"
                            location="Utrecht"
                            date="01-01-2023"
                            category1="koken"
                            category2="bakken"
                        ></WorkshopTile>
                        <WorkshopTile
                            image={bakken1}
                            workshoptitle="Indonesische kook workshop"
                            price="100"
                            location="Utrecht"
                            date="01-01-2023"
                            category1="koken"
                            category2="bakken"
                        ></WorkshopTile>
                        <WorkshopTile
                            image={bakken1}
                            heartColor="#fe5c5c"
                            heartWeight="fill"
                            workshoptitle="Indonesische kook workshop"
                            price="95"
                            location="Utrecht"
                            date="01-01-2023"
                            category1="koken"
                            category2="bakken"
                        ></WorkshopTile>
                        <WorkshopTile
                            image={bakken1}
                            heartColor="#fe5c5c"
                            heartWeight="fill"
                            workshoptitle="Indonesische kook workshop"
                            price="80"
                            location="Utrecht"
                            date="01-01-2023"
                            category1="koken"
                            category2="bakken"
                        ></WorkshopTile>
                        <WorkshopTile
                            image={bakken1}
                            workshoptitle="Indonesische kook workshop"
                            price="42"
                            location="Utrecht"
                            date="01-01-2023"
                            category1="koken"
                            category2="bakken"
                        ></WorkshopTile>


                    </section>

                </div>
            </div>
        </main>
    )
        ;
}

export default Home;