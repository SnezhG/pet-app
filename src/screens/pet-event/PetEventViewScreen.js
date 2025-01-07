import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { fetchPetEventById } from "../../queries/pet-event/petEventQueries";
import { useNavigation } from "@react-navigation/native";
import {formatDateTime} from "../../utils/dateUtils";

const PetEventViewScreen = ({ route }) => {
    const { eventId } = route.params;
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchPetEventById(eventId)
            .then((data) => {
                setEventDetails(data);
                setLoading(false);
            })
            .catch((error) => {
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
        <ImageBackground
            source={require('../../../assets/background.png')} // Укажите путь к вашему фоновому изображению
            style={styles.backgroundImage}
        >
            <ScrollView style={styles.container}>
                <Text style={styles.date}>{formatDateTime(eventDetails.date)}</Text>
                <Text style={styles.sectionTitle}>Описание</Text>
                <Text style={styles.description}>{eventDetails.description}</Text>
                <Text style={styles.sectionTitle}>Питомец</Text>
                <Text style={styles.petName}>{eventDetails.pet.name}</Text>
                <Text style={styles.sectionTitle}>Тип события</Text>
                <Text style={styles.eventType}>{eventDetails.type.name}</Text>
                <Text style={styles.sectionTitle}>Уведомление</Text>
                <Text style={styles.notif}>{eventDetails.isNotifEnabled ? "Включено" : "Отключено"}</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEditEvent}>
                    <Text style={styles.editButtonText}>Редактировать событие</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Полупрозрачный белый фон
        margin: 10,
        borderRadius: 10,
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
    date: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#000000',
    },
    description: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 10,
    },
    petName: {
        fontSize: 16,
        color: '#333',
    },
    eventType: {
        fontSize: 16,
        color: '#333',
    },
    notif: {
        fontSize: 16,
        color: '#333',
    },
    editButton: {
        marginVertical: 20,
        padding: 15,
        backgroundColor: '#78A75A',
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default PetEventViewScreen;
