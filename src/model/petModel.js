import * as Yup from "yup";

export const petValidationScheme = Yup.object().shape({
    name: Yup.string().required('Введите кличку'),
    species: Yup.string().required('Выберите вид'),
    breed: Yup.string().required('Выберите породу'),
    weight: Yup.number()
        .typeError('Введите число')
        .positive('Вес должен быть положительным')
        .nullable(),
    healthNotes: Yup.string(),
});