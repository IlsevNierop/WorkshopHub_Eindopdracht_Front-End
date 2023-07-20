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
                        link: "/alleworkshops",
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
                submenu: [
                    {
                        title: "Alle Reviews",
                        link: "/allereviews",
                    },
                    {
                        title: "Goedkeuren Reviews",
                        link: "/goedkeurenreviews",
                    },
                    {
                        title: "Nieuwe Workshop",
                        link: "/nieuweworkshop",
                    },

                ],
            },
            {
                title: "Boekingen",
                link: "/test",
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
                        link: "/alleworkshops",
                    },
                    {
                        //TODO aparte pagina publiceren workshops?
                        title: "Goedkeuren Workshops",
                        link: "/goedkeurenworkshops",
                    },
                    {
                        title: "Nieuwe Workshop",
                        link: "/nieuweworkshop",
                    },

                ],
            },
            {
                title: "Reviews",
                link: "/test",
            },
            {
                title: "Boekingen",
                link: "/test",
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
                link: "/test",
            },
            {
                title: "Mijn Reviews",
                link: "/test",
            }];
    }

}