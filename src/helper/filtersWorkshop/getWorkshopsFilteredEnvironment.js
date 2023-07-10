export function getWorkshopsFilteredEnvironment(array, environment) {
    return array.filter((workshop) => {
        return workshop.inOrOutdoors === environment.value;
    });
}