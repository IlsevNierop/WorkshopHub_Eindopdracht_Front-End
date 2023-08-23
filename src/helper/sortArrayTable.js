export function sortArrayTable(array, sortValue) {
    let newArray;
    if (sortValue === 'userId' || sortValue === 'bookingId' || sortValue === 'workshopId' || sortValue === 'reviewId') {
        newArray = array.map((item) => {
            return item;
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
    if (sortValue === 'workshopOwnerVerified') {
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
    if (sortValue === 'dateBooking') {
        newArray = array.map((booking) => {
            return booking;
        });
        newArray.sort((a, b) => new Date(a.dateOrder) - new Date(b.dateOrder));
    }

    if (sortValue === 'firstNameCustomer') {
        newArray = array.map((booking) => {
            return booking;
        });
        newArray.sort(function (a, b) {
            const firstNameCustomerA = a.firstNameCustomer.toLowerCase();
            const firstNameCustomerB = b.firstNameCustomer.toLowerCase();
            if (firstNameCustomerB > firstNameCustomerA) {
                return -1;
            }
            if (firstNameCustomerB < firstNameCustomerA) {
                return 1;
            }
            return 0;
        });
    }

    if (sortValue === 'bookingWorkshopId') {
        newArray = array.map((booking) => {
            return booking;
        });
        newArray.sort((a, b) => a.workshopId - b.workshopId);
    }

    if (sortValue === 'title') {
        newArray = array.map((workshop) => {
            return workshop;
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
    if (sortValue === 'workshopDate') {
        newArray = array.map((workshop) => {
            return workshop;
        });
        newArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    if (sortValue === 'companyname') {
        newArray = array.map((workshop) => {
            return workshop;
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
    if (sortValue === 'workshopVerified') {
        newArray = array.map((workshop) => {
            return workshop;
        });
        newArray.sort(function (a, b) {
            const verifiedA = a.workshopVerified;
            const verifiedB = b.workshopVerified;
            if (verifiedB > verifiedA) {
                return -1;
            }
            if (verifiedB < verifiedA) {
                return 1;
            }
            return 0;
        });
    }

    if (sortValue === 'companyNameWorkshopOwner') {
        newArray = array.map((review) => {
            return review;
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
        newArray = array.map((review) => {
            return review;
        });
        newArray.sort((a, b) => a.rating - b.rating);
    }

    if (sortValue === 'reviewVerified') {
        newArray = array.map((review) => {
            return review;
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

        newArray = array.map((review) => {
            return review;
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