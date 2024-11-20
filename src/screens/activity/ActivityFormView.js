import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
    Platform,
    Image,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

const mockActivity = {
    id: '1',
    type: 'walk',
    petId: '1',
    description: 'Долгая прогулка в парке',
    dateTime: new Date(),
    photo: null,
    documents: null,
};

const mockActivityTypes = [
    { label: 'Прогулка', value: 'walk' },
    { label: 'Визит к ветеринару', value: 'vet_visit' },
    { label: 'Игры', value: 'play' },
];

const mockPets = [
    { id: '1', name: 'Бакс' },
    { id: '2', name: 'Мурзик' },
];

export default function ActivityScreen() {
    const [activity, setActivity] = useState(mockActivity);
    const [isEditing, setIsEditing] = useState(false);

    const [dateTime, setDateTime] = useState(activity.dateTime);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const validationSchema = Yup.object().shape({
        type: Yup.string().required('Выберите тип активности'),
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
        const updatedActivity = {
            ...values,
            dateTime,
        };
        setActivity(updatedActivity);
        setIsEditing(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {!isEditing ? (
                <View>
                    <Text style={styles.profileField}>
                        <Text style={styles.label}>Тип: </Text>
                        {mockActivityTypes.find((option) => option.value === activity.type)?.label}
                    </Text>
                    <Text style={styles.profileField}>
                        <Text style={styles.label}>Питомец: </Text>
                        {mockPets.find((pet) => pet.id === activity.petId)?.name}
                    </Text>
                    <Text style={styles.profileField}>
                        <Text style={styles.label}>Описание: </Text>
                        {activity.description || 'Нет описания'}
                    </Text>
                    <Text style={styles.profileField}>
                        <Text style={styles.label}>Дата и время: </Text>
                        {activity.dateTime.toLocaleString()}
                    </Text>
                    {activity.photo && (
                        <View style={styles.mediaSection}>
                            <Text style={styles.label}>Фото:</Text>
                            <Image source={{ uri: activity.photo }} style={styles.image} />
                        </View>
                    )}
                    {activity.documents && (
                        <View style={styles.mediaSection}>
                            <Text style={styles.label}>Документы:</Text>
                            <Text>{activity.documents}</Text>
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(true)}
                    >
                        <Text style={styles.editButtonText}>Редактировать</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <Formik
                    initialValues={{
                        type: activity.type,
                        petId: activity.petId,
                        description: activity.description,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <>
                            <Text style={styles.label}>Тип активности</Text>
                            <RNPickerSelect
                                onValueChange={(value) => setFieldValue('type', value)}
                                items={mockActivityTypes}
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
    mediaSection: {
        marginBottom: 15,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 5,
        marginTop: 10,
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
