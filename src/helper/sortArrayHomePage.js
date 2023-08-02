export function sortArrayHomePage(array, sortValue) {
    let newArray;
    if (sortValue === 'pricelowtohigh') {

        newArray = array.map((workshop) => {
            return workshop
        });
        newArray.sort((a, b) => a.price - b.price);
    }
    if (sortValue === 'pricehightolow') {

        newArray = array.map((workshop) => {
            return workshop
        });
        newArray.sort((a, b) => b.price - a.price);
    }
    if (sortValue === 'date') {

        newArray = array.map((workshop) => {
            return workshop
        });
        newArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    if (sortValue === 'popular') {

        newArray = array.map((workshop) => {
            return workshop
        });
        newArray.sort((a, b) => b.amountOfFavsAndBookings - a.amountOfFavsAndBookings
        );
    }
    return newArray;
}