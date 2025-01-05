import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {AuthContext} from "../../auth/AuthContext";
import {useNavigation} from "@react-navigation/native";

export default function ProfileScreen() {
    const { logout } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogout = async () => {
        await logout();
        alert('Вы вышли из профиля');
    };

    const handleAbout = () => {
        navigation.navigate('Documentation'); // Переход на экран документации
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Профиль</Text>
            <Button title="О приложении" onPress={handleAbout} />
            <Button title="Выйти из профиля" onPress={handleLogout} style={styles.logoutButton} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    logoutButton: {
        marginTop: 20,
    },
});
