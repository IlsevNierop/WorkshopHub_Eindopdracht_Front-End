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
import {sortArrayHomePage} from "../../helper/sortArrayHomePage";
import {filterWorkshopArray} from "../../helper/filtersWorkshopsHomePage/filterWorkshopArray";
import Button from "../../components/Button/Button";
import {createOptionsObjectSelectDropdown} from "../../helper/createOptionsObjectSelectDropdown";
import StarRating from "../../components/StarRating/StarRating";
import Slider from "../../components/Slider/Slider";
import InputField from "../../components/InputField/InputField";


function Home() {

    const {user} = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const controller = new AbortController();


    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);

    const [workshopData, setWorkshopData] = useState([]);
    const [originalWorkshopData, setOriginalWorkshopData] = useState([]);

    const [category, setCategory] = useState([]);
    const [location, setLocation] = useState([]);
    const [environment, setEnvironment] = useState([]);
    const [priceSlider, setPriceSlider] = useState(400);
    const [minRating, setMinRating] = useState(0);
    const [sortValue, setSortValue] = useState([]);
    const [optionsCategory, setOptionsCategory] = useState([]);
    const [optionsLocation, setOptionsLocation] = useState([]);

    const optionsEnvironment = [
        {value: "INDOORS", label: "Binnen"},
        {value: "OUTDOORS", label: "Buiten"},
        {value: "IN_AND_OUTDOORS", label: "Gedeeltelijk binnen en buiten"},
    ];

    const optionsSortValue = [
        {value: "date", label: "Datum"},
        {value: "pricelowtohigh", label: "Prijs - oplopend"},
        {value: "pricehightolow", label: "Prijs - aflopend"},
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

    useEffect(() => {
            async function fetchDataWorkshops() {
                toggleLoading(true);
                setError('');
                try {
                    let response;
                    if (user != null) {
                        response = await fetchWorkshopDataLoggedIn(token, user.id);
                    } else {
                        response = await fetchWorkshopData();
                    }


                    setWorkshopData
                    (response);
                    setOriginalWorkshopData(response);
                    setError('');
                } catch (e) {
                    setError(errorHandling(e));
                    console.log(error);
                }
                toggleLoading(false);
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


        setWorkshopData(sortArrayHomePage(workshopData, sortValue.value));

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
                        <label className="select-dropdown" htmlFor="select-dropdown-sort">Sorteer op:</label>
                        <Select className={styles["sort__dropdown"]}
                                id="select-dropdown-sort"
                                name="select-dropdown-sort"
                                label="select-dropdown-sort"
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

                            <label className="select-dropdown" htmlFor="select-dropdown-category">Categorie</label>
                            <Select
                                id="select-dropdown-category"
                                name="select-dropdown-category"
                                label="select-dropdown-category"
                                placeholder="Selecteer.."
                                value={category}
                                onChange={setCategory}
                                options={optionsCategory}
                                isMulti={true}

                            />
                        </div>

                        <div className={styles["filter-item"]}>
                            <label className={styles["date-range-picker"]} htmlFor="date-range">Wanneer</label>
                            <DateRange
                                label="date-range"
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
                            <label className="select-dropdown" htmlFor="select-dropdown-location">Locatie</label>
                            <Select
                                id="select-dropdown-location"
                                name="select-dropdown-location"
                                label="select-dropdown-location"
                                placeholder="Selecteer.."
                                value={location}
                                onChange={setLocation}
                                options={optionsLocation}
                                isMulti={true}
                            />
                        </div>

                        <div className={styles["filter-item"]}>
                            <label className={styles["price-slider"]} htmlFor="price-slider">Maximale prijs</label>
                            <p>{priceSlider}</p>
                            <Slider
                                id="price"
                                name="price-slider"
                                label="price-slider"
                                changeHandler={changeValueSlider}
                                minRange="1"
                                maxRange="400"
                                step="1"
                                value={priceSlider}
                            >
                            </Slider>
                        </div>

                        <div className={styles["filter-item"]}>
                            <label className={styles["minimum-rating"]} htmlFor="minimum-rating">Minimale beoordeling</label>
                            <div className={styles["rating-column"]}>
                                <InputField
                                    classNameLabel="rating-row"
                                    classNameInputField="radio-checkbox"
                                    name="zero-star"
                                    type="radio"
                                    value={0}
                                    nameInputField="rating"
                                    onChangeHandler={handleChangeRating}
                                    minRating={minRating}
                                >
                                    <StarRating rating={0} size={20}></StarRating>
                                </InputField>
                                <InputField
                                    classNameLabel="rating-row"
                                    classNameInputField="radio-checkbox"
                                    name="one-star"
                                    type="radio"
                                    value={1}
                                    nameInputField="rating"
                                    onChangeHandler={handleChangeRating}
                                    minRating={minRating}
                                >
                                    <StarRating rating={1} size={20}></StarRating>
                                </InputField>
                                <InputField
                                    classNameLabel="rating-row"
                                    classNameInputField="radio-checkbox"
                                    name="two-star"
                                    type="radio"
                                    value={2}
                                    nameInputField="rating"
                                    onChangeHandler={handleChangeRating}
                                    minRating={minRating}
                                >
                                    <StarRating rating={2} size={20}></StarRating>
                                </InputField>
                                <InputField
                                    classNameLabel="rating-row"
                                    classNameInputField="radio-checkbox"
                                    name="three-star"
                                    type="radio"
                                    value={3}
                                    nameInputField="rating"
                                    onChangeHandler={handleChangeRating}
                                    minRating={minRating}
                                >
                                    <StarRating rating={3} size={20}></StarRating>
                                </InputField>
                                <InputField
                                    classNameLabel="rating-row"
                                    classNameInputField="radio-checkbox"
                                    name="four-star"
                                    type="radio"
                                    value={4}
                                    nameInputField="rating"
                                    onChangeHandler={handleChangeRating}
                                    minRating={minRating}
                                >
                                    <StarRating rating={4} size={20}></StarRating>
                                </InputField>
                                <InputField
                                    classNameLabel="rating-row"
                                    classNameInputField="radio-checkbox"
                                    name="five-star"
                                    type="radio"
                                    value={5}
                                    nameInputField="rating"
                                    onChangeHandler={handleChangeRating}
                                    minRating={minRating}
                                >
                                    <StarRating rating={5} size={20}></StarRating>
                                </InputField>
                            </div>
                        </div>

                        <div className={styles["filter-item"]}>
                            <label className="select-dropdown" htmlFor="select-dropdown-environment">Waar vindt de workshop plaats</label>
                            <Select
                                id="select-dropdown-environment"
                                name="select-dropdown-environment"
                                label="select-dropdown-environment"
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
                        {workshopData.length === 0 &&
                            <h3>Er zijn geen workshop die aan deze filters voldoen</h3>
                        }
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
                                    link={`/workshop/${workshop.id}`}
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