import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Switch,
    ScrollView,
    ImageBackground,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchPetsByUserId } from '../../queries/pet/petQueries';
import { fetchAllPetEventTypes } from '../../queries/dictionary/dictionaryQueries';
import { format } from 'date-fns';
import { createPetEvent } from '../../queries/pet-event/petEventQueries';
import * as Notifications from 'expo-notifications';
import {registerForPushNotificationsAsync} from "../../utils/notifUtils";

const PetEventCreateScreen = ({ navigation }) => {
    const [currentSelectedDate, setCurrentSelectedDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [userPets, setUserPets] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [userToken, setUserToken] = useState('');
    const [isNotifEnabled, setIsNotifEnabled] = useState(false);

    useEffect(() => {
        fetchPetsByUserId().then((data) => {
            const userPets = data.map((pet) => ({
                label: pet.name,
                value: pet.id,
            }));
            setUserPets(userPets);
        });

        fetchAllPetEventTypes().then((data) => {
            const petEvents = data.map((petEvent) => ({
                label: petEvent.name,
                value: petEvent.id,
            }));
            setEventTypes(petEvents);
        });

        registerForPushNotificationsAsync().then((token) => {
            if (token) {
                setUserToken(token);
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
            setCurrentSelectedDate(
                new Date(
                    currentSelectedDate.setHours(
                        selectedTime.getHours(),
                        selectedTime.getMinutes()
                    )
                )
            );
            setFormattedDate(format(currentSelectedDate, 'dd.MM.yyyy HH:mm:ss'));
        }
    };

    const handleSubmit = async (values) => {
        try {
            const newPetEvent = {
                ...values,
                pet: { id: values.pet },
                type: { id: values.type },
                date: format(currentSelectedDate, 'dd.MM.yyyy HH:mm:ss'),
                userToken: userToken,
                isNotifEnabled: isNotifEnabled,
            };
            await createPetEvent(newPetEvent);
            navigation.replace('MainTabs', { screen: 'Event' });
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
    });

    return (
        <ImageBackground
            source={require('../../../assets/background.png')}
            style={styles.backgroundImage}
        >
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
                                placeholder={{ label: 'Выберите тип события...', value: null }}
                            />
                            {touched.type && errors.type && <Text style={styles.error}>{errors.type}</Text>}

                            <Text style={styles.label}>Питомец</Text>
                            <RNPickerSelect
                                onValueChange={(value) => setFieldValue('pet', value)}
                                items={userPets}
                                style={pickerSelectStyles}
                                value={values.pet}
                                placeholder={{ label: 'Выберите питомца...', value: null }}
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
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                                <Text style={styles.dateInputText}>
                                    {formattedDate || 'Выберите дату'}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={currentSelectedDate}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}

                            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.selectTimeButton}>
                                <Text style={styles.selectTimeButtonText}>Выбрать время</Text>
                            </TouchableOpacity>

                            {showTimePicker && (
                                <DateTimePicker
                                    value={currentSelectedDate}
                                    mode="time"
                                    display="default"
                                    onChange={handleTimeChange}
                                />
                            )}

                            <View style={styles.switchContainer}>
                                <Text style={styles.label}>Включить уведомления</Text>
                                <Switch
                                    value={isNotifEnabled}
                                    onValueChange={(value) => setIsNotifEnabled(value)}
                                    style={styles.switch}
                                />
                            </View>

                            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>Сохранить</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </Formik>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
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
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    dateInputText: {
        color: '#333',
    },
    selectTimeButton: {
        backgroundColor: '#78A75A',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    selectTimeButtonText: {
        color: '#fff',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 20,
    },
    switch: {
        color: '#78A75A'
    },
    submitButton: {
        backgroundColor: '#78A75A',
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
        backgroundColor: '#fff',
        color: '#333',
    },
    inputAndroid: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
        color: '#333',
    },
};

export default PetEventCreateScreen;
