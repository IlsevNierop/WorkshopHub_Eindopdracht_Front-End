export function sortArrayReviews(array, sortValue) {
    let newArray;
    if (sortValue === 'reviewId') {

        newArray = array.map((booking) => {
            return booking
        });
        newArray.sort((a, b) => a.id - b.id);
    }

    if (sortValue === 'companyNameWorkshopOwner') {

        newArray = array.map((booking) => {
            return booking
        });
        newArray.sort(function (a, b) {
            const companyNameWorkshopOwnerA = a.companyNameWorkshopOwner.toLowerCase();
            const companyNameWorkshopOwnerB = b.companyNameWorkshopOwner.toLowerCase();
            if (companyNameWorkshopOwnerB > companyNameWorkshopOwnerA) {
                return -1;
            }
            if (companyNameWorkshopOwnerB < companyNameWorkshopOwnerA) {
                return 1;
            }
            return 0;
        });
    }

    if (sortValue === 'rating') {

        newArray = array.map((booking) => {
            return booking
        });
        newArray.sort((a, b) => a.rating - b.rating);
    }

    if (sortValue === 'reviewVerified') {

        newArray = array.map((booking) => {
            return booking
        });
        newArray.sort(function (a, b) {
            const reviewVerifiedA = a.reviewVerified;
            const reviewVerifiedB = b.reviewVerified;
            if (reviewVerifiedB > reviewVerifiedA) {
                return -1;
            }
            if (reviewVerifiedB < reviewVerifiedA) {
                return 1;
            }
            return 0;
        });
    }

    if (sortValue === 'firstNameReviewer') {

        newArray = array.map((booking) => {
            return booking
        });
        newArray.sort(function (a, b) {
            const firstNameReviewerA = a.firstNameReviewer.toLowerCase();
            const firstNameReviewerB = b.firstNameReviewer.toLowerCase();
            if (firstNameReviewerB > firstNameReviewerA) {
                return -1;
            }
            if (firstNameReviewerB < firstNameReviewerA) {
                return 1;
            }
            return 0;
        });
    }

    return newArray;
}