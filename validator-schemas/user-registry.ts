import { number, object, InferType, string, date, boolean } from "yup";

export type IUserRegistrySchema = InferType<typeof userRegistrySchema>;
export type IUserRegistryFiltrationSchema = InferType<typeof userRegistryFiltrationSchema>;

const userAddressSchema = object().shape({
  id: number().integer().positive().nullable(),
  version: number().integer().positive().nullable(),
  region: object({
    id: number().integer().positive(),
  })
    .default(null)
    .required("required"),
  district: object({
    id: number().integer().positive(),
  })
    .required("required")
    .default(null),
  city: object({
    id: number().integer().positive(),
  })
    .required("required")
    .default(null),
  addressL4: string().trim().required("required"),
  addressL3: string().trim().required("required"),
  addressL2: string().trim().required("required"),
});

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
      .matches(/^[0-9]*$/, "onlyNumbers")
      .required("required"),
    authority: string().trim().required("required"),
    authorityNumber: string()
      .trim()
      .matches(/^[0-9]*$/, "onlyNumbers")
      .required("required"),
    dateOfIssue: date().required("required"),
    foreigner: boolean(),
    mainAddress: userAddressSchema,
    actualResidenceAddress: userAddressSchema,
    mobilePhone: string()
      .trim()
      .required("required")
      .matches(/^[0-9\+\-\s]*$/, "onlyNumbers"),
    emailAddress: object({
      id: number().integer().positive().nullable(),
      version: number().integer().positive().nullable(),
      address: string().trim().email("email").required("required"),
    }),
  })
  .concat(userAddressSchema.pick(["region", "district", "city"]));

export const userRegistryFiltrationSchema = object().shape({
  keyword: string(),
  role: string(),
  createdBy: string(),
  createdOn: object()
    .shape({
      value: date(),
      value2: date(),
    })
    .nullable(),
});
