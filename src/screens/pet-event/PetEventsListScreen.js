import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import {fetchPetEventByUserOnWeek} from "../../queries/pet-event/petEventQueries";
import {fetchPetEventsByUser} from "../../queries/pet-event/petEventQueries";
import {fetchAllSpecies} from "../../queries/dictionary/dictionaryQueries";

const PetEventsListScreen = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [weekEvents, setWeekEvents] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isCalendarExpanded, setCalendarExpanded] = useState(false);
    const [markedDates, setMarkedDates] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        fetchPetEventsByUser(1).then((data) => {
            setAllEvents(data);
            markDatesWithEvents(data);
        }).catch((error) => {
            console.error('Ошибка при загрузке событий:', error);
        });

        fetchPetEventByUserOnWeek(1).then((data) => {
            setWeekEvents(data);
        }).catch((error) => {
            console.error('Ошибка при загрузке событий:', error);
        })
    }, []);

    const convertDateToCalendarFormat = (date) => {
        const [day, month, year] = date.split('.'); // Разбиваем строку на части
        return `${year}-${month}-${day}`; // Собираем дату в формате YYYY-MM-DD
    };


    const markDatesWithEvents = (events) => {
        const marked = {};
        events.forEach((event) => {
            const formattedDate = convertDateToCalendarFormat(event.date); // Преобразование формата
            marked[formattedDate] = { marked: true, dotColor: 'blue' };
        });
        console.log(marked)
        setMarkedDates(marked);
    };

    const handleDayPress = (day) => {
        setSelectedDay(day.dateString);
        navigation.navigate('EventsByDay', { date: day.dateString });
    };

    const renderEvent = ({ item }) => (
        <TouchableOpacity
            style={styles.eventItem}
            onPress={() => navigation.navigate('EventView', { eventId: item.id })}
        >
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDescription}>{item.description}</Text>
            <Text style={styles.eventTime}>{item.time}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setCalendarExpanded(!isCalendarExpanded)}
                style={styles.calendarToggleButton}
            >
                <Text style={styles.calendarToggleButtonText}>
                    {isCalendarExpanded ? 'Скрыть календарь' : 'Показать календарь'}
                </Text>
            </TouchableOpacity>

            {isCalendarExpanded && (
                <Calendar
                    markedDates={markedDates}
                    onDayPress={handleDayPress}
                    theme={{
                        todayTextColor: '#4CAF50',
                        arrowColor: '#4CAF50',
                        selectedDayBackgroundColor: '#4CAF50',
                    }}
                />
            )}

            <TouchableOpacity
                style={styles.addEventButton}
                onPress={() => navigation.navigate('EventCreate')} // Переход на экран EventCreate
            >
                <Text style={styles.addEventButtonText}>Добавить событие</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>События на неделю</Text>
            <FlatList
                data={weekEvents}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderEvent}
                ListEmptyComponent={<Text style={styles.noEventsText}>Событий на этой неделе нет</Text>}
            />
        </View>
    );
};

export default PetEventsListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    calendarToggleButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        marginBottom: 15,
    },
    calendarToggleButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
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
    noEventsText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
    addEventButton: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        alignItems: 'center',
    },
    addEventButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});


