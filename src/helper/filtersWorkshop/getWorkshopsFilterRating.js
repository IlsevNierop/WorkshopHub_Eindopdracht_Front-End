export function getWorkshopsFilteredRating(array, rating) {
    return array.filter((workshop) => {
        return workshop.averageRatingWorkshopOwnerReviews >= rating;
    });
}