/*////////////////////////
    Table of Contents
    1. User API requests
    2. Workshop API requests
    3.
    4.
    */

import axios from "axios";

const controller = new AbortController();

const baseUrl = "http://localhost:8080/"

// TODO moet gemakkelijker kunnen, niet elke pagina een hele try en catch

/* --------------- 1 User API requests ----------------------- */

export async function signIn(email, password) {
    const response = await axios.post(`${baseUrl}signin`, {
            email: email,
            password: password
        },
        {signal: controller.signal,});
    return response.data
}

export async function fetchDataWorkshopOwner(token, userId) {
    const response = await axios.get(`${baseUrl}users/workshopowner/${userId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
    });
    return response.data;
}


export async function fetchDataCustomer(token, userId) {
    const response = await axios.get(`${baseUrl}users/customer/${userId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
    });
    return response.data;
}

export async function createWorkshopOwner(firstname, lastname, email, password, workshopowner, companyname, kvknumber, vatnumber) {
    const response = await axios.post(`${baseUrl}users/workshopowner`, {
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password,
            workshopOwner: workshopowner,
            companyName: companyname,
            kvkNumber: kvknumber,
            vatNumber: vatnumber,
        },
        {
            signal: controller.signal,
        });
    return response.data;
}

export async function createCustomer(firstname, lastname, email, password, workshopowner) {
    const response = await axios.post(`${baseUrl}users/customer`, {
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password,
            workshopOwner: workshopowner,
        },
        {signal: controller.signal,});
    return response.data;
}


export async function updateWorkshopOwner(token, userId, firstname, lastname, email, password, companyname, kvknumber, vatnumber, workshopowner) {
    const response = await axios.put(`${baseUrl}users/workshopowner/${userId}`, {
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password,
            companyName: companyname,
            kvkNumber: kvknumber,
            vatNumber: vatnumber,
            workshopOwner: workshopowner
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
        });
    return response;
}


export async function updateCustomer(token, userId, firstname, lastname, email, password, workshopowner) {
    const response = await axios.put(`${baseUrl}users/customer/${userId}`, {
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password,
            workshopOwner: workshopowner,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            // TODO is het nodig bij een put een cleanup te hebben? Er wordt niets geladen op basis van de response
            signal: controller.signal,
        });
    return response;
}

export async function uploadProfilePic(token, userId, formData) {
    const response = await axios.post(`${baseUrl}uploadprofilepic/${userId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
        // TODO is het nodig bij een put een cleanup te hebben? Er wordt niets geladen op basis van de response
        signal: controller.signal,
    });
    return response;
}

export async function resetPassword(email, password) {
    const response = await axios.put(`${baseUrl}users/passwordrequest/${email}`, {
        newPassword: password
    });
    return response;
}


/* --------------- 2 Workshop API requests ----------------------- */

export async function fetchWorkshopData() {
    const response = await axios.get(`${baseUrl}workshops`,
        {
            signal: controller.signal,
        });
    return response.data;
}


export async function fetchWorkshopDataLoggedIn(token, id) {
    const response = await axios.get(`${baseUrl}workshops`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: {
                userId: id
            },
            // TODO is het nodig bij een put een cleanup te hebben? Er wordt niets geladen op basis van de response
            signal: controller.signal,
        });
    return response.data;
}

export async function fetchSingleWorkshopData(workshopId) {
    const response = await axios.get(`${baseUrl}workshops/${workshopId}`,
        {
            signal: controller.signal,
        });
    return response.data;
}

export async function fetchSingleWorkshopDataLoggedIn(token, id, workshopId) {
    const response = await axios.get(`${baseUrl}workshops/${workshopId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: {
                userId: id
            },
            // TODO is het nodig bij een put een cleanup te hebben? Er wordt niets geladen op basis van de response
            signal: controller.signal,
        });
    return response.data;
}


export async function addOrRemoveWorkshopFavourites(token, userId, workshopId, isFavourite) {
    const response = await axios.put(`${baseUrl}workshops/favourite/${userId}/${workshopId}?favourite=${!isFavourite}`, null,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
    return response;
}

//TODO add file to create workshop

export async function createWorkshop(workshopOwnerId, token, title, date, starttime, endtime, price, location, category1, category2, inoroutdoors, amountparticipants, highlightedinfo, description, file) {

    console.log(workshopOwnerId, token, title, date, starttime, endtime, price, location, category1, category2, inoroutdoors, amountparticipants, highlightedinfo, description)

    // const blob = new Blob([JSON.stringify({
    //     title: title,
    //     date: date,
    //     startTime: starttime,
    //     endTime: endtime,
    //     price: price,
    //     location: location,
    //     workshopCategory1: category1,
    //     workshopCategory2: category2,
    //     highlightedInfo: highlightedinfo,
    //     inOrOutdoors: inoroutdoors,
    //     amountOfParticipants: amountparticipants,
    //     description: description
    // })], {
    //     type: 'application/json' // Set the content type for the workshopInputDto part
    // })
    //
    // console.log(blob)
    //
    // formData.append('workshopInputDto', blob);
    //
    //
    // console.log("form data")
    // console.log(formData.entries().next().value)
    const formData = new FormData();

    const workshopInputDto ={
       title: title,
       date: date,
       startTime: starttime,
       endTime: endtime,
       price: price,
       location: location,
       workshopCategory1: category1,
       workshopCategory2: category2,
       highlightedInfo: highlightedinfo,
       inOrOutdoors: inoroutdoors,
       amountOfParticipants: amountparticipants,
       description: description
   };

    formData.append(
        "workshopInputDto",
        new Blob([JSON.stringify(workshopInputDto)], {
            type: "application/json",
        })
    );

    //TODO if file is empty length != 0?
    formData.append("file", file);

    const response = await axios.post(`${baseUrl}workshops/workshopowner/${workshopOwnerId}`,
        formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
    });
    return response.data;
}
//    const workshopInputDto = JSON.stringify({
//        title: title,
//        date: date,
//        startTime: starttime,
//        endTime: endtime,
//        price: price,
//        location: location,
//        workshopCategory1: category1,
//        workshopCategory2: category2,
//        highlightedInfo: highlightedinfo,
//        inOrOutdoors: inoroutdoors,
//        amountOfParticipants: amountparticipants,
//        description: description
//    });
//
//     const fileData = new FormData();
//
//     if (file) {
//         fileData.append('file', file);
//     }
//
//
//     const response = await axios.post(`${baseUrl}workshops/workshopowner/${workshopOwnerId}`, {
//         workshopInputDto, fileData}, {
//         headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//         },
//         signal: controller.signal,
//     });
//     return response.data;
// }