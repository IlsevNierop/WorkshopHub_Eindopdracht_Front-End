export function updateDateFormatLong(date) {

    const newDate = new Date(date);
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    return newDate.toLocaleDateString('nl-NL', options);
}