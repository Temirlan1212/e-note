import { InferType, array, boolean, date, number, object, string } from "yup";
import { addressSchema } from "./address";

export type IPersonSchema = InferType<typeof personSchema>;

export const personSchema = object().shape({
  partnerTypeSelect: number()
    .integer()
    .nullable()
    .test("nullable-required", "required", (v) => v != null)
    .transform((value) => (isNaN(value) ? null : value)),
  foreigner: boolean(),
  lastName: string()
    .trim()
    .required("required")
    .matches(/^[aA-zZаА-яЯ\s]*$/, "onlyLetters"),
  name: string()
    .trim()
    .required("required")
    .matches(/^[aA-zZаА-яЯ\s]*$/, "onlyLetters"),
  middleName: string()
    .trim()
    .matches(/^[aA-zZаА-яЯ\s]*$/, "onlyLetters"),
  personalNumber: string()
    .trim()
    .required("required")
    .matches(/^[0-9]*$/, "onlyNumbers"),
  birthDate: date().nullable(),
  citizenship: object({
    id: number()
      .integer()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value)),
  }).nullable(),
  identityDocument: number()
    .integer()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  passportSeries: number()
    .integer()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  passportNumber: string()
    .trim()
    .matches(/^[0-9]*$/, "onlyNumbers"),
  authority: string().trim(),
  authorityNumber: string()
    .trim()
    .matches(/^[0-9]*$/, "onlyNumbers"),
  dateOfIssue: date().nullable(),
  mainAddress: addressSchema,
  actualResidenceAddress: addressSchema,
  emailAddress: object({
    address: string().trim().email("email"),
  }),
  mobilePhone: string()
    .trim()
    .required("required")
    .matches(/^[0-9\+\s]*$/, "onlyNumbers"),
});
