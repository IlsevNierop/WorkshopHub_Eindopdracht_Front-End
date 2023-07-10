import {sortArray} from "../sortArray";
import {transformDateRangeToDateFormat} from "../transformDateRangeToDateFormat";
import {getWorkshopsFilteredCategories} from "./getWorkshopsFilteredCategories";
import {getWorkshopsFilteredDate} from "./getWorkshopsFilteredDate";
import {compareWorkshopsFiltered} from "./compareWorkshopsFiltered";
import {getWorkshopsFilteredLocation} from "./getWorkshopsFilteredLocation";
import {getWorkshopsFilteredPrice} from "./getWorkshopsFilteredPrice";
import {getWorkshopsFilteredRating} from "./getWorkshopsFilterRating";
import {getWorkshopsFilteredEnvironment} from "./getWorkshopsFilteredEnvironment";

export function filterWorkshopArray(originalWorkshopData, category, location, environment, priceSlider, minRating, dateRange, sortValue) {
    console.log(originalWorkshopData);

    //TODO volgordelijkheid eruit halen

        const filteredWorkshopsByCategories = getWorkshopsFilteredCategories(originalWorkshopData, category);
    console.log("category")
    console.log(filteredWorkshopsByCategories)
        const filteredWorkshopsByDate = getWorkshopsFilteredDate(filteredWorkshopsByCategories, dateRange);
    console.log("date")
    console.log(filteredWorkshopsByDate)
    const filteredWorkshopsByLocation = getWorkshopsFilteredLocation(filteredWorkshopsByDate, location);
    console.log("location")
    console.log(filteredWorkshopsByLocation)
    const filteredWorkshopsByPrice = getWorkshopsFilteredPrice(filteredWorkshopsByLocation, priceSlider);
    console.log("price")
    console.log(filteredWorkshopsByPrice)
    const filteredWorkshopsByRating = getWorkshopsFilteredRating(filteredWorkshopsByPrice, minRating);
    console.log("price")
    console.log(filteredWorkshopsByRating)
    const filteredWorkshopsByEnvironment = getWorkshopsFilteredEnvironment(filteredWorkshopsByRating, environment);
    console.log("inoutdoors")
    console.log(filteredWorkshopsByEnvironment)

        // const filteredWorkshopsAllFilters = compareWorkshopsFiltered(filteredWorkshopsByCategories, filteredWorkshopsByDate);


    //TODO when values stay the same, but others change - it now uses the original full array.

    if (sortValue) {
        console.log(filteredWorkshopsByEnvironment)
        const sortedUniqueArray = sortArray(filteredWorkshopsByEnvironment, sortValue);
        console.log("sorted array")
        console.log(sortedUniqueArray);
        return sortedUniqueArray;
    }


    return filteredWorkshopsByEnvironment;
}