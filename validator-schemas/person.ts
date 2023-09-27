import { InferType, array, boolean, date, number, object, string } from "yup";
import { addressSchema } from "./address";
import { filesSchema } from "./files";

export type IPersonSchema = InferType<typeof personSchema>;

export const personSchema = object()
  .shape({
    id: number().integer().positive().nullable(),
    version: number().integer().positive().nullable(),
    partnerTypeSelect: number()
      .integer()
      .nullable()
      .test("nullable-required", "required", (v) => v != null)
      .transform((value) => (isNaN(value) ? null : value)),
    foreigner: boolean(),
    lastName: string()
      .trim()
      .required("required")
      .matches(/^[aA-zZаА-яЯөүңӨҮҢ\s]*$/, "onlyLetters"),
    name: string()
      .trim()
      .required("required")
      .matches(/^[aA-zZаА-яЯөүңӨҮҢ\s]*$/, "onlyLetters"),
    middleName: string()
      .trim()
      .matches(/^[aA-zZаА-яЯөүңӨҮҢ\s]*$/, "onlyLetters"),
    personalNumber: string()
      .trim()
      .min(14, "minNumbers")
      .max(14, "maxNumbers")
      .required("required")
      .matches(/^[0-9]*$/, "onlyNumbers"),
    birthDate: date().nullable(),
    citizenship: object({
      id: number().integer().positive(),
    })
      .nullable()
      .default(null),
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
      id: number().integer().positive().nullable(),
      version: number().integer().positive().nullable(),
      address: string().trim().email("email"),
    }),
    mobilePhone: string()
      .trim()
      .required("required")
      .matches(/^[0-9\+\-\s]*$/, "onlyNumbers"),
    nameOfCompanyOfficial: string()
      .trim()
      .when("partnerTypeSelect", {
        is: 1,
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.nullable(),
      }),
    nameOfCompanyGov: string()
      .trim()
      .when("partnerTypeSelect", {
        is: 1,
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.nullable(),
      }),
    representativesName: string()
      .trim()
      .when("partnerTypeSelect", {
        is: 1,
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.nullable(),
      }),
    notaryRegistrationNumber: number()
      .integer()
      .when("partnerTypeSelect", {
        is: 1,
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.nullable(),
      }),
    notaryOKPONumber: number()
      .integer()
      .when("partnerTypeSelect", {
        is: 1,
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.nullable(),
      }),
    notaryPhysicalParticipantsQty: number()
      .integer()
      .when("partnerTypeSelect", {
        is: 1,
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.nullable(),
      }),
    notaryLegalParticipantsQty: number()
      .integer()
      .when("partnerTypeSelect", {
        is: 1,
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.nullable(),
      }),
    notaryTotalParticipantsQty: number()
      .integer()
      .when("partnerTypeSelect", {
        is: 1,
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.nullable(),
      }),
  })
  .concat(filesSchema.pick(["files"]));
