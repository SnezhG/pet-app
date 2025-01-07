import React, { useEffect, useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, ScrollView, ImageBackground} from 'react-native';
import { Formik } from 'formik';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchPetEventById, updatePetEvent } from "../../queries/pet-event/petEventQueries";
import { fetchPetsByUserId } from "../../queries/pet/petQueries";
import { format, parse } from "date-fns";
import {fetchAllPetEventTypes} from "../../queries/dictionary/dictionaryQueries";
import {registerForPushNotificationsAsync} from "../../utils/notifUtils";
import {petEventValidationScheme} from "../../model/petEventModel";

const PetEventEditFormScreen = ({ route, navigation }) => {
    const { eventId } = route.params;
    const [initialPetEvent, setInitialPetEvent] = useState(null);
    const [pets, setPets] = useState(null);
    const [eventTypes, setEventTypes] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [currentSelectedDate, setCurrentSelectedDate] = useState(new Date());
    const [userToken, setUserToken] = useState('');
    const [isNotifEnabled, setIsNotifEnabled] = useState(false);
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        fetchPetEventById(eventId).then((data) => {
            setInitialPetEvent(data);
            const parsedDate = data.date ? parse(data.date, 'dd.MM.yyyy HH:mm:ss', new Date()) : new Date();
            setCurrentSelectedDate(parsedDate);
            setFormattedDate(data.date ? format(parsedDate, 'dd.MM.yyyy HH:mm:ss') : '');
            setIsNotifEnabled(data.isNotifEnabled);
        }).catch((error) => {
            console.error('Ошибка при загрузке данных события:', error);
        });

        fetchPetsByUserId(1).then((data) => {
            const petList = data.map((pet) => ({
                label: pet.name,
                value: pet.id,
            }));
            setPets(petList);
        }).catch((error) => {
            console.error('Ошибка при загрузке питомцев пользователя:', error);
        });

        fetchAllPetEventTypes().then((data) => {
            const eventTypesList = data.map((eventType) => ({
                label: eventType.name,
                value: eventType.id,
            }));
            setEventTypes(eventTypesList);
        }).catch((error) => {
            console.error('Ошибка при загрузке типов событий:', error);
        });

        registerForPushNotificationsAsync().then((token) => {
            if (token) {
                setUserToken(token);
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
            const updatedDate = new Date(currentSelectedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes()));
            setCurrentSelectedDate(updatedDate);
            setFormattedDate(format(updatedDate, 'dd.MM.yyyy HH:mm:ss'));
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            const updatedPetEvent = {
                ...values,
                id: eventId,
                pet: { id: values.pet },
                type: { id: values.type },
                date: format(currentSelectedDate, 'dd.MM.yyyy HH:mm:ss'),
                isNotifEnabled: isNotifEnabled,
            };
            const response = await updatePetEvent(updatedPetEvent);
            navigation.replace('EventView', { eventId: response });
        } catch (error) {
            console.error('Ошибка при сохранении данных питомца:', error);
        }
    };

    if (!initialPetEvent || !pets || !eventTypes) {
        return (
            <View style={styles.container}>
                <Text>Загрузка данных...</Text>
            </View>
        );
    }

    return (
        <ImageBackground
            source={require('../../../assets/background.png')}
            style={styles.backgroundImage}
        >
        <ScrollView style={styles.container}>
            <Formik
                initialValues={{
                    type: initialPetEvent?.type.id || '',
                    pet: initialPetEvent?.pet.id || '',
                    description: initialPetEvent?.description || '',
                    userToken: userToken,
                    isNotifEnabled: initialPetEvent?.isNotifEnabled,
                }}
                onSubmit={handleFormSubmit}
                validationSchema={petEventValidationScheme}
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

                        <Text style={styles.label}>Дата и время</Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={styles.dateInput}
                        >
                            <Text style={styles.dateInput}>
                                {formattedDate || 'Выберите дату и время'}
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

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Сохранить изменения</Text>
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

export default PetEventEditFormScreen;
