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
      .when("foreigner", {
        is: true,
        then: (schema) => schema.nullable(),
        otherwise: (schema) =>
          schema.when("partnerTypeSelect", {
            is: 2,
            then: (schema) => schema.required("required").min(2, "minLettersLow"),
            otherwise: (schema) => schema.nullable(),
          }),
      })

      .matches(/^[aA-zZаА-яЯёЁөүңӨҮҢ\s\-]*$/, "onlyLetters"),
    firstName: string()
      .trim()
      .when("foreigner", {
        is: true,
        then: (schema) => schema.nullable(),
        otherwise: (schema) =>
          schema.when("partnerTypeSelect", {
            is: 2,
            then: (schema) =>
              schema
                .required("required")
                .min(2, "minLettersLow")
                .matches(/^[aA-zZаА-яЯёЁөүңӨҮҢ\s\-]*$/, "onlyLetters"),
            otherwise: (schema) => schema.nullable(),
          }),
      }),
    middleName: string()
      .trim()
      .matches(/^[aA-zZаА-яЯёЁөүңӨҮҢ\s\-]*$/, "onlyLetters"),
    personalNumber: string()
      .trim()
      .when("foreigner", {
        is: true,
        then: (schema) => schema.nullable(),
        otherwise: (schema) =>
          schema.when("subjectRole", {
            is: "notAnAdult",
            then: (schema) => schema.nullable(),
            otherwise: (schema) =>
              schema
                .min(14, "minNumbers")
                .max(14, "maxNumbers")
                .required("required")
                .matches(/^[0-9]*$/, "onlyNumbers"),
          }),
      }),
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
    passportSeries: string().when("validatePassport", {
      is: true,
      then: (schema) => schema.required("This field is required!"),
      otherwise: (schema) => schema.nullable(),
    }),
    passportNumber: string()
      .trim()
      .when("validatePassport", {
        is: true,
        then: (schema) => schema.required("This field is required!"),
        otherwise: (schema) => schema.matches(/^[0-9]*$/, "onlyNumbers"),
      })
      .when("foreigner", {
        is: true,
        then: (schema) => schema.trim(),
        otherwise: (schema) => schema.matches(/^[0-9]*$/, "onlyNumbers"),
      }),
    authority: string().trim(),
    authorityNumber: string()
      .trim()
      .matches(/^[0-9\s]*$/, "onlyNumbers"),
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
        otherwise: (schema) => schema.nullable().transform((value) => (isNaN(value) ? null : value)),
      }),
    notaryOKPONumber: number()
      .integer()
      .when("partnerTypeSelect", {
        is: 1,
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.nullable().transform((value) => (isNaN(value) ? null : value)),
      }),
    notaryPhysicalParticipantsQty: number()
      .integer()
      .when("partnerTypeSelect", {
        is: 1,
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.nullable().transform((value) => (isNaN(value) ? null : value)),
      }),
    notaryLegalParticipantsQty: number()
      .integer()
      .when("partnerTypeSelect", {
        is: 1,
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.nullable().transform((value) => (isNaN(value) ? null : value)),
      }),
    notaryTotalParticipantsQty: number()
      .integer()
      .when("partnerTypeSelect", {
        is: 1,
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.nullable().transform((value) => (isNaN(value) ? null : value)),
      }),
    notaryDateOfOrder: date().nullable(),
    tundukPassportSeries: string()
      .transform((value) => (value == null ? "" : value))
      .required("required"),
    tundukPassportNumber: string()
      .trim()
      .matches(/^[0-9]*$/, "onlyNumbers")
      .required("required"),
    nationality: string(),
    familyStatus: boolean(),
    passportStatus: boolean(),
    maritalStatus: string(),
    disabled: boolean(),
    subjectRole: string().when("foreigner", {
      is: true,
      then: (schema) => schema.nullable(),
      otherwise: (schema) => schema.required("required"),
    }),
  })
  .concat(filesSchema.pick(["files"]));
