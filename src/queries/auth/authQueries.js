const baseUrl = 'http://192.168.1.106:8090/api/auth';
const authenticationUrlPart = '/authenticate'
const registerUrlPart = '/register';

export async function authenticationRequest(authenticationRequest) {
    console.log("authenticationRequest", authenticationRequest)
    const url = baseUrl + authenticationUrlPart;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(authenticationRequest),
        });
        console.log("response", response)
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Ошибка при попытке авторизации:`, error);
        throw error;
    }
}

export async function registerRequest(registerRequest) {

    const url = baseUrl + registerUrlPart;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerRequest),
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Ошибка при попытке регистрации:`, error);
        throw error;
    }
}