import {sortArray} from "./sortArray";
import {transformDateRangeToDateFormat} from "./transformDateRangeToDateFormat";

export function filterWorkshopArray(originalWorkshopData, category, location, environment, priceSlider, minRating, dateRange, sortValue) {

    //TODO simplify by breaking into different helper functions
    let newArrayCategories = [];

    if (category.length > 0) {
        let filteredWorkshopsCategory;
        for (let i = 0; i < category.length; i++) {
            filteredWorkshopsCategory = originalWorkshopData.filter((workshop) => {
                return (
                    category[i].label === workshop.workshopCategory1 ||
                    category[i].label === workshop.workshopCategory2
                );
            });
            if (filteredWorkshopsCategory != null) {
                newArrayCategories.push(...filteredWorkshopsCategory);
            }
        }
    }
    const uniqueCategoryArray = Array.from(new Set(newArrayCategories.map(JSON.stringify))).map(JSON.parse);

    //date
    let filteredWorkshopsByDate = [];
    if (dateRange[0].endDate == null) {
        filteredWorkshopsByDate = originalWorkshopData.filter((workshop) => {
            return (
                workshop.date >= transformDateRangeToDateFormat(dateRange[0].startDate)
            );
        });
    } else {
        filteredWorkshopsByDate = originalWorkshopData.filter((workshop) => {
            return (
                workshop.date >= transformDateRangeToDateFormat(dateRange[0].startDate) && workshop.date <= transformDateRangeToDateFormat(dateRange[0].endDate)
            );
        });
    }

    let newArrayCompared;

    if (uniqueCategoryArray.length > 0) {
        newArrayCompared = uniqueCategoryArray.filter(obj1 => filteredWorkshopsByDate.some(obj2 => obj2.id === obj1.id));
    }
    else {
        newArrayCompared = filteredWorkshopsByDate;
    }



    // TODO filter for all filters


    console.log("new array")
    console.log(newArrayCompared);

    if (sortValue) {
        const sortedUniqueArray = sortArray(newArrayCompared, sortValue);
        console.log("sorted array")
        console.log(sortedUniqueArray);
        return sortedUniqueArray;
    }


    return newArrayCompared;
}