// mogelijk in een object een dieper object wat dan een dropdown menu creeert (onder workshops - goedkeuren workshops bijvoorbeeld)
//


export function navLinks(highestAuthority) {

    if (highestAuthority === 'admin') {
        return [
            {
                title: "Mijn Profiel",
                link: "/profiel",
            },
            {
                title: "Workshops",
                submenu: [
                    {
                        title: "Alle Workshops",
                        link: "/workshops",
                    },
                    {
                        title: "Goedkeuren Workshops",
                        link: "/goedkeurenworkshops",
                    },
                    {
                        title: "Nieuwe Workshop",
                        link: "/nieuweworkshop",
                    },

                ],
            }, {
                title: "Reviews",
                link: "/reviews",
            },
            {
                title: "Alle Boekingen",
                link: "/boekingen",
            },
            {
                title: "Gebruikers",
                link: "/test",
            }];
    } else if (highestAuthority === 'workshopowner') {
        return [
            {
                title: "Mijn Profiel",
                link: "/profiel",
            }, {
                title: "Workshops",
                submenu: [
                    {
                        //TODO filter toevoegen op deze pagina - welke moeten nog gepubliceerd worden - met icoontjes werken aantonen welke al geverifieerd zijn?
                        title: "Al Mijn Workshops",
                        link: "/workshops",
                    },
                    {
                        title: "Publiceren Workshops",
                        link: "/goedkeurenworkshops",
                    },
                    {
                        title: "Nieuwe Workshop",
                        link: "/nieuweworkshop",
                    },

                ],
            },
            {
                title: "Mijn Boekingen",
                link: "/boekingen",
            },
            {
                title: "Nieuwe Workshop",
                link: "/nieuweworkshop",
            }];
    } else {
        return [
            {
                title: "Mijn Profiel",
                link: "/profiel",
            },
            {
                title: "Mijn Boekingen",
                link: "/boekingen",
            },
            {
                title: "Mijn Reviews",
                link: "/reviews",
            }];
    }

}