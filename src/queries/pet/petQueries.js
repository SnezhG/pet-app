import {baseUrl} from "../../utils/constant";
import {getToken} from "../../auth/auth";

const petUrlPart = '/pet'
const byUserUrlPart = '/by-user'
const updateUrlPart = '/update';
const createUrlPart = '/create';

export async function fetchPetsByUserId() {

    const url = baseUrl + petUrlPart + byUserUrlPart;

    try {
        const token = await getToken();
        console.log("token", token)
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
        console.error(`Ошибка при запросе питомцев пользователя:`, error);
        throw error;
    }
}

export async function fetchPetById(id) {
    const url = baseUrl + petUrlPart + "/" + id;

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
        console.log(data)
        return data;
    } catch (error) {
        console.error(`Ошибка при запросе питомца с id ${id}:`, error);
        throw error;
    }
}

export async function updatePet(petDTO) {
    const url = baseUrl + petUrlPart + updateUrlPart;
    try {
        const token = await getToken();
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer: ${token}`,
            },
            body: JSON.stringify(petDTO),
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Ошибка при обновлении питомца:`, error);
        throw error;
    }
}

export async function createPet(petDTO) {
    const url = baseUrl + petUrlPart + createUrlPart;
    try {
        const token = await getToken();
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer: ${token}`,
            },
            body: JSON.stringify(petDTO),
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Ошибка при создании питомца:`, error);
        throw error;
    }
}

export async function deletePet(id) {

    const url = baseUrl + petUrlPart + id;

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
        console.error(`Ошибка при питомца с id ${id}:`, error);
        throw error;
    }
}
