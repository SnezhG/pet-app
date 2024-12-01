const baseUrl = 'http://192.168.1.106:8090/api/pet/';
const byUserUrlPart = 'by-user/'
const updateUrlPart = 'edit';

export async function fetchPetsByUserId(userId) {

    const url = baseUrl + byUserUrlPart + userId;

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
        console.error(`Ошибка при запросе питомцев пользователя ${userId}:`, error);
        throw error;
    }
}

export async function fetchPetById(id) {
    const url = baseUrl + id;

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
        console.log(data)
        return data;
    } catch (error) {
        console.error(`Ошибка при запросе питомца с id ${id}:`, error);
        throw error;
    }
}

export async function updatePet(petDTO) {
    const url = baseUrl + updateUrlPart;
    console.log("petDTO", petDTO)
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
