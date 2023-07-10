export function compareWorkshopsFiltered(categoryArray, dateArray) {
    if (categoryArray.length > 0) {
        return categoryArray.filter((obj1) => dateArray.some((obj2) => obj2.id === obj1.id));
    } else {
        return dateArray;
    }
}