export function filterWorkshopArray(originalWorkshopData, category, location, environment, priceSlider, minRating, dateRange) {
    let newArray = [];

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
                newArray.push(...filteredWorkshopsCategory);
            }
        }
    }
    // if (category.length > 0) {
    //     let filteredWorkshopsCategory;
    //     for (let i = 0; i < category.length; i++) {
    //         filteredWorkshopsCategory = originalWorkshopData.filter((workshop) => {
    //             return (
    //                 category[i].label === workshop.workshopCategory1 ||
    //                 category[i].label === workshop.workshopCategory2
    //             );
    //         });
    //         if (filteredWorkshopsCategory != null) {
    //             newArray.push(...filteredWorkshopsCategory);
    //         }
    //     }
    // }

    console.log("new array")
    console.log(newArray);

    const uniqueArray = Array.from(new Set(newArray.map(JSON.stringify))).map(JSON.parse);
    console.log("unique array")
    console.log(uniqueArray)

    return uniqueArray;
}