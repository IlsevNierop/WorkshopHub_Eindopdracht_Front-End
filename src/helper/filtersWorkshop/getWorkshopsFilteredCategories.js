export function getWorkshopsFilteredCategories(originalWorkshopData, category) {
    let arrayCategories = [];

    if (category.length > 0) {
        for (let i = 0; i < category.length; i++) {
            const filteredWorkshopsCategory = originalWorkshopData.filter((workshop) => {
                return (
                    category[i].label === workshop.workshopCategory1 ||
                    category[i].label === workshop.workshopCategory2
                );
            });
            if (filteredWorkshopsCategory != null) {
                arrayCategories.push(...filteredWorkshopsCategory);
            }
        }
    }

    const uniqueArrayCategories = Array.from(new Set(arrayCategories.map(JSON.stringify))).map(JSON.parse);

    if (uniqueArrayCategories.length === 0) {
        // console.log("null")
        return originalWorkshopData;
    }
    return uniqueArrayCategories;
}