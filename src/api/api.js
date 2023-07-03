import axios from "axios";

const baseUrl = "http://localhost:8080/"


// ............user api requests

export async function fetchDataWorkshopOwner(token, userId) {
    const response = await axios.get(`${baseUrl}users/workshopowner/${userId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        // signal: controller.signal,
    });
    return response.data;
}


export async function fetchDataCustomer(token, userId) {
    const response = await axios.get(`${baseUrl}users/customer/${userId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        // signal: controller.signal,
    });
    return response.data;
}

export async function updateWorkshopOwner(token, userId, firstname, lastname, email, companyname, kvknumber, vatnumber, workshopowner) {
    const response = await axios.put(`${baseUrl}users/workshopowner/${userId}`, {
            firstName: firstname,
            lastName: lastname,
            email: email,
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
        });
    return response.data;
}



export async function updateCustomer(token, userId, firstname, lastname, email, workshopowner) {
    const response = await axios.put(`${baseUrl}users/customer/${userId}`, {
            firstName: firstname,
            lastName: lastname,
            email: email,
            workshopOwner: workshopowner
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        // signal: controller.signal,
        });
    return response.data;
}

