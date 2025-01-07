import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'jwt_token';
const EMAIL_KEY = 'user_email';

export const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
        console.error('Ошибка сохранения токена:', e);
    }
};

export const getToken = async () => {
    try {
        return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (e) {
        console.error('Ошибка получения токена:', e);
        return null;
    }
};

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (e) {
        console.error('Ошибка удаления токена:', e);
    }
};

export const saveEmail = async (email) => {
    try {
        await AsyncStorage.setItem(EMAIL_KEY, email);
    } catch (e) {
        console.error('Ошибка сохранения почты:', e);
    }
}

export const getEmail = async () => {
    try {
        return await AsyncStorage.getItem(EMAIL_KEY);
    } catch (e) {
        console.error('Ошибка получения почты:', e);
        return null;
    }
}

export const removeEmail = async () => {
    try {
        await AsyncStorage.removeItem(EMAIL_KEY);
    } catch (e) {
        console.error('Ошибка удаления почты:', e);
    }
};