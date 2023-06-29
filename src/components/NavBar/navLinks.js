// mogelijk in een object een dieper object wat dan een dropdown menu creeert (onder workshops - goedkeuren workshops bijvoorbeeld)
//


export function navLinks(authorities) {


    if (authorities != null) {

        const stringAuthorities = authorities.map((a) => {
            return a.authority
        });

        console.log(stringAuthorities);

        if (stringAuthorities.includes("ROLE_ADMIN")) {
            return [
                {
                    title: "Mijn Profiel",
                    link: "/test",
                },
                {
                    title: "Goedkeuren Workshops",
                    link: "/test",
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
        } else if (stringAuthorities.includes("ROLE_WORKSHOPOWNER")) {
            return [
                {
                    title: "Mijn Profiel",
                    link: "/test",
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
                    link: "/test",
                }];
        } else {
            return [
                {
                    title: "Mijn Profiel",
                    link: "/test",
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

}