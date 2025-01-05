import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import {fetchPetEventsByUserAndDate} from "../../queries/pet-event/petEventQueries";

const PetEventsByDayScreen = ({ route }) => {
    const { date } = route.params;
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log(date)
    useEffect(() => {
        fetchPetEventsByUserAndDate(date).then((data) => {
            setEvents(data)
            setLoading(false)
        }).catch((error) => {
            console.error('Ошибка при загрузке событий:', error);
        });
    }, []);

    const renderEvent = ({ item }) => (
        <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDescription}>{item.description}</Text>
            <Text style={styles.eventTime}>{item.time}</Text>
        </View>
    );

    return (
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    dateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    eventItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    eventDescription: {
        fontSize: 14,
        color: '#555',
    },
    eventTime: {
        fontSize: 12,
        color: '#999',
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
