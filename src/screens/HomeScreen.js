import React, { useState } from 'react';
import { StyleSheet, FlatList, Text, View, TouchableOpacity, Image } from 'react-native';

const pets = [
    { id: '1', name: 'Buddy', image: 'https://cataas.com/cat' },
    { id: '2', name: 'Luna', image: 'https://cataas.com/cat' },
    { id: '3', name: 'Charlie', image: 'https://cataas.com/cat' },
];

export default function HomeScreen({ navigation }) {
    const [petProfiles, setPetProfiles] = useState(pets);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate('PetProfile')}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
        </View>
    );

    const addNewPetButton = () => (
        <TouchableOpacity
            style={[styles.card, styles.addButton]}
            onPress={() => navigation.navigate('PetAdd')}>
            <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
    );
    
    return (
        <View style={styles.container}>
            <FlatList
                data={[...petProfiles, { id: 'add', name: '', image: '' }]}
                renderItem={({ item }) => (item.id === 'add' ? addNewPetButton() : renderItem({ item }))}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    carousel: {
        paddingHorizontal: 10,
    },
    card: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        width: 150,
        height: 200,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        fontSize: 40,
        color: '#fff',
        fontWeight: 'bold',
    },
});
