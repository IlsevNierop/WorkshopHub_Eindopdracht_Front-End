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
