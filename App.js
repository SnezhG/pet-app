import React, {useContext} from 'react';
import AppNavigator from "./src/navigation/AppNavigator";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {AuthContext, AuthProvider} from "./src/auth/AuthContext";
import LoadingScreen from "./src/screens/auth/LoadingScreen";
import HomeScreen from "./src/screens/HomeScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import MainAppStack from "./src/navigation/MainAppStack";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const Stack = createNativeStackNavigator();

const AuthStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

const AppStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

const AppNavigation = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="MainApp" component={MainAppStack} />
                </Stack.Navigator>
            ) : (
                <AuthStack />
            )}

        </NavigationContainer>
    );
};

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState('');

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received!', notification);
        });

        return () => subscription.remove();
    }, []);

    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}



async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
        return token;
    } else {
        alert('Must use physical device for Push Notifications');
    }
}

