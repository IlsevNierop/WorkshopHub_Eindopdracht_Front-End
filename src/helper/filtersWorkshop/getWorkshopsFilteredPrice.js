export function getWorkshopsFilteredPrice(array, price) {
    return array.filter((workshop) => {
        return workshop.price <= price;
    });
}