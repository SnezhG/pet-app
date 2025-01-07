import React, {useState, useEffect, useCallback} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ImageBackground,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { fetchPetEventByUserOnWeek, fetchPetEventsByUser } from "../../queries/pet-event/petEventQueries";
import {convertCalendarToDateFormat, convertDateToCalendarFormat, extractTime} from "../../utils/dateUtils";

const PetEventsListScreen = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [weekEvents, setWeekEvents] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isCalendarExpanded, setCalendarExpanded] = useState(false);
    const [markedDates, setMarkedDates] = useState({});
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            fetchPetEventsByUser()
                .then((data) => {
                    setAllEvents(data);
                    markDatesWithEvents(data);
                })
                .catch((error) => {
                    console.error('Ошибка при загрузке событий:', error);
                });

            fetchPetEventByUserOnWeek()
                .then((data) => {
                    setWeekEvents(data);
                })
                .catch((error) => {
                    console.error('Ошибка при загрузке событий:', error);
                });

            return () => {
                setAllEvents([]);
                setWeekEvents([]);
            };
        }, [])
    );

    const markDatesWithEvents = (events) => {
        const marked = {};
        events.forEach((event) => {
            const formattedDate = convertDateToCalendarFormat(event.date);
            marked[formattedDate] = { marked: true, dotColor: '#78A75A' }; // Оранжевая точка
        });
        setMarkedDates(marked);
    };

    const handleDayPress = (day) => {
        const date = convertCalendarToDateFormat(day.dateString);
        setSelectedDay(date);
        navigation.navigate('EventsByDay', { date: day.dateString });
    };

    const renderEvent = ({ item }) => (
        <TouchableOpacity
            style={styles.eventItem}
            onPress={() => navigation.navigate('EventView', { eventId: item.id })}
        >
            <Text style={styles.eventTitle}>{item.type.name}</Text>
            <Text style={styles.eventDescription}>
                {`Питомец: ${item.pet.name}  Время: ${extractTime(item.date)}`}
            </Text>
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            source={require('../../../assets/background.png')}
            style={styles.backgroundImage}
        >
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
                            todayTextColor: '#78A75A',
                            arrowColor: '#78A75A',
                            selectedDayBackgroundColor: '#78A75A',
                            dotColor: '#78A75A',
                        }}
                    />
                )}

                <TouchableOpacity
                    style={styles.addEventButton}
                    onPress={() => navigation.navigate('EventCreate')}
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
        </ImageBackground>
    );
};

export default PetEventsListScreen;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    calendarToggleButton: {
        padding: 10,
        backgroundColor: '#78A75A',
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
        backgroundColor: '#78A75A',
        borderRadius: 5,
        alignItems: 'center',
    },
    addEventButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
