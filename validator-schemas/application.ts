import { number, object, InferType, string, mixed, date, array, boolean } from "yup";

export const requesterAddressSchema = object().shape({
  address: object({
    region: object({
      id: number()
        .integer()
        .nullable()
        .transform((value) => (isNaN(value) ? null : value)),
    }),
    district: object({
      id: number()
        .integer()
        .nullable()
        .transform((value) => (isNaN(value) ? null : value)),
    }),
    city: object({
      id: number()
        .integer()
        .nullable()
        .transform((value) => (isNaN(value) ? null : value)),
    }),
    addressL4: string().trim(),
    addressL3: string().trim(),
    addressL2: string().trim(),
  }),
  isDeliveryAddr: boolean(),
  isDefaultAddr: boolean(),
  isInvoicingAddr: boolean(),
});

export const requesterSchema = object().shape({
  partnerTypeSelect: number()
    .integer()
    .nullable()
    .test("nullable-required", "required", (v) => v != null)
    .transform((value) => (isNaN(value) ? null : value)),
  partner: object({
    foreigner: boolean(),
  }),
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
  personalNumber: number()
    .integer()
    .nullable()
    .test("nullable-required", "required", (v) => v != null)
    .transform((value) => (isNaN(value) ? null : value)),
  birthDate: date().nullable(),
  citizenship: object({
    id: number()
      .integer()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value)),
  }),
  identityDocument: number()
    .integer()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  passportSeries: number()
    .integer()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  passportNumber: string().trim(),
  authority: string().trim(),
  authorityNumber: number()
    .integer()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  dateOfIssue: date().nullable(),
  partnerAddressList: array().of(requesterAddressSchema),
  emailAddress: object({
    address: string().trim().email(),
  }),
  mobilePhone: string().trim(),
});

export const applicationSchema = object().shape({
  id: number()
    .integer()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  version: number()
    .integer()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  region: number()
    .integer()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  district: number()
    .integer()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  city: number()
    .integer()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  notaryDistrict: number()
    .integer()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  company: object({
    id: number()
      .integer()
      .required("required")
      .transform((value) => (isNaN(value) ? null : value)),
  }),
  object: number()
    .integer()
    .transform((value) => (isNaN(value) ? null : value))
    .nullable()
    .test("nullable-required", "required", (v) => v != null),
  objectType: number()
    .integer()
    .transform((value) => (isNaN(value) ? null : value))
    .nullable()
    .test("nullable-required", "required", (v) => v != null),
  notarialAction: number()
    .integer()
    .transform((value) => (isNaN(value) ? null : value))
    .nullable()
    .test("nullable-required", "required", (v) => v != null),
  typeNotarialAction: number()
    .integer()
    .transform((value) => (isNaN(value) ? null : value))
    .nullable()
    .test("nullable-required", "required", (v) => v != null),
  action: number()
    .integer()
    .transform((value) => (isNaN(value) ? null : value))
    .nullable()
    .test("nullable-required", "required", (v) => v != null),
  requester: array().of(requesterSchema),
});

export type IApplicationSchema = InferType<typeof applicationSchema>;
