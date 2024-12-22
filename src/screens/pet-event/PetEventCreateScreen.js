import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import {fetchPetsByUserId} from "../../queries/pet/petQueries";
import {fetchAllPetEventTypes} from "../../queries/dictionary/dictionaryQueries";
import {format} from "date-fns";
import {createPetEvent} from "../../queries/pet-event/petEventQueries";
import {useNavigation} from "@react-navigation/native";

const PetEventCreateScreen = () => {
    const navigation = useNavigation();
    const [currentSelectedDate, setCurrentSelectedDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [userPets,setUserPets] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);

    useEffect(() => {
        fetchPetsByUserId(1).then((data) => {
            const userPets = data.map((pet) => ({
                label: pet.name,
                value: pet.id,
            }));
            setUserPets(userPets);
        })

        fetchAllPetEventTypes().then((data) => {
            const petEvents = data.map((petEvent) => ({
                label: petEvent.name,
                value: petEvent.id,
            }));
            setEventTypes(petEvents);
        })
    }, [])

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setCurrentSelectedDate(selectedDate);
            setFormattedDate(format(selectedDate, 'dd.MM.yyyy'));
        }
    };

    const handleSubmit = async (values) => {
        console.log("CREATE PET EVENT", values)
        try {
            const newPetEvent = {
                ...values,
                pet: { id: values.pet },
                user: { id: 1 },
                type: { id: values.type },
                date: format(currentSelectedDate, 'dd.MM.yyyy')
            };
            const response = await createPetEvent(newPetEvent);
            navigation.navigate('MainTabs', {screen: 'Event'});
        } catch (error) {
            console.error('Ошибка при сохранении данных питомца:', error);
        }
    };

    const initialValues = {
        type: '',
        pet: '',
        description: '',
    };

    const validationSchema = Yup.object().shape({
        type: Yup.string().required('Тип события обязателен'),
        pet: Yup.string().required('Питомец обязателен'),
        description: Yup.string().required('Описание обязательно'),
        date: Yup.date().required('Дата обязательна').nullable(),
    });

    return (
        <View style={styles.container}>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                    <>
                        <Text style={styles.label}>Тип события</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setFieldValue('type', value)}
                            items={eventTypes}
                            style={pickerSelectStyles}
                            value={values.type}
                        />
                        {touched.type && errors.type && <Text style={styles.error}>{errors.type}</Text>}

                        <Text style={styles.label}>Питомец</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setFieldValue('pet', value)}
                            items={userPets}
                            style={pickerSelectStyles}
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
                        {errors.type && <Text style={styles.error}>{errors.type}</Text>}
                        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Сохранить</Text>
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

export default PetEventCreateScreen;
