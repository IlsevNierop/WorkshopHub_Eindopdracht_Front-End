import {transformDateRangeToDateFormat} from "../transformDateRangeToDateFormat";

export function getWorkshopsFilteredDate(filteredWorkshopsByCategories, dateRange) {
    return filteredWorkshopsByCategories.filter((workshop) => {
        const startDate = transformDateRangeToDateFormat(dateRange[0].startDate);
        const endDate = dateRange[0].endDate ? transformDateRangeToDateFormat(dateRange[0].endDate) : null;

        if (endDate) {
            return workshop.date >= startDate && workshop.date <= endDate;
        } else {
            return workshop.date >= startDate;
        }
    });
}