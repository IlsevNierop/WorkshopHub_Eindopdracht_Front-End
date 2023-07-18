// mogelijk in een object een dieper object wat dan een dropdown menu creeert (onder workshops - goedkeuren workshops bijvoorbeeld)
//


import {returnHighestAuthority} from "../../helper/returnHighestAuthority";

export function navLinks(authorities) {

    const highestAuthority = returnHighestAuthority(authorities);

        if (highestAuthority === 'admin') {
            return [
                {
                    title: "Mijn Profiel",
                    link: "/profiel",
                },
                {
                    title: "Goedkeuren Workshops",
                    link: "/goedkeurenworkshops",
                },
                {
                    title: "Nieuwe Workshops",
                    link: "/nieuweworkshop",
                },
                {
                    title: "Goedkeuren Reviews",
                    link: "/test",
                },
                {
                    title: "Workshops",
                    link: "/test",
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
                    title: "Gebruikers",
                    link: "/test",
                }];
        } else if (highestAuthority === 'workshopowner') {
            return [
                {
                    title: "Mijn Profiel",
                    link: "/profiel",
                },
                {
                    title: "Mijn Workshops",
                    link: "/test",
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