import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {AuthContext, AuthProvider} from "../auth/AuthContext";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import LoadingScreen from "../screens/auth/LoadingScreen";
import MainAppStack from "./MainAppStack";

const Stack = createNativeStackNavigator();

const AuthStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

const AppNavigator = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? (
                <MainAppStack />
            ) : (
                <AuthStack />
            )}
        </NavigationContainer>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}
