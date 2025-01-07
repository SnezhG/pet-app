import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Image, ImageBackground } from 'react-native';
import PetEditFormScreen from "./PetEditFormScreen";
import { fetchPetById } from "../../queries/pet/petQueries";

export default function PetProfileScreen({ route }) {
    const [pet, setPet] = useState(null); // Начальное состояние — null, так как данные еще не загружены
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(null); // Для обработки ошибок

    const petId = route?.params?.petId; // ID питомца из параметров навигации

    useEffect(() => {
        if (petId) {
            fetchPetById(petId)
                .then((data) => {
                    setPet({
                        ...data,
                        image: data.photo ? `data:image/jpeg;base64,${data.photo}` : null,
                    });
                    setIsLoading(false);
                })
                .catch((err) => {
                    setError('Ошибка загрузки данных питомца');
                    setIsLoading(false);
                });
        } else {
            setError('ID питомца не указан');
            setIsLoading(false);
        }
    }, [petId, isEditing]);

    const handleSave = () => {
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text>Загрузка данных...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!pet) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Данные питомца отсутствуют</Text>
            </View>
        );
    }

    return (
        // Используем ImageBackground с фоновым изображением
        <ImageBackground source={require('../../../assets/background.png')} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {!isEditing ? (
                    <View>
                        {pet.image ? (
                            <Image source={{ uri: pet.image }} style={styles.image} />
                        ) : (
                            <View style={[styles.image, styles.placeholder]}>
                                <Text style={styles.placeholderText}>Фото отсутствует</Text>
                            </View>
                        )}
                        <Text style={styles.profileField}>
                            <Text style={styles.label}>Кличка: </Text>
                            {pet.name}
                        </Text>
                        <Text style={styles.profileField}>
                            <Text style={styles.label}>Вид: </Text>
                            {pet.species?.name}
                        </Text>
                        <Text style={styles.profileField}>
                            <Text style={styles.label}>Порода: </Text>
                            {pet.breed?.name}
                        </Text>
                        <Text style={styles.profileField}>
                            <Text style={styles.label}>Пол: </Text>
                            {pet.sex?.name}
                        </Text>
                        <Text style={styles.profileField}>
                            <Text style={styles.label}>Дата рождения: </Text>
                            {pet.birthDate}
                        </Text>
                        <Text style={styles.profileField}>
                            <Text style={styles.label}>Вес: </Text>
                            {pet.weight} кг
                        </Text>
                        <Text style={styles.profileField}>
                            <Text style={styles.label}>Примечания по здоровью: </Text>
                            {pet.health || 'Нет'}
                        </Text>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => setIsEditing(true)}
                        >
                            <Text style={styles.editButtonText}>Редактировать</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <PetEditFormScreen initialPet={pet} onSave={handleSave} />
                )}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Полупрозрачный фон для контента
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignSelf: 'center',
        marginBottom: 20,
        backgroundColor: '#e0e0e0',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#888',
        fontSize: 14,
    },
    profileField: {
        fontSize: 16,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    editButton: {
        backgroundColor: '#78A75A', // Новый цвет кнопки
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
