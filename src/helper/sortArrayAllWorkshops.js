export function sortArrayAllWorkshops(array, sortValue) {
    let newArray;
    if (sortValue === 'date'){

        newArray = array.map((workshop) => {
            return workshop
        });
        newArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    if (sortValue === 'companyname') {

        newArray = array.map((workshop) => {
            return workshop
        });
        newArray.sort(function (a, b) {
            const companyNameA = a.workshopOwnerCompanyName.toLowerCase();
            const companyNameB = b.workshopOwnerCompanyName.toLowerCase();
            if (companyNameB > companyNameA) {
                return -1;
            }
            if (companyNameB < companyNameA) {
                return 1;
            }
            return 0;
        });
    }
    if (sortValue === 'workshopId'){

        newArray = array.map((workshop) => {
            return workshop
        });
        newArray.sort((a, b) => a.id - b.id);
    }

    if (sortValue === 'title'){

        newArray = array.map((workshop) => {
            return workshop
        });
        newArray.sort(function (a, b) {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            if (titleB > titleA) {
                return -1;
            }
            if (titleB < titleA) {
                return 1;
            }
            return 0;
        });
    }
    return newArray;
}