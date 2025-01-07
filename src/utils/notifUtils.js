import * as Notifications from "expo-notifications";

export const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
        alert('Не удалось получить разрешение на уведомления!');
        return;
    }
    return (await Notifications.getExpoPushTokenAsync()).data;
};