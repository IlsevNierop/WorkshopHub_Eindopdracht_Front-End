export function returnHighestAuthority(authorities) {
    if (authorities != null) {
        const stringAuthorities = authorities.map((a) => {
            return a.authority
        });

        if (stringAuthorities.includes("ROLE_ADMIN")) {
            return 'admin'
        } else if (stringAuthorities.includes("ROLE_WORKSHOPOWNER")) {
            return 'workshopowner'
        } else {
            return 'customer'
        }
    } else {
        return null;
    }
}
