export function sortArrayBookings(array, sortValue) {
    let newArray;
    if (sortValue === 'bookingId'){

        newArray = array.map((booking) => {
            return booking
        });
        newArray.sort((a, b) => a.id - b.id);
    }
    if (sortValue === 'workshopId'){

        newArray = array.map((booking) => {
            return booking
        });
        newArray.sort((a, b) => a.workshopId - b.workshopId);
    }

    if (sortValue === 'dateBooking'){

        newArray = array.map((booking) => {
            return booking
        });
        newArray.sort((a, b) => new Date(a.dateOrder) - new Date(b.dateOrder));
    }

    if (sortValue === 'firstNameCustomer'){

        newArray = array.map((booking) => {
            return booking
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

    return newArray;
}