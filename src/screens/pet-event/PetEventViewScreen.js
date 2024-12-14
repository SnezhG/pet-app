import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';
import {fetchPetEventById} from "../../queries/pet-event/petEventQueries";
import {useNavigation} from "@react-navigation/native";

const PetEventViewScreen = ({ route }) => {
    const { eventId } = route.params;
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchPetEventById(eventId).then((data) => {
            console.log(data)
            setEventDetails(data);
            setLoading(false)
        }).catch((error) => {
            console.error('Ошибка при загрузке события:', error);
        });
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    if (!eventDetails) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Не удалось загрузить информацию о событии.</Text>
            </View>
        );
    }

    const handleEditEvent = () => {
        navigation.navigate('EventEdit', { eventId });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.date}>{eventDetails.date}</Text>
            <Text style={styles.sectionTitle}>Описание</Text>
            <Text style={styles.description}>{eventDetails.description}</Text>
            <Text style={styles.sectionTitle}>Питомец</Text>
            <Text style={styles.petName}>{eventDetails.pet.name}</Text>
            <Text style={styles.sectionTitle}>Тип события</Text>
            <Text style={styles.eventType}>{eventDetails.type.name}</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEditEvent}>
                <Text style={styles.editButtonText}>Редактировать событие</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
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
        fontSize: 16,
        color: 'red',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    date: {
        fontSize: 16,
        color: '#4CAF50',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
    },
    petName: {
        fontSize: 16,
        color: '#333',
    },
    eventType: {
        fontSize: 16,
        color: '#333',
    },
});

export default PetEventViewScreen;
