import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import {petValidationScheme} from "../../model/petModel";
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { format, parse } from 'date-fns';
import { fetchAllSpecies, fetchAllBreedsBySpecies, fetchAllSexes } from "../../queries/dictionary/dictionaryQueries";
import { updatePet } from "../../queries/pet/petQueries";

export default function PetEditFormScreen({ initialPet, onSave }) {
    const [birthDate, setBirthDate] = useState(
        initialPet.birthDate
            ? parse(initialPet.birthDate, 'dd.MM.yyyy', new Date())
            : new Date()
    );

    const [formattedDate, setFormattedDate] = useState(
        initialPet.birthDate
            ? format(parse(initialPet.birthDate, 'dd.MM.yyyy', new Date()), 'dd.MM.yyyy')
            : ''
    );
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [speciesOptions, setSpeciesOptions] = useState([]);
    const [breedOptions, setBreedOptions] = useState([]);
    const [sexOptions, setSexOptions] = useState([]);
    const [isLoadingSpecies, setIsLoadingSpecies] = useState(true);
    const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);
    const [isLoadingSexes, setIsLoadingSexes] = useState(false);

    useEffect(() => {
        fetchAllSexes()
            .then((data) => {
                const sexesList = data.map((sex) => ({
                    label: sex.name,
                    value: sex.id,
                }));

                if (initialPet.sex && !sexesList.find(s => s.value === initialPet.sex.id)) {
                    sexesList.push({ label: initialPet.sex.name, value: initialPet.sex.id });
                }

                setSexOptions(sexesList);
                setIsLoadingSexes(false);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке полов:', error);
                setIsLoadingSexes(false);
            })}, []);

    useEffect(() => {
        fetchAllSpecies()
            .then((data) => {
                const speciesList = data.map((species) => ({
                    label: species.name,
                    value: species.id,
                }));

                // Добавляем текущий вид в список, если его нет
                if (initialPet.species && !speciesList.find(s => s.value === initialPet.species.id)) {
                    speciesList.push({ label: initialPet.species.name, value: initialPet.species.id });
                }

                setSpeciesOptions(speciesList);
                setIsLoadingSpecies(false);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке видов:', error);
                setIsLoadingSpecies(false);
            });

        if (initialPet.species?.id) {
            fetchAllBreedsBySpecies(initialPet.species.id)
                .then((data) => {
                    const breedsList = data.map((breed) => ({
                        label: breed.name,
                        value: breed.id,
                    }));

                    // Добавляем текущую породу в список, если её нет
                    if (initialPet.breed && !breedsList.find(b => b.value === initialPet.breed.id)) {
                        breedsList.push({ label: initialPet.breed.name, value: initialPet.breed.id });
                    }

                    setBreedOptions(breedsList);
                    setIsLoadingBreeds(false);
                })
                .catch((error) => {
                    console.error('Ошибка при загрузке пород:', error);
                    setIsLoadingBreeds(false);
                });
        }
    }, []);


    const handleSpeciesChange = (speciesId, setFieldValue) => {
        setFieldValue('species', speciesId);
        setFieldValue('breed', null); // Сбрасываем породу при изменении вида
        setIsLoadingBreeds(true);

        fetchAllBreedsBySpecies(speciesId)
            .then((data) => {
                const breedsList = data.map((breed) => ({
                    label: breed.name,
                    value: breed.id,
                }));
                setBreedOptions(breedsList);
                setIsLoadingBreeds(false);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке:', error);
                setIsLoadingBreeds(false);
            });
    };


    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setBirthDate(selectedDate);
            setFormattedDate(format(selectedDate, 'dd.MM.yyyy'));
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            const updatedPet = {
                ...values,
                id: initialPet.id,
                species: { id: values.species }, // Передаем объект с `id`
                sex: { id: values.sex },
                breed: { id: values.breed },
                birthDate: format(birthDate, 'dd.MM.yyyy'),
                photo: null
            };
            const response = await updatePet(updatedPet);
            onSave(); // Обновление данных в родительском компоненте
        } catch (error) {
            console.error('Ошибка при сохранении данных питомца:', error);
        }
    };

    return (
        <Formik
            initialValues={{
                name: initialPet.name,
                species: initialPet.species?.id || null, // Используем только `id`
                breed: initialPet.breed?.id || null,    // Используем только `id`
                weight: initialPet.weight,
                health: initialPet.health,
            }}
            validationSchema={petValidationScheme}
            onSubmit={handleFormSubmit}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                <>
                    <Text style={styles.label}>Кличка</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                        placeholder="Введите кличку"
                    />
                    {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

                    <Text style={styles.label}>Вид</Text>
                    {isLoadingSpecies ? (
                        <ActivityIndicator size="small" color="#4CAF50" />
                    ) : (
                        <RNPickerSelect
                            onValueChange={(value) => handleSpeciesChange(value, setFieldValue)}
                            items={speciesOptions}
                            style={pickerSelectStyles}
                            placeholder={{ label: 'Выберите вид', value: null }}
                            value={values.species}
                        />
                    )}
                    {touched.species && errors.species && (
                        <Text style={styles.error}>{errors.species}</Text>
                    )}

                    {isLoadingSexes ? (
                        <ActivityIndicator size="small" color="#4CAF50" />
                    ) : (
                        <RNPickerSelect
                            onValueChange={(value) => setFieldValue('sex', value)}
                            items={sexOptions}
                            style={pickerSelectStyles}
                            placeholder={{ label: 'Выберите пол', value: null }}
                            value={values.sex}
                        />
                    )}
                    {touched.sex && errors.sex && (
                        <Text style={styles.error}>{errors.sex}</Text>
                    )}

                    <Text style={styles.label}>Порода</Text>
                    {isLoadingBreeds ? (
                        <ActivityIndicator size="small" color="#4CAF50" />
                    ) : (
                        <RNPickerSelect
                            onValueChange={(value) => setFieldValue('breed', value)}
                            items={breedOptions}
                            style={pickerSelectStyles}
                            placeholder={{ label: 'Выберите породу', value: null }}
                            value={values.breed}
                            disabled={!values.species}
                        />
                    )}
                    {touched.breed && errors.breed && <Text style={styles.error}>{errors.breed}</Text>}

                    <Text style={styles.label}>Дата рождения</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.dateInput}>
                            {formattedDate || 'Выберите дату'}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={birthDate}
                            mode="date"
                            display={'default'}
                            onChange={handleDateChange}
                        />
                    )}

                    <Text style={styles.label}>Вес (кг)</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={handleChange('weight')}
                        onBlur={handleBlur('weight')}
                        value={values.weight}
                        placeholder="Введите вес"
                        keyboardType="numeric"
                    />
                    {touched.weight && errors.weight && (
                        <Text style={styles.error}>{errors.weight}</Text>
                    )}

                    <Text style={styles.label}>Примечания по здоровью</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        onChangeText={handleChange('health')}
                        onBlur={handleBlur('health')}
                        value={values.health}
                        placeholder="Введите примечания"
                        multiline
                    />
                    {touched.health && errors.health && (
                        <Text style={styles.error}>{errors.health}</Text>
                    )}

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Сохранить изменения</Text>
                    </TouchableOpacity>
                </>
            )}
        </Formik>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    profileField: {
        fontSize: 16,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#FFA500',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    error: {
        fontSize: 12,
        color: 'red',
        marginBottom: 10,
    },
});

const pickerSelectStyles = {
    inputIOS: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: '#333',
    },
    inputAndroid: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: '#333',
    },
};
