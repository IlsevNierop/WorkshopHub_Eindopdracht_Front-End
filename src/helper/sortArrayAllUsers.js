export function sortArrayAllUsers(array, sortValue) {
    let newArray;
    if (sortValue === 'userId') {

        newArray = array.map((user) => {
            return user;
        });
        newArray.sort((a, b) => a.id - b.id);
    }

    if (sortValue === 'firstName') {

        newArray = array.map((user) => {
            return user;
        });
        newArray.sort(function (a, b) {
            const firstNameA = a.firstName.toLowerCase();
            const firstNameB = b.firstName.toLowerCase();
            if (firstNameB > firstNameA) {
                return -1;
            }
            if (firstNameB < firstNameA) {
                return 1;
            }
            return 0;
        });
    }
    if (sortValue === 'verified') {

        newArray = array.map((user) => {
            return user;
        });
        newArray.sort(function (a, b) {
            const workshopOwnerA = a.workshopOwner;
            const workshopOwnerB = b.workshopOwner;
            const verifiedA = a.workshopOwnerVerified;
            const verifiedB = b.workshopOwnerVerified;

            if (!workshopOwnerA && !workshopOwnerB) {
                return 0;
            }

            if (workshopOwnerA && workshopOwnerB) {
                if (verifiedB < verifiedA) {
                    return 1;
                }
                if (verifiedB > verifiedA) {
                    return -1;
                }
                return 0;
            }

            if (workshopOwnerA && !workshopOwnerB) {
                return -1;
            }

            return 1;
        });
    }

    return newArray;
}