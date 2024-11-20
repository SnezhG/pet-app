import React from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const mockActivities = [
    {
        id: '1',
        type: 'walk',
        petId: '1',
        dateTime: new Date('2024-11-18T10:00:00'),
    },
    {
        id: '2',
        type: 'vet_visit',
        petId: '2',
        dateTime: new Date('2024-11-17T14:30:00'),
    },
    {
        id: '3',
        type: 'play',
        petId: '1',
        dateTime: new Date('2024-11-16T16:45:00'),
    },
];

const mockActivityTypes = {
    walk: 'Прогулка',
    vet_visit: 'Визит к ветеринару',
    play: 'Игры',
};

const mockPets = [
    { id: '1', name: 'Бакс' },
    { id: '2', name: 'Мурзик' },
];

export default function ActivityListScreen({ navigation }) {
    const renderActivityItem = ({ item }) => {
        const pet = mockPets.find((p) => p.id === item.petId);
        const activityType = mockActivityTypes[item.type] || 'Неизвестный тип';

        return (
            <TouchableOpacity
                style={styles.activityItem}
                onPress={() => navigation.navigate('ActivityFormView', { id: item.id })}
            >
                <Text style={styles.activityText}>
                    <Text style={styles.label}>Тип: </Text>
                    {activityType}
                </Text>
                <Text style={styles.activityText}>
                    <Text style={styles.label}>Питомец: </Text>
                    {pet?.name || 'Неизвестный питомец'}
                </Text>
                <Text style={styles.activityText}>
                    <Text style={styles.label}>Время: </Text>
                    {item.dateTime.toLocaleString()}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={mockActivities}
                keyExtractor={(item) => item.id}
                renderItem={renderActivityItem}
                contentContainerStyle={styles.listContainer}
            />
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
    activityItem: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    activityText: {
        fontSize: 16,
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
    },
});
