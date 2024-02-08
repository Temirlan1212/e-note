import { object, InferType, string, date, array, number } from "yup";
import { addressSchema } from "./address";

export type IInheritanceCasesListFilterFormFields = InferType<typeof inheritanceCasesListFilterFormFields>;
export type IInheritanceCasesListSearchBarForm = InferType<typeof inheritanceCasesListSearchBarForm>;
export type IInheritanceCaseCreateSchema = InferType<typeof inheritanceCaseCreateSchema>;

export const inheritanceCasesListFilterFormFields = object().shape({
  year: string(),
});

export const inheritanceCasesListSearchBarForm = object().shape({
  keyWord: string(),
});

export const inheritanceCaseCreateSchema = object({
  requester: array().of(
    object().shape({
      personalNumber: string()
        .trim()
        .min(5, "minNumbers")
        .max(14, "maxNumbers")
        .required("required")
        .matches(/^[0-9]*$/, "onlyNumbers"),
      lastName: string()
        .trim()
        .required("required")
        .min(2, "minLettersLow")
        .matches(/^[aA-zZаА-яЯёЁөүңӨҮҢ\s\-]*$/, "onlyLetters"),
      firstName: string()
        .trim()
        .required("required")
        .min(2, "minLettersLow")
        .matches(/^[aA-zZаА-яЯёЁөүңӨҮҢ\s\-]*$/, "onlyLetters"),
      middleName: string()
        .trim()
        .matches(/^[aA-zZаА-яЯёЁөүңӨҮҢ\s\-]*$/, "onlyLetters"),
      birthDate: date().nullable(),
      deathDate: date().nullable(),
      passportSeries: string().trim().nullable(),
      passportNumber: string()
        .trim()
        .matches(/^[0-9]*$/, "onlyNumbers"),
    })
  ),
  company: object({
    id: number().integer().positive(),
  }).required("required"),
}).concat(addressSchema);
