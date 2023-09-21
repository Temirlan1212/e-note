import { number, object, InferType, string, date, boolean } from "yup";
import { addressSchema } from "./address";

export type IUserRegistrySchema = InferType<typeof userRegistrySchema>;

export const userRegistrySchema = object()
  .shape({
    partnerTypeSelect: number()
      .integer()
      .nullable()
      .test("nullable-required", "required", (v) => v != null)
      .transform((value) => (isNaN(value) ? null : value)),
    role: object({
      id: number()
        .integer()
        .transform((value) => (isNaN(value) ? null : value))
        .nullable()
        .test("nullable-required", "required", (v) => v != null),
    }),
    lastName: string()
      .trim()
      .required("required")
      .matches(/^[aA-zZаА-яЯөүңӨҮҢ\s]*$/, "onlyLetters"),
    firstName: string()
      .trim()
      .required("required")
      .matches(/^[aA-zZаА-яЯөүңӨҮҢ\s]*$/, "onlyLetters"),
    middleName: string()
      .trim()
      .matches(/^[aA-zZаА-яЯөүңӨҮҢ\s]*$/, "onlyLetters"),
    personalNumber: string()
      .trim()
      .min(6, "minNumbers")
      .required("required")
      .matches(/^[0-9]*$/, "onlyNumbers"),
    identityDocument: string().required("required"),
    passportSeries: string().required("required"),
    passportNumber: string()
      .trim()
      .matches(/^[0-9]*$/, "onlyNumbers"),
    authority: string().trim(),
    authorityNumber: string()
      .trim()
      .matches(/^[0-9]*$/, "onlyNumbers"),
    dateOfIssue: date().required("required"),
    foreigner: boolean(),
    mainAddress: addressSchema,
    actualResidenceAddress: addressSchema,
    mobilePhone: string()
      .trim()
      .required("required")
      .matches(/^[0-9\+\-\s]*$/, "onlyNumbers"),
    emailAddress: object({
      id: number().integer().positive().nullable(),
      version: number().integer().positive().nullable(),
      address: string().trim().email("email"),
    }),
  })
  .concat(addressSchema.pick(["region", "district", "city"]));
