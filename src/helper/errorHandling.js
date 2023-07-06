export function errorHandling(e) {
    console.error(e);

    if (e.response.status === 400 && e.response.data.includes("Field error:")) {
        return "Een of meerdere velden zijn niet of niet juist ingevuld";
    } else if (e.response.status === 400 && e.response.data.includes("already exists with the email")) {
        return "Er bestaat al een andere gebruiker met dit e-mailadres";
    } else if (e.response.status === 400 && e.response.data.includes("not yet approved")) {
        return "Deze workshop kan pas gepubliceerd worden nadat een administrator goedkeuring heeft gegeven";
    } else if (e.response.status === 400 && e.response.data.includes("relation")) {
        return "Deze workshop/boeking/review of dit account kan niet verwijderd worden, omdat het relaties heeft met andere workshops/boekingen/reviews of accounts";
    } else if (e.response.status === 400 && e.response.data.includes("verified the workshop for publishing")) {
        return "Deze workshop kan niet verwijderd worden, omdat de workshop eigenaar de workshop gepubliceerd heeft";
    } else if (e.response.status === 400 && e.response.data.includes("already exists with the email")) {
        return "Er bestaat al een andere gebruiker met dit e-mailadres";
    } else if (e.response.status === 400 && e.response.data.includes("can't add an authority two times")) {
        return "De gebruiker heeft deze rol al toegekend gekregen, het is niet mogelijk om een rol twee keer toe te kennen";
    } else if (e.response.status === 400 && e.response.data.includes("can't book a workshop that has already taken place")) {
        return "Het is niet mogelijk een workshop in het verleden te boeken";
    } else if (e.response.status === 400 && e.response.data.includes("spots are available for this workshop")) {
        return "Er zijn onvoldoende plekken beschikbaar voor deze workshop voor deze boeking";
    } else if (e.response.status === 400 && e.response.data.includes("only submit 1 review per attended workshop")) {
        return "Er kan maar 1 review achterlaten geworden per gevolgde workshop";
    } else if (e.response.status === 401) {
        return "De combinatie van e-mailadres en wachtwoord is niet geldig.";
    } else if (e.response.status === 403 && e.response.data.includes("verified owner")) {
        return "Pas als je account geverifieerd is kun je een workshop aanmaken en publiceren.";
    } else if (e.response.status === 403) {
        return "Je hebt niet de juiste rechten voor deze handeling en/of pagina.";
    } else if (e.response.status === 404 && e.response.data.includes("doesn't exist")) {
        return "Deze gebruiker, workshop, boeking of review bestaat niet";
    } else if (e.response.status === 404) {
        return "Oeps, deze pagina is niet gevonden | 404";
    } else if (e.response.status >= 500 && e.response.status < 600) {
        return "Een interne server error aan onze kant | 500";
    } else {
        return "Oeps er ging iets mis"
    }
}