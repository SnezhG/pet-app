import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function EventsByDateScreen({ route }) {
    const { date, events } = route.params;

    const renderEventItem = ({ item }) => (
        <View style={styles.eventItem}>
            <Text style={styles.eventText}>{item.description || 'Нет описания'}</Text>
            <Text style={styles.eventText}>{item.dateTime.toLocaleTimeString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>События на {date}</Text>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={renderEventItem}
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
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
    },
});
