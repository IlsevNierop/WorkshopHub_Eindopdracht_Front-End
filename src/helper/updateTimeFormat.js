export function updateTimeFormat(time) {

    const parts = time.split(":");

    return `${parts[0]}:${parts[1]}`;

}