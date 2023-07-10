export function getWorkshopsFilteredCategories(array, category) {
    let arrayCategories = [];

    if (category.length > 0) {
        for (let i = 0; i < category.length; i++) {
            const filteredWorkshopsCategory = array.filter((workshop) => {
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

    if (category.length === 0) {
        return array;
    }
    return uniqueArrayCategories;
}