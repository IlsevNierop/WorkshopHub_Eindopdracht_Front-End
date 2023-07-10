export function getWorkshopsFilteredLocation(filteredWorkshopsByDate, location) {
    let arrayLocations = [];

    if (location.length > 0) {
        for (let i = 0; i < location.length; i++) {
            const filteredWorkshopsLocations = filteredWorkshopsByDate.filter((workshop) => {
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

    if (uniqueArrayLocations.length === 0) {
        // console.log("null locations")
        return filteredWorkshopsByDate;
    }
    return uniqueArrayLocations;
}