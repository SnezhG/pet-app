const baseUrl = 'http://192.168.1.106:8090/api/dictionary';
const allSpeciesUrlPart = '/all-species'
const allBreedsBySpeciesUrlPart = "/all-breeds-by-species/";
const allPetEventTypesUrlPart = '/all-event-types';
const allSexesUrlPart = '/all-sexes';

export async function fetchAllSpecies() {
    const url = baseUrl + allSpeciesUrlPart;

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
        console.error(`Ошибка при запросе всех видов`, error);
        throw error;
    }
}

export async function fetchAllBreedsBySpecies(speciesId) {
    const url = baseUrl + allBreedsBySpeciesUrlPart + speciesId;

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
        console.error(`Ошибка при запросе всех пород для вида с id ${speciesId}`, error);
        throw error;
    }
}

export async function fetchAllPetEventTypes() {
    const url = baseUrl + allPetEventTypesUrlPart;

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
        console.error(`Ошибка при запросе всех типов событий`, error);
        throw error;
    }
}

export async function fetchAllSexes() {
    const url = baseUrl + allSexesUrlPart;

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
        console.error(`Ошибка при запросе всех полов`, error);
        throw error;
    }
}