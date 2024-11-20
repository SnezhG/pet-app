import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
    Platform,
    Switch,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

const mockEvent = {
    id: '1',
    type: 'checkup',
    petId: '1',
    description: 'Ежегодный осмотр у ветеринара',
    dateTime: new Date(),
    reminder: true,
};

const mockEventTypes = [
    { label: 'Осмотр', value: 'checkup' },
    { label: 'Вакцинация', value: 'vaccination' },
    { label: 'Прогулка', value: 'walk' },
];

const mockPets = [
    { id: '1', name: 'Бакс' },
    { id: '2', name: 'Мурзик' },
];

export default function EventScreen() {
    const [event, setEvent] = useState(mockEvent);
    const [isEditing, setIsEditing] = useState(false);

    const [dateTime, setDateTime] = useState(event.dateTime);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const validationSchema = Yup.object().shape({
        type: Yup.string().required('Выберите тип события'),
        petId: Yup.string().required('Выберите питомца'),
        description: Yup.string(),
    });

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDateTime(selectedDate);
        }
    };

    const handleSave = (values) => {
        const updatedEvent = {
            ...values,
            dateTime,
        };
        setEvent(updatedEvent);
        setIsEditing(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {!isEditing ? (
                // Просмотр события
                <View>
                    <Text style={styles.profileField}>
                        <Text style={styles.label}>Тип: </Text>
                        {mockEventTypes.find((option) => option.value === event.type)?.label}
                    </Text>
                    <Text style={styles.profileField}>
                        <Text style={styles.label}>Питомец: </Text>
                        {mockPets.find((pet) => pet.id === event.petId)?.name}
                    </Text>
                    <Text style={styles.profileField}>
                        <Text style={styles.label}>Описание: </Text>
                        {event.description || 'Нет описания'}
                    </Text>
                    <Text style={styles.profileField}>
                        <Text style={styles.label}>Дата и время: </Text>
                        {event.dateTime.toLocaleString()}
                    </Text>
                    <Text style={styles.profileField}>
                        <Text style={styles.label}>Напоминание: </Text>
                        {event.reminder ? 'Включено' : 'Выключено'}
                    </Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(true)}
                    >
                        <Text style={styles.editButtonText}>Редактировать</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // Режим редактирования
                <Formik
                    initialValues={{
                        type: event.type,
                        petId: event.petId,
                        description: event.description,
                        reminder: event.reminder,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <>
                            <Text style={styles.label}>Тип события</Text>
                            <RNPickerSelect
                                onValueChange={(value) => setFieldValue('type', value)}
                                items={mockEventTypes}
                                style={pickerSelectStyles}
                                placeholder={{ label: 'Выберите тип', value: null }}
                                value={values.type}
                            />
                            {touched.type && errors.type && <Text style={styles.error}>{errors.type}</Text>}

                            <Text style={styles.label}>Питомец</Text>
                            <RNPickerSelect
                                onValueChange={(value) => setFieldValue('petId', value)}
                                items={mockPets.map((pet) => ({ label: pet.name, value: pet.id }))}
                                style={pickerSelectStyles}
                                placeholder={{ label: 'Выберите питомца', value: null }}
                                value={values.petId}
                            />
                            {touched.petId && errors.petId && <Text style={styles.error}>{errors.petId}</Text>}

                            <Text style={styles.label}>Описание</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                onChangeText={handleChange('description')}
                                onBlur={handleBlur('description')}
                                value={values.description}
                                placeholder="Введите описание"
                                multiline
                            />
                            {touched.description && errors.description && (
                                <Text style={styles.error}>{errors.description}</Text>
                            )}

                            <Text style={styles.label}>Дата и время</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                <Text style={styles.dateInput}>
                                    {dateTime ? dateTime.toLocaleString() : 'Выберите дату и время'}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={dateTime}
                                    mode="datetime"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={handleDateChange}
                                />
                            )}

                            <View style={styles.switchContainer}>
                                <Text style={styles.label}>Напоминание</Text>
                                <Switch
                                    value={values.reminder}
                                    onValueChange={(value) => setFieldValue('reminder', value)}
                                />
                            </View>

                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>Сохранить изменения</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </Formik>
            )}
        </ScrollView>
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
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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
