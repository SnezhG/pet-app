import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

const speciesOptions = [
    { label: 'Собака', value: 'dog' },
    { label: 'Кошка', value: 'cat' },
    { label: 'Птица', value: 'bird' },
];

const breedOptions = {
    dog: [
        { label: 'Лабрадор', value: 'labrador' },
        { label: 'Бульдог', value: 'bulldog' },
    ],
    cat: [
        { label: 'Сиамская', value: 'siamese' },
        { label: 'Персидская', value: 'persian' },
    ],
    bird: [
        { label: 'Канарейка', value: 'canary' },
        { label: 'Попугай', value: 'parrot' },
    ],
};

export default function AddPetScreen() {
    const [birthDate, setBirthDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedSpecies, setSelectedSpecies] = useState('');

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

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setBirthDate(selectedDate);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Formik
                initialValues={{
                    name: '',
                    species: '',
                    breed: '',
                    weight: '',
                    healthNotes: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    alert(JSON.stringify({ ...values, birthDate }, null, 2));
                }}
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
                        <RNPickerSelect
                            onValueChange={(value) => {
                                setFieldValue('species', value);
                                setSelectedSpecies(value);
                            }}
                            items={speciesOptions}
                            style={pickerSelectStyles}
                            placeholder={{ label: 'Выберите вид', value: null }}
                        />
                        {touched.species && errors.species && <Text style={styles.error}>{errors.species}</Text>}

                        <Text style={styles.label}>Порода</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setFieldValue('breed', value)}
                            items={breedOptions[selectedSpecies] || []}
                            style={pickerSelectStyles}
                            placeholder={{ label: 'Выберите породу', value: null }}
                            disabled={!selectedSpecies}
                        />
                        {touched.breed && errors.breed && <Text style={styles.error}>{errors.breed}</Text>}

                        <Text style={styles.label}>Дата рождения</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.dateInput}>
                                {birthDate ? birthDate.toLocaleDateString() : 'Выберите дату'}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={birthDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
                            onChangeText={handleChange('healthNotes')}
                            onBlur={handleBlur('healthNotes')}
                            value={values.healthNotes}
                            placeholder="Введите примечания"
                            multiline
                        />
                        {touched.healthNotes && errors.healthNotes && (
                            <Text style={styles.error}>{errors.healthNotes}</Text>
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
