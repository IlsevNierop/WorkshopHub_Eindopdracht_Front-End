import React, {useContext, useEffect, useState} from 'react';
import styles from "./Home.module.css";
import Select from 'react-select';
import 'react-date-range/dist/styles.css'; // main css file of date range calendar
import 'react-date-range/dist/theme/default.css'; // theme css file of date range calendar
import {DateRange} from 'react-date-range';
import WorkshopTile from "../../components/WorkshopTile/WorkshopTile";
import {AuthContext} from "../../context/AuthContext";
import {fetchWorkshopData, fetchWorkshopDataLoggedIn} from "../../api/api";
import {errorHandling} from "../../helper/errorHandling";
import {updateDateFormatShort} from "../../helper/updateDateFormatShort";
import {sortArray} from "../../helper/sortArray";
import {filterWorkshopArray} from "../../helper/filtersWorkshop/filterWorkshopArray";
import Button from "../../components/Button/Button";
import {createOptionsObjectSelectDropdown} from "../../helper/createOptionsObjectSelectDropdown";
import StarRating from "../../components/StarRating/StarRating";
import Slider from "../../components/Slider/Slider";
import InputField from "../../components/InputField/InputField";


function Home() {

    const {user} = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const controller = new AbortController();


    const [category, setCategory] = useState([]);
    const [location, setLocation] = useState([]);
    const [environment, setEnvironment] = useState([]);
    const [sortValue, setSortValue] = useState([]);
    const [priceSlider, setPriceSlider] = useState(400);
    const [minRating, setMinRating] = useState(0);
    const [error, setError] = useState('');
    const [workshopData, setWorkshopData] = useState([]);
    const [originalWorkshopData, setOriginalWorkshopData] = useState([]);
    const [loading, toggleLoading] = useState(false);
    const [optionsCategory, setOptionsCategory] = useState([]);
    const [optionsLocation, setOptionsLocation] = useState([]);

    const optionsEnvironment = [
        {value: "INDOORS", label: "Binnen"},
        {value: "OUTDOORS", label: "Buiten"},
        {value: "IN_AND_OUTDOORS", label: "Gedeeltelijk binnen en buiten"},
    ];

    const optionsSortValue = [
        {value: "date", label: "Datum"},
        {value: "pricelowtohigh", label: "Prijs - laag naar hoog"},
        {value: "pricehightolow", label: "Prijs - hoog naar laag"},
        {value: "popular", label: "Populariteit"},
    ];


    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);


    const changeValueSlider = (e) => {
        setPriceSlider(e.target.value);
    }

    const handleChangeRating = (e) => {
        setMinRating(e.target.value);
    }

    function removeAllFilters() {
        setCategory([]);
        setDateRange([
            {
                startDate: new Date(),
                endDate: null,
                key: 'selection'
            }
        ]);
        setLocation([]);
        setEnvironment([]);
        setPriceSlider(400);
        setMinRating(0);
        setWorkshopData(originalWorkshopData);
    }

    //TODO volgende pagina / laad volgende x workshops

    useEffect(() => {
            async function fetchDataWorkshops() {
                toggleLoading(true);
                setError('');
                if (user != null) {
                    try {
                        const response = await fetchWorkshopDataLoggedIn(token, user.id);
                        setWorkshopData(response);
                        setOriginalWorkshopData(response);

                        if (response) {
                            setError('');
                        }

                    } catch (e) {
                        setError(errorHandling(e));
                        console.log(error);
                    }
                    toggleLoading(false);
                } else {
                    try {
                        const response = await fetchWorkshopData();
                        setWorkshopData(response);
                        setOriginalWorkshopData(response);

                        if (response) {
                            setError('');
                        }

                    } catch (e) {
                        setError(errorHandling(e));
                        console.log(error);
                    }
                    toggleLoading(false);
                }
            }

            void fetchDataWorkshops();

            return function cleanup() {
                controller.abort();
            }
        }

        , [user]);


    useEffect(() => {

        function setOptions() {
            setOptionsCategory(createOptionsObjectSelectDropdown(originalWorkshopData, "workshopCategory1", "workshopCategory2"));
            setOptionsLocation(createOptionsObjectSelectDropdown(originalWorkshopData, "location",));
        }

        void setOptions();

    }, [originalWorkshopData])

    useEffect(() => {


        setWorkshopData(sortArray(workshopData, sortValue.value));

    }, [sortValue]);


    useEffect(() => {
        const filteredWorkshopArray = filterWorkshopArray(originalWorkshopData, category, location, environment, priceSlider, minRating, dateRange, sortValue.value);
        setWorkshopData(filteredWorkshopArray);
    }, [category, location, environment, priceSlider, minRating, dateRange]);


    return (
        <main className={`outer-container ${styles["home__outer-container"]}`}>
            <div className={`inner-container ${styles["home__inner-container"]}`}>

                <section className={styles["homepage__top"]}>
                    <h1 className={styles["homepage__top__h1"]}><span
                        className={styles["logo__capital-letter"]}>W</span>orkshop<span
                        className={styles["logo__capital-letter"]}>H</span>ub</h1>
                    <h3>Dé plek om een creatieve workshop te boeken</h3>
                </section>
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}

                <section className={styles["filter__row__workshop-tiles"]}>
                    <h4>Filter je zoekopdracht:</h4>

                    <div className={styles["sort"]}>
                        <h4>Sorteer op:</h4>
                        <Select className={styles["sort__dropdown"]}
                                id="select-dropdown-sort"
                                name="select-dropdown-sort"
                                placeholder="Selecteer.."
                                defaultValue={sortValue}
                                onChange={setSortValue}
                                options={optionsSortValue}
                                isMulti={false}
                        />
                    </div>
                </section>

                <section className={styles["workshop-tiles__filters"]}>
                    <aside className={styles["sidebar__filter"]}>

                        <div className={styles["filter-item"]}>

                            <h5>Categorie</h5>
                            <Select
                                id="select-dropdown-category"
                                name="select-dropdown-category"
                                placeholder="Selecteer.."
                                value={category}
                                onChange={setCategory}
                                options={optionsCategory}
                                isMulti={true}

                            />
                        </div>

                        <div className={styles["filter-item"]}>
                            <h5>Wanneer</h5>
                            {/*TODO Onderstreept nog in het blauw, kijken of ik dat kan wijzigen*/}
                            {/*TODO kijken of ik de kalendar kleiner kan maken*/}
                            <DateRange
                                editableDateInputs={true}
                                onChange={item => setDateRange([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={dateRange}
                                minDate={new Date()}
                                rangeColors={['#375673', '#375673', '#375673']}
                                color={'#375673'}
                            />
                        </div>

                        <div className={styles["filter-item"]}>
                            <h5>Locatie</h5>
                            <Select
                                id="select-dropdown-location"
                                name="select-dropdown-location"
                                placeholder="Selecteer.."
                                value={location}
                                onChange={setLocation}
                                options={optionsLocation}
                                isMulti={true}
                            />
                        </div>

                        <div className={styles["filter-item"]}>
                            <h5>Maximale prijs</h5>
                            <p>{priceSlider}</p>
                            <Slider
                                id="price"
                                name="price-slider"
                                changeHandler={changeValueSlider}
                                minRange="1"
                                maxRange="400"
                                step="1"
                                value={priceSlider}
                            >
                            </Slider>
                        </div>

                        <div className={styles["filter-item"]}>
                            <h5>Minimale beoordeling</h5>
                            <div className={styles["rating-column"]}>
                                {/*<InputField*/}
                                {/*    classNameLabel="rating-row"*/}
                                {/*    classNameInputField="radio-checkbox"*/}
                                {/*    name="zero-star"*/}
                                {/*    type="radio"*/}
                                {/*    value="0"*/}
                                {/*    nameInputField="rating"*/}
                                {/*    onChange={handleChangeRating}*/}
                                {/*    checked={minRating === 0 ? "checked"*/}
                                {/*        : null}*/}
                                {/*></InputField>*/}

                                <label className={styles["rating-row"]} htmlFor="zero-star">
                                    <input className={styles["radio-checkbox"]}
                                           type="radio"
                                           name="rating"
                                           value="0"
                                           id="zero-star"
                                           checked={minRating === 0 ? "checked"
                                               : null}
                                           onChange={handleChangeRating}
                                    />
                                    <StarRating rating={0}></StarRating>
                                </label>
                                <input className={styles["radio-checkbox"]}
                                       type="radio"
                                       name="rating"
                                       value="1"
                                       id="one-star"
                                       checked={minRating === 1 ? "checked"
                                           : null}
                                       onChange={handleChangeRating}
                                />
                                <label className={styles["rating-row"]} htmlFor="one-star">
                                    <StarRating rating={1}></StarRating>
                                </label>
                                <input className={styles["radio-checkbox"]}
                                       type="radio"
                                       name="rating"
                                       value="2"
                                       id="two-star"
                                       checked={minRating === 2 ? "checked"
                                           : null}
                                       onChange={handleChangeRating}
                                />
                                <label className={styles["rating-row"]} htmlFor="two-star">
                                    <StarRating rating={2}></StarRating>
                                </label>
                                <input className={styles["radio-checkbox"]}
                                       type="radio"
                                       name="rating"
                                       value="3"
                                       id="three-star"
                                       checked={minRating === 3 ? "checked"
                                           : null}
                                       onChange={handleChangeRating}
                                />
                                <label className={styles["rating-row"]} htmlFor="three-star">
                                    <StarRating rating={3}></StarRating>
                                </label>
                                <input className={styles["radio-checkbox"]}
                                       type="radio"
                                       name="rating"
                                       value="4"
                                       id="four-star"
                                       checked={minRating === 4 ? "checked"
                                           : null}
                                       onChange={handleChangeRating}
                                />
                                <label className={styles["rating-row"]} htmlFor="four-star">
                                    <StarRating rating={4}></StarRating>
                                </label>
                                <input className={styles["radio-checkbox"]}
                                       type="radio"
                                       name="rating"
                                       value="5"
                                       id="five-star"
                                       checked={minRating === 5 ? "checked"
                                           : null}
                                       onChange={handleChangeRating}
                                />
                                <label className={styles["rating-row"]} htmlFor="five-star">
                                    <StarRating rating={5}></StarRating>
                                </label>
                            </div>
                        </div>

                        <div className={styles["filter-item"]}>
                            <h5>Waar vindt de workshop plaats</h5>
                            <Select
                                id="select-dropdown-environment"
                                name="select-dropdown-environment"
                                placeholder="Selecteer.."
                                value={environment}
                                onChange={setEnvironment}
                                options={optionsEnvironment}
                                isMulti={false}
                                isClearable={true}
                            />
                        </div>

                        <Button
                            type="text"
                            onClick={removeAllFilters}>
                            Alle filters wissen</Button>

                    </aside>


                    <section className={styles["overview__workshop-tiles"]}>
                        {workshopData && workshopData.map((workshop) => {
                            return (
                                <WorkshopTile
                                    key={workshop.id}
                                    workshopId={workshop.id}
                                    image={workshop.workshopPicUrl}
                                    isFavourite={workshop.isFavourite}
                                    workshoptitle={workshop.title}
                                    price={workshop.price}
                                    location={workshop.location}
                                    date={updateDateFormatShort(workshop.date)}
                                    category1={workshop.workshopCategory1}
                                    category2={workshop.workshopCategory2}
                                ></WorkshopTile>
                            )
                        })
                        }
                    </section>

                </section>
            </div>
        </main>
    )
        ;
}

export default Home;