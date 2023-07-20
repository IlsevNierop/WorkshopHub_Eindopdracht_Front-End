export function getWorkshopsFilteredLocation(array, location) {
    let arrayLocations = [];

    if (location.length > 0) {
        for (let i = 0; i < location.length; i++) {
            const filteredWorkshopsLocations = array.filter((workshop) => {
                return (
                    location[i].value === workshop.location
                );
            });
            if (filteredWorkshopsLocations != null) {
                arrayLocations.push(...filteredWorkshopsLocations);
            }
        }
    }

    const uniqueArrayLocations = Array.from(new Set(arrayLocations.map(JSON.stringify))).map(JSON.parse);

    if (location.length === 0) {
        return array;
    }
    return uniqueArrayLocations;
}