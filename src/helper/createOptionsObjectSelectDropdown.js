export function createOptionsObjectSelectDropdown(array, variable1, variable2) {
    if (array) {

        const arrayAllOptions = array.map((workshop) => {
            if (workshop[variable1] !== null)
            {
                return workshop[variable1];
            }
            }
        ).filter((value) => value !== undefined);

        let arrayAllOptions2 = [];

        if (variable2 != null) {
            arrayAllOptions2 = array.map((workshop) => {
                    if (workshop[variable2] !== null)
                    {
                        return workshop[variable2];
                    }
                }
            ).filter((value) => value !== undefined);
        }

        arrayAllOptions.push(...arrayAllOptions2);

        const uniqueArray = Array.from(new Set(arrayAllOptions.map(JSON.stringify))).map(JSON.parse);

        return uniqueArray.map((value) => {
                return {value: `${value}`, label: `${value}`}
            }
        );
    }

}