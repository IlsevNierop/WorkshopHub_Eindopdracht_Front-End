import {sortArrayHomePage} from "../sortArrayHomePage";
import {getWorkshopsFilteredCategories} from "./getWorkshopsFilteredCategories";
import {getWorkshopsFilteredDate} from "./getWorkshopsFilteredDate";
import {getWorkshopsFilteredLocation} from "./getWorkshopsFilteredLocation";
import {getWorkshopsFilteredPrice} from "./getWorkshopsFilteredPrice";
import {getWorkshopsFilteredRating} from "./getWorkshopsFilterRating";
import {getWorkshopsFilteredEnvironment} from "./getWorkshopsFilteredEnvironment";

export function filterWorkshopArray(originalWorkshopData, category, location, environment, priceSlider, minRating, dateRange, sortValue) {


    const filteredWorkshopsByCategories = getWorkshopsFilteredCategories(originalWorkshopData, category);
    const filteredWorkshopsByDate = getWorkshopsFilteredDate(filteredWorkshopsByCategories, dateRange);
    const filteredWorkshopsByLocation = getWorkshopsFilteredLocation(filteredWorkshopsByDate, location);
    const filteredWorkshopsByPrice = getWorkshopsFilteredPrice(filteredWorkshopsByLocation, priceSlider);
    const filteredWorkshopsByRating = getWorkshopsFilteredRating(filteredWorkshopsByPrice, minRating);
    const filteredWorkshopsByEnvironment = getWorkshopsFilteredEnvironment(filteredWorkshopsByRating, environment);

    if (sortValue) {
        return sortArrayHomePage(filteredWorkshopsByEnvironment, sortValue);
    }


    return filteredWorkshopsByEnvironment;
}