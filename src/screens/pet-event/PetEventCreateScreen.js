import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, ScrollView} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import {fetchPetsByUserId} from "../../queries/pet/petQueries";
import {fetchAllPetEventTypes} from "../../queries/dictionary/dictionaryQueries";
import {format} from "date-fns";
import {createPetEvent} from "../../queries/pet-event/petEventQueries";
import {useNavigation} from "@react-navigation/native";
import * as Notifications from "expo-notifications";

const PetEventCreateScreen = ({navigation}) => {
    const [currentSelectedDate, setCurrentSelectedDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [userPets,setUserPets] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);

    const [expoPushToken, setExpoPushToken] = useState('');
    const [isNotifEnabled, setIsNotifEnabled] = useState(false);


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

        registerForPushNotificationsAsync().then(token => {
            if (token) {
                setExpoPushToken(token);
                console.log('Expo Push Token:', token);
            }
        });
    }, []);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setCurrentSelectedDate(selectedDate);
            setFormattedDate(format(selectedDate, 'dd.MM.yyyy HH:mm:ss'));
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setCurrentSelectedDate(new Date(currentSelectedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes())));
            setFormattedDate(format(currentSelectedDate, 'dd.MM.yyyy HH:mm:ss'));
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
                date: format(currentSelectedDate, 'dd.MM.yyyy HH:mm:ss'),
                expoPushToken: expoPushToken, // Добавляем token
                isNotifEnabled: isNotifEnabled,
            };
            const response = await createPetEvent(newPetEvent);
            navigation.replace('MainTabs', {screen: 'Event'});
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

    const registerForPushNotificationsAsync = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Не удалось получить разрешение на уведомления!');
            return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        return token;
    };

    return (
        <ScrollView style={styles.container}>
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

                        {showTimePicker && (
                            <DateTimePicker
                                value={currentSelectedDate}
                                mode="time"
                                display="default"
                                onChange={handleTimeChange}
                            />
                        )}

                            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.selectTimeButton}>
                                <Text style={styles.selectTimeButtonText}>Выбрать время</Text>
                            </TouchableOpacity>

                        <Text style={styles.label}>Включить уведомления</Text>
                        <Switch
                            value={isNotifEnabled}
                            onValueChange={(value) => setIsNotifEnabled(value)}
                        />
                        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Сохранить</Text>
                        </TouchableOpacity>
                    </>
                )}
            </Formik>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    selectTimeButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    selectTimeButtonText: {
        color: '#fff',
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
