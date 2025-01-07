import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import { fetchPetEventsByUserAndDate } from "../../queries/pet-event/petEventQueries";
import {useNavigation} from "@react-navigation/native";
import {extractTime} from "../../utils/dateUtils";

const PetEventsByDayScreen = ({ route }) => {
    const { date } = route.params;
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchPetEventsByUserAndDate(date)
            .then((data) => {
                setEvents(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке событий:', error);
            });
    }, []);

    const renderEvent = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('EventView', { eventId: item.id })}
        >
        <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.type.name}</Text>
            <Text style={styles.eventDescription}>
                {`\nПитомец: ${item.pet.name}\nВремя: ${extractTime(item.date)}`}
            </Text>
        </View>
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            source={require('../../../assets/background.png')}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.dateTitle}>События на {new Date(date).toLocaleDateString('ru-RU')}</Text>

                {loading ? (
                    <Text style={styles.loadingText}>Загрузка...</Text>
                ) : events.length > 0 ? (
                    <FlatList
                        data={events}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderEvent}
                    />
                ) : (
                    <Text style={styles.noEventsText}>На этот день событий нет</Text>
                )}
            </View>
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        margin: 10,
        borderRadius: 10,
    },
    dateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    eventItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#78A75A',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#78A75A',
    },
    eventDescription: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
        marginTop: 5,
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#999',
        marginTop: 20,
    },
    noEventsText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
        fontSize: 16,
    },
});

export default PetEventsByDayScreen;
