/*////////////////////////
    Table of Contents
    1. User API requests
    2. Workshop API requests
    3. Booking API requests
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


// TODO match order with backend
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
            signal: controller.signal,
        });
    return response.data;
}

export async function fetchFavouriteWorkshops(token, userId) {
    const response = await axios.get(`${baseUrl}workshops/favourites/${userId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
        });
    return response.data;
}

export async function fetchAllWorkshopsAdmin(token) {
    const response = await axios.get(`${baseUrl}workshops/admin/`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
        });
    return response.data;
}

export async function fetchAllWorkshopsOwnerByOwner(token, workshopOwnerId) {
    const response = await axios.get(`${baseUrl}workshops/workshopowner/all/${workshopOwnerId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
        });
    return response.data;
}

export async function fetchWorkshopsFromOwner(workshopOwnerId) {
    const response = await axios.get(`${baseUrl}workshops/workshopowner/${workshopOwnerId}`,
        {
            signal: controller.signal,
        });
    return response.data;
}
export async function fetchWorkshopsFromOwnerLoggedIn(token, workshopOwnerId, id) {
    const response = await axios.get(`${baseUrl}workshops/workshopowner/${workshopOwnerId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: {
                userId: id
            },
            signal: controller.signal,
        });
    return response.data;
}




export async function fetchSingleWorkshopDataAdmin(token, workshopId) {
    const response = await axios.get(`${baseUrl}workshops/admin/${workshopId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
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

export async function fetchWorkshopsToVerifyByAdmin(token) {
    const response = await axios.get(`${baseUrl}workshops/admin/verify`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
        });
    return response.data;
}

export async function fetchWorkshopsToVerifyByOwner(token, workshopOwnerId) {
    const response = await axios.get(`${baseUrl}workshops/workshopowner/verify/${workshopOwnerId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
        });
    return response.data;
}

export async function fetchSingleWorkshopDataToVerifyByAdmin(token, workshopId) {
    const response = await axios.get(`${baseUrl}workshops/admin/${workshopId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
             signal: controller.signal,
        });
    return response.data;
}
export async function fetchSingleWorkshopDataByOwner(token, workshopId, userId) {
    const response = await axios.get(`${baseUrl}workshops/workshopowner/workshop/${workshopId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: {
                userId: userId
            },
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


export async function createWorkshop(workshopOwnerId, token, title, date, starttime, endtime, price, location, category1, category2, inoroutdoors, amountparticipants, highlightedinfo, description, file) {

    const formData = new FormData();

    const workshopInputDto = {
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

    if (file) {
        formData.append("file", file);
    }

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

export async function updateAndVerifyWorkshopByAdmin(workshopId, token, title, date, starttime, endtime, price, location, category1, category2, inoroutdoors, amountparticipants, highlightedinfo, description, workshopVerified, feedbackAdmin, file) {

    const formData = new FormData();

    const workshopInputDto = {
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
        description: description,
        workshopVerified: workshopVerified,
        feedbackAdmin: feedbackAdmin
    };

    formData.append(
        "workshopInputDto",
        new Blob([JSON.stringify(workshopInputDto)], {
            type: "application/json",
        })
    );

    if (file) {
        formData.append("file", file);
    }

    const response = await axios.put(`${baseUrl}workshops/admin/${workshopId}`,
        formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
        });
    return response.data;
}

export async function updateWorkshopByWorkshopOwner(workshopId, workshopOwnerId, token, title, date, starttime, endtime, price, location, category1, category2, inoroutdoors, amountparticipants, highlightedinfo, description, workshopVerified, feedbackAdmin, file) {

    const formData = new FormData();

    const workshopInputDto = {
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
        description: description,
    };

    formData.append(
        "workshopInputDto",
        new Blob([JSON.stringify(workshopInputDto)], {
            type: "application/json",
        })
    );

    if (file) {
        formData.append("file", file);
    }

    const response = await axios.put(`${baseUrl}workshops/workshopowner/${workshopOwnerId}/${workshopId}`,
        formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
        });
    return response.data;
}

export async function verifyWorkshopByOwner(token, workshopId, publishWorkshop) {
    return await axios.put(`${baseUrl}workshops/workshopowner/verify/${workshopId}?publishWorkshop=${publishWorkshop}`, null,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
}


export async function removeWorkshop(token, workshopId) {
    return await axios.delete(`${baseUrl}workshops/workshopowner/${workshopId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
}

/* --------------- 3 Booking API requests ----------------------- */

export async function createBooking(token, amount, comments, customerId, workshopId) {
    const response = await axios.post(`${baseUrl}bookings/${customerId}/${workshopId}`, {
            amount: amount,
            commentsCustomer: comments,
        }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
    });
    return response.data;
}



