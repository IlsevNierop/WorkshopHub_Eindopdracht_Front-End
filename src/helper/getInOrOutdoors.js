export function getInOrOutdoors(inOrOutdoors) {
    switch (inOrOutdoors) {
        case "INDOORS":
            return "Binnen";
        case "OUTDOORS":
            return "Buiten";
        case "IN_AND_OUTDOORS":
            return "Gedeeltelijk binnen en buiten";
        default:
            return "Binnen";
    }
}