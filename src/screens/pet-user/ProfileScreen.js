import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { AuthContext } from "../../auth/AuthContext";
import { useNavigation } from "@react-navigation/native";
import {getEmail} from "../../auth/auth";

export default function ProfileScreen() {
    const { logout } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogout = async () => {
        await logout();
        alert('Вы вышли из профиля');
    };

    const handleAbout = () => {
        navigation.navigate('Documentation');
    };

    return (
        <ImageBackground
            source={require('../../../assets/background.png')}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Профиль</Text>
                <Text style={styles.userEmail}>{getEmail()}</Text>
                <TouchableOpacity style={styles.button} onPress={handleAbout}>
                    <Text style={styles.buttonText}>О приложении</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Выйти из профиля</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 30,
    },
    userEmail: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#78A75A',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 5,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
