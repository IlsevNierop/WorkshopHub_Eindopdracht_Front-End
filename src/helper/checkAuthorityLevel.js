

export function checkAuthorityLevel(authorities) {

    if (authorities != null){

    const stringAuthorities = authorities.map((a) => {return a.authority});

        console.log(stringAuthorities);

        if (stringAuthorities.includes("ROLE_ADMIN")){
            return 'admin'
        }
        else if (stringAuthorities.includes("ROLE_WORKSHOPOWNER")){
            return 'workshopowner'
        }
        else {
            return 'customer'
        }

    }



    // if (authorities != null) {
    //     const adminAuthority = authorities.filter((a) => {
    //         return a.authority === 'ROLE_ADMIN'
    //     });
    //     if (!adminAuthority) {
    //         const workshopOwnerAuthority = authorities.filter((a) => {
    //             return a.authority === 'ROLE_WORKSHOPOWNER'
    //         });
    //     }
    //     if (!workshopOwnerAuthority) {
    //         const customerAuthority = authorities.filter((a) => {
    //             return a.authority === 'ROLE_CUSTOMER'
    //         });
    //     }
    // }


    return "hi";
}
