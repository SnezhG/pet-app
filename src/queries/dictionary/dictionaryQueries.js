import {getToken} from "../../auth/auth";
import {baseUrl} from "../../utils/constant";

const dictionaryUrlPart = '/dictionary';
const allSpeciesUrlPart = '/all-species'
const allBreedsBySpeciesUrlPart = "/all-breeds-by-species/";
const allPetEventTypesUrlPart = '/all-event-types';
const allSexesUrlPart = '/all-sexes';

export async function fetchAllSpecies() {
    const url = baseUrl + dictionaryUrlPart + allSpeciesUrlPart;

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
        console.error(`Ошибка при запросе всех видов`, error);
        throw error;
    }
}

export async function fetchAllBreedsBySpecies(speciesId) {
    const url = baseUrl + dictionaryUrlPart + allBreedsBySpeciesUrlPart + speciesId;

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
        console.error(`Ошибка при запросе всех пород для вида с id ${speciesId}`, error);
        throw error;
    }
}

export async function fetchAllPetEventTypes() {
    const url = baseUrl + dictionaryUrlPart + allPetEventTypesUrlPart;

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
        console.error(`Ошибка при запросе всех типов событий`, error);
        throw error;
    }
}

export async function fetchAllSexes() {
    const url = baseUrl + dictionaryUrlPart + allSexesUrlPart;

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
        console.error(`Ошибка при запросе всех полов`, error);
        throw error;
    }
}