export function errorHandling(e) {
    const {status, data} = e.response;

    switch (status) {
        case 400:
            if (data.includes("Field error:")) {
                return "Een of meerdere velden zijn niet of niet juist ingevuld.";
            } else if (data.includes("already exists with the email")) {
                return "Er bestaat al een andere gebruiker met dit e-mailadres.";
            } else if (data.includes("not yet approved")) {
                return "Deze workshop kan pas gepubliceerd worden nadat een administrator goedkeuring heeft gegeven.";
            } else if (data.includes("relation")) {
                return "Deze workshop/boeking/review of dit account kan niet verwijderd worden, omdat het relaties heeft met andere workshops/boekingen/reviews of accounts. Je dient eerst de andere items te verwijderen voordat je dit itemt kunt verwijderen.";
            } else if (data.includes("verified the workshop for publishing")) {
                return "Deze workshop kan niet verwijderd worden, omdat de workshop eigenaar de workshop gepubliceerd heeft.";
            } else if (data.includes("can't add an authority two times")) {
                return "De gebruiker heeft deze rol al toegekend gekregen, het is niet mogelijk om een rol twee keer toe te kennen.";
            } else if (data.includes("can't book a workshop that has already taken place")) {
                return "Het is niet mogelijk een workshop in het verleden te boeken.";
            } else if (data.includes("spots are available for this workshop")) {
                return "Er zijn onvoldoende plekken beschikbaar voor deze workshop om deze boeking te doen.";
            } else if (data.includes("only submit 1 review per attended workshop")) {
                return "Je kan maar 1 review achterlaten per gevolgde workshop.";
            }
            break;
        case 401:
            return "De combinatie van e-mailadres en wachtwoord is ongeldig.";
        case 403:
            if (data.includes("verified owner")) {
                return "Pas als je account geverifieerd is kun je een workshop aanmaken en publiceren.";
            } else if (data.includes("workshop hasn't taken place yet")) {
                return "Je kunt (nog) geen review achterlaten. Of je hebt de workshop niet gevolgd, of de workshop heeft nog niet plaatsgevonden.";
            } else {
                return "Je hebt niet de juiste rechten voor deze handeling en/of pagina.";
            }
        case 404:
            if (data.includes("doesn't exist") && data.includes("user")) {
                return "Deze gebruiker bestaat niet.";
            } else if (data.includes("doesn't exist") && data.includes("workshop")) {
                return "Deze workshop bestaat niet.";
            } else if (data.includes("doesn't exist") && data.includes("review")) {
                return "Deze review bestaat niet.";
            } else if (data.includes("doesn't exist") && data.includes("booking")) {
                return "Deze boeking bestaat niet.";
            } else if (data.includes("doesn't exist") && data.includes("file")) {
                return "Dit bestand bestaat niet.";
            } else {
                return "Oeps, deze pagina is niet gevonden | 404";
            }
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 505:
            return "Een interne server error aan onze kant | " + status;
        default:
            return "Oeps er ging iets mis";
    }
}