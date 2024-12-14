import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { format } from 'date-fns';
import { fetchAllSpecies, fetchAllBreedsBySpecies, fetchAllSexes } from "../../queries/dictionary/dictionaryQueries";
import {createPet} from "../../queries/pet/petQueries";

function PetCreateScreen({navigation}) {
    const [birthDate, setBirthDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [species, setSpeciesOptions] = useState([]);
    const [isLoadingSpecies, setIsLoadingSpecies] = useState(true);

    const [breedOptions, setBreedOptions] = useState([]);
    const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);

    const [sexOptions, setSexOptions] = useState([]);
    const [isLoadingSexes, setIsLoadingSexes] = useState(false);

    useEffect(() => {
        fetchAllSpecies()
            .then((data) => {
                const speciesList = data.map((species) => ({
                    label: species.name,
                    value: species.id,
                }));
                setSpeciesOptions(speciesList);
                setIsLoadingSpecies(false);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке видов:', error);
                setIsLoadingSpecies(false);
            });

        fetchAllSexes()
            .then((data) => {
                const sexesList = data.map((sex) => ({
                    label: sex.name,
                    value: sex.id,
                }));
                setSexOptions(sexesList);
                setIsLoadingSexes(false);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке полов:', error);
                setIsLoadingSexes(false);
            });
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
                console.error('Ошибка при загрузке пород:', error);
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
            const newPet = {
                ...values,
                species: { id: values.species },
                sex: { id: values.sex },
                breed: { id: values.breed },
                birthDate: format(birthDate, 'dd.MM.yyyy'),
                photo: null,
                user: { id: "1" }
            };
            const response = await createPet(newPet);
            navigation.navigate('PetProfile', { petId: response })
        } catch (error) {
            console.error('Ошибка при сохранении данных питомца:', error);
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Введите кличку'),
        species: Yup.string().required('Выберите вид'),
        breed: Yup.string().required('Выберите породу'),
        weight: Yup.number()
            .typeError('Введите число')
            .positive('Вес должен быть положительным')
            .nullable(),
        healthNotes: Yup.string(),
    });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Formik
                initialValues={{
                    name: '',
                    species: '',
                    breed: '',
                    weight: '',
                    health: '',
                }}
                validationSchema={validationSchema}
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
                                onValueChange={(value) => {
                                    setFieldValue('species', value);
                                    handleSpeciesChange(value, setFieldValue);
                                }}
                                items={species}
                                style={pickerSelectStyles}
                                placeholder={{ label: 'Выберите вид', value: null }}
                            />
                        )}
                        {touched.species && errors.species && <Text style={styles.error}>{errors.species}</Text>}

                        <Text style={styles.label}>Пол</Text>
                        {isLoadingSexes ? (
                            <ActivityIndicator size="small" color="#4CAF50" />
                        ) : (
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    setFieldValue('sex', value);
                                }}
                                items={sexOptions}
                                style={pickerSelectStyles}
                                placeholder={{ label: 'Выберите пол', value: null }}
                            />
                        )}
                        {touched.sex && errors.sex && <Text style={styles.error}>{errors.species}</Text>}

                        <Text style={styles.label}>Порода</Text>
                        {isLoadingBreeds ? (
                            <ActivityIndicator size="small" color="#4CAF50" />
                        ) : (
                            <RNPickerSelect
                                onValueChange={(value) => setFieldValue('breed', value)}
                                items={breedOptions}
                                style={pickerSelectStyles}
                                placeholder={{ label: 'Выберите породу', value: null }}
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
                        {touched.weight && errors.weight && <Text style={styles.error}>{errors.weight}</Text>}

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
                            <Text style={styles.submitButtonText}>Добавить питомца</Text>
                        </TouchableOpacity>
                    </>
                )}
            </Formik>
        </ScrollView>
    );
}

export default PetCreateScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
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
