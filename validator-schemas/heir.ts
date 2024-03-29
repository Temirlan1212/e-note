import * as yup from "yup";

export type IHeirSchema = yup.InferType<typeof heirSchema>;
export type IHeirListFilterFormFields = yup.InferType<typeof heirSchema>;

export const heirSchema = yup.object().shape({
  keyWord: yup.string().required("This field is required!"),
  birthDate: yup.date().nullable(),
  deathDate: yup.date().nullable(),
});

export const heirListFilterFormFields = yup.object().shape({
  year: yup.string(),
});
