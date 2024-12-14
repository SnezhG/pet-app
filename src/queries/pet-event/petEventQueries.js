const baseUrl = 'http://192.168.1.106:8090/api/event';
const byUserWeekUrlPart = '/by-user-week/';
const byUserAllUrlPart = '/by-user-all/';
const byDateAndUserUrlPart = "/by-date/"
const createUrlPart = "/create";
const updateUrlPart = "/update";

export async function fetchPetEventById(id) {

    const url = baseUrl + "/" + id;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

export async function fetchPetEventByUserOnWeek(id) {

    const url = baseUrl + byUserWeekUrlPart + id;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

export async function fetchPetEventsByUser(id) {

    const url = baseUrl + byUserAllUrlPart + id;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

export async function fetchPetEventsByUserAndDate(id, date) {

    const url = baseUrl + byDateAndUserUrlPart + id + "/" + date;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
    const url = baseUrl + createUrlPart;
    console.log("petEventDTO", petEventDTO)
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
    const url = baseUrl + updatePetEvent();
    console.log("petEventDTO", petEventDTO)
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

    const url = baseUrl + "/" + id;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
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