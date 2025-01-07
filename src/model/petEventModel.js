import * as Yup from "yup";

export const petEventValidationScheme = Yup.object().shape({
    type: Yup.string().required('Тип события обязателен'),
    pet: Yup.string().required('Питомец обязателен'),
    description: Yup.string().required('Описание обязательно'),
});