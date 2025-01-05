import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import {registerRequest} from "../../queries/auth/authQueries";

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        const response = await registerRequest({email, password});
        if (response.ok) {
            alert('Регистрация успешна!');
            navigation.navigate('Login');
        } else {
            alert('Ошибка регистрации');
        }
    };

    return (
        <View style={styles.container}>
            <Text>Регистрация</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Зарегистрироваться" onPress={handleRegister} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    input: { borderWidth: 1, marginVertical: 8, padding: 8, borderRadius: 4 },
});
