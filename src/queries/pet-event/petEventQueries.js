import {getToken} from "../../auth/auth";
import {baseUrl} from "../../utils/constant";

const petEventUrlPart = '/event';
const byUserWeekUrlPart = '/by-user-week';
const byUserAllUrlPart = '/by-user-all';
const byDateAndUserUrlPart = "/by-date/"
const createUrlPart = "/create";
const updateUrlPart = "/update";

export async function fetchPetEventById(id) {

    const url = baseUrl + petEventUrlPart + "/" + id;

    try {
        const token = await getToken();
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer: ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Ошибка при запросе события с id ${id}:`, error);
        throw error;
    }
}

export async function fetchPetEventByUserOnWeek() {

    const url = baseUrl + petEventUrlPart + byUserWeekUrlPart;

    try {
        const token = await getToken();
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer: ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Ошибка при запросе событий для пользователя с id ${id}:`, error);
        throw error;
    }
}

export async function fetchPetEventsByUser() {

    const url = baseUrl + petEventUrlPart + byUserAllUrlPart;

    try {
        const token = await getToken();
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer: ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Ошибка при запросе событий для пользователя с id ${id}:`, error);
        throw error;
    }
}

export async function fetchPetEventsByUserAndDate(date) {

    const url = baseUrl + petEventUrlPart + byDateAndUserUrlPart + date;

    try {
        const token = await getToken();
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer: ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Ошибка при запросе событий для пользователя с id ${id} для даты ${date}:`, error);
        throw error;
    }
}

export async function createPetEvent(petEventDTO) {
    const url = baseUrl + petEventUrlPart + createUrlPart;

    try {
        const token = await getToken();
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer: ${token}`,
            },
            body: JSON.stringify(petEventDTO),
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Ошибка при создании события:`, error);
        throw error;
    }
}

export async function updatePetEvent(petEventDTO) {
    const url = baseUrl + petEventUrlPart + updateUrlPart;
    try {
        const token = await getToken();
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer: ${token}`,
            },
            body: JSON.stringify(petEventDTO),
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Ошибка при обновлении события:`, error);
        throw error;
    }
}

export async function deletePetEvent(id) {

    const url = baseUrl + petEventUrlPart + "/" + id;

    try {
        const token = await getToken();
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer: ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Ошибка при удалении события с id ${id}:`, error);
        throw error;
    }
}