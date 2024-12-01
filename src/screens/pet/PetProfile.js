import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import PetEditForm from "./PetEditForm";
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
                    setPet(data);
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
    }, [petId,isEditing]);

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
        <ScrollView contentContainerStyle={styles.container}>
            {!isEditing ? (
                <View>
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
                <PetEditForm initialPet={pet} onSave={handleSave} />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
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
        backgroundColor: '#FFA500',
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
