import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import {AuthContext} from "../../auth/AuthContext";
import {authenticationRequest} from "../../queries/auth/authQueries";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        const response = await authenticationRequest({email, password});
        console.log("response", response)
        console.log("response.ok", response.ok)
        const { token } = response.token;
        await login(token);
    };

    return (
        <View style={styles.container}>
            <Text>Вход</Text>
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
            <Button title="Войти" onPress={handleLogin} />
            <Button title="Нет аккаунта? Регистрация" onPress={() => navigation.navigate('Register')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    input: { borderWidth: 1, marginVertical: 8, padding: 8, borderRadius: 4 },
});
