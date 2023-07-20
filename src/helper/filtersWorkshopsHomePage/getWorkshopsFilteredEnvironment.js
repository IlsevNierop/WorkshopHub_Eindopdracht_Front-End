export function getWorkshopsFilteredEnvironment(array, environment) {
    if (environment != null && environment.value) {
        return array.filter((workshop) => {
            return workshop.inOrOutdoors === environment.value;
        });
    }
    return array;
}