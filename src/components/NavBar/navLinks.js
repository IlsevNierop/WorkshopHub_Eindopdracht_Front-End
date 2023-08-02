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
                link: "/gebruikers",
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