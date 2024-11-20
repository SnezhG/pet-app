import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

const mockEvents = [
    {
        id: '1',
        type: 'checkup',
        petId: '1',
        description: 'Ежегодный осмотр у ветеринара',
        dateTime: new Date('2024-11-20T10:00:00'),
    },
    {
        id: '2',
        type: 'vaccination',
        petId: '2',
        description: 'Вакцинация',
        dateTime: new Date('2024-11-20T14:00:00'),
    },
    {
        id: '3',
        type: 'walk',
        petId: '1',
        description: 'Прогулка',
        dateTime: new Date('2024-11-19T16:30:00'),
    },
];

const mockEventTypes = {
    checkup: 'Осмотр',
    vaccination: 'Вакцинация',
    walk: 'Прогулка',
};

const mockPets = [
    { id: '1', name: 'Бакс' },
    { id: '2', name: 'Мурзик' },
];

export default function EventListScreen() {
    const navigation = useNavigation();
    const [isCalendarView, setIsCalendarView] = useState(false);

    const groupedEventsByDate = mockEvents.reduce((acc, event) => {
        const dateKey = event.dateTime.toISOString().split('T')[0]; // Формат YYYY-MM-DD
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(event);
        return acc;
    }, {});

    const markedDates = Object.keys(groupedEventsByDate).reduce((acc, date) => {
        acc[date] = { marked: true };
        return acc;
    }, {});

    const renderEventItem = ({ item }) => {
        const pet = mockPets.find((p) => p.id === item.petId);
        const eventType = mockEventTypes[item.type] || 'Неизвестный тип';

        return (
            <TouchableOpacity
                style={styles.eventItem}
                onPress={() => navigation.navigate('EventFormView')}
            >
                <Text style={styles.eventText}>
                    <Text style={styles.label}>Тип: </Text>
                    {eventType}
                </Text>
                <Text style={styles.eventText}>
                    <Text style={styles.label}>Питомец: </Text>
                    {pet?.name || 'Неизвестный питомец'}
                </Text>
                <Text style={styles.eventText}>
                    <Text style={styles.label}>Дата и время: </Text>
                    {item.dateTime.toLocaleString()}
                </Text>
            </TouchableOpacity>
        );
    };

    const handleDayPress = (day) => {
        const selectedDate = day.dateString;
        if (groupedEventsByDate[selectedDate]) {
            navigation.navigate('EventsByDay', {
                date: selectedDate,
                events: groupedEventsByDate[selectedDate],
            });
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setIsCalendarView(!isCalendarView)}
            >
                <Text style={styles.switchButtonText}>
                    {isCalendarView ? 'Переключить на список' : 'Переключить на календарь'}
                </Text>
            </TouchableOpacity>
            {isCalendarView ? (
                <Calendar
                    markedDates={markedDates}
                    onDayPress={handleDayPress}
                    style={styles.calendar}
                    theme={{
                        selectedDayBackgroundColor: '#4CAF50',
                        todayTextColor: '#4CAF50',
                        arrowColor: '#4CAF50',
                    }}
                />
            ) : (
                <FlatList
                    data={mockEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={renderEventItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    listContainer: {
        paddingBottom: 20,
    },
    eventItem: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    eventText: {
        fontSize: 16,
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
    },
    switchButton: {
        backgroundColor: '#FFA500',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    switchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    calendar: {
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    },
});
