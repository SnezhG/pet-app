import React, { useCallback, useState } from 'react';
import { StyleSheet, FlatList, Text, View, TouchableOpacity, Image } from 'react-native';
import { fetchPetsByUserId } from "../queries/pet/petQueries";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
    const [pets, setPets] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const userId = '1';

            fetchPetsByUserId(userId)
                .then((data) => {
                    const updatedPets = data.map(pet => ({
                        ...pet,
                        image: pet.photo ? `data:image/jpeg;base64,${pet.photo}` : null,
                    }));
                    setPets(updatedPets);
                })
                .catch((error) => console.error('Error fetching pets:', error));

            // Cleanup function
            return () => {
                setPets([]);
            };
        }, [])
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate('PetProfile', { petId: item.id })}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.placeholder]}>
                        <Text style={styles.placeholderText}>Фото</Text>
                    </View>
                )}
                <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
        </View>
    );

    const addNewPetButton = () => (
        <TouchableOpacity
            style={[styles.card, styles.addButton]}
            onPress={() => navigation.navigate('PetCreate', { navigation: navigation })}
        >
            <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={[...pets, { id: 'add', name: '', image: '' }]}
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
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
    },
    placeholderText: {
        color: '#888',
        fontSize: 14,
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
