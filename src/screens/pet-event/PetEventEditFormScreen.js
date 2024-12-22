import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';

import {fetchPetEventById, updatePetEvent} from "../../queries/pet-event/petEventQueries";
import {fetchAllPetEventTypes} from "../../queries/dictionary/dictionaryQueries";
import {fetchPetsByUserId, updatePet} from "../../queries/pet/petQueries";
import {format, parse} from "date-fns";
import {useNavigation} from "@react-navigation/native";

const PetEventEditFormScreen = ({ route }) => {
    const { eventId } = route.params;
    const navigation = useNavigation();
    const [initialPetEvent, setInitialPetEvent] = useState(null);
    const [pets,setPets] = useState(null);
    const [eventTypes, setEventTypes] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentSelectedDate,setCurrentSelectedDate] = useState(null);
    const [formattedDate, setFormattedDate] = useState(null);

    useEffect(() => {
        fetchPetEventById(eventId).then((data) => {
            console.log(data)
            setInitialPetEvent(data);
            setCurrentSelectedDate(data.date ? parse(data.date, 'dd.MM.yyyy', new Date()) : new Date())
            setFormattedDate(data.date ? format(parse(data.date, 'dd.MM.yyyy', new Date()), 'dd.MM.yyyy')
                : '')
        }).catch((error) => {
            console.error('Ошибка при загрузке питомца:', error);
        })

        fetchPetsByUserId(1).then((data) => {
            const petList = data.map((pet) => ({
                label: pet.name,
                value: pet.id,
            }));
            setPets(petList);
        }).catch((error) => {
            console.error('Ошибка при загрузке питомцев пользователя:', error);
        })

        fetchAllPetEventTypes().then((data) => {
            const eventTypesList = data.map((eventType) => ({
                label: eventType.name,
                value: eventType.id,
            }));
            setEventTypes(eventTypesList);
        }).catch((error) => {
            console.error('Ошибка при загрузке списка типов события:', error);
        })
    }, [])

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setCurrentSelectedDate(selectedDate);
            setFormattedDate(format(selectedDate, 'dd.MM.yyyy'));
        }
    };

    const handleFormSubmit = async (values) => {
        console.log("values", values)
        try {
            const updatedPetEvent = {
                ...values,
                id: eventId,
                pet: { id: values.pet },
                type: { id: values.type },
                date: format(currentSelectedDate, 'dd.MM.yyyy')
            };
            console.log(updatedPetEvent)
            const response = await updatePetEvent(updatedPetEvent);
            navigation.navigate('Event');
        } catch (error) {
            console.error('Ошибка при сохранении данных питомца:', error);
        }
    };

    // const validationSchema = Yup.object().shape({
    //     type: Yup.string().required('Тип события обязателен'),
    //     pet: Yup.string().required('Питомец обязателен'),
    //     description: Yup.string().required('Описание обязательно').max(255, 'Максимум 255 символов'),
    //     date: Yup.date().required('Дата обязательна').nullable(),
    // });

    if (!initialPetEvent || !pets || !eventTypes) {
        return (
            <View style={styles.container}>
                <Text>Загрузка данных...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Formik
                initialValues={{
                    type: initialPetEvent?.type.id || '',
                    pet: initialPetEvent?.pet.id || '',
                    description: initialPetEvent?.description || '',
                }}
                onSubmit={handleFormSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <>
                        <Text style={styles.label}>Тип события</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setFieldValue('type', value)}
                            items={eventTypes}
                            style={pickerSelectStyles}
                            placeholder={{ label: 'Выберите тип события', value: null }}
                            value={values.type}
                        />
                        {touched.type && errors.type && <Text style={styles.error}>{errors.type}</Text>}

                        <Text style={styles.label}>Питомец</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setFieldValue('pet', value)}
                            items={pets}
                            style={pickerSelectStyles}
                            placeholder={{ label: 'Выберите питомца', value: null }}
                            value={values.pet}
                        />
                        {touched.pet && errors.pet && <Text style={styles.error}>{errors.pet}</Text>}

                        <Text style={styles.label}>Описание</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            onChangeText={handleChange('description')}
                            onBlur={handleBlur('description')}
                            value={values.description}
                            multiline
                            numberOfLines={4}
                        />
                        {touched.description && errors.description && <Text style={styles.error}>{errors.description}</Text>}

                        <Text style={styles.label}>Дата</Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={styles.dateInput}
                        >
                            <Text style={styles.dateInput}>
                                {formattedDate || 'Выберите дату'}
                            </Text>
                        </TouchableOpacity>
                        {touched.date && errors.date && <Text style={styles.error}>{errors.date}</Text>}

                        {showDatePicker && (
                            <DateTimePicker
                                value={currentSelectedDate}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} >
                            <Text style={styles.submitButtonText}>Сохранить изменения</Text>
                        </TouchableOpacity>
                    </>
                )}
            </Formik>
        </View>
    );
};

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

export default PetEventEditFormScreen;
