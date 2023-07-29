import { number, object, InferType, string, mixed } from "yup";

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
  // company: number().integer().required("required"),
  object: number()
    .integer()
    .required("required")
    .transform((value) => (isNaN(value) ? null : value)),
  objectType: number()
    .integer()
    .required("required")
    .transform((value) => (isNaN(value) ? null : value)),
  notarialAction: number()
    .integer()
    .required("required")
    .transform((value) => (isNaN(value) ? null : value)),
  typeNotarialAction: number()
    .integer()
    .required("required")
    .transform((value) => (isNaN(value) ? null : value)),
  action: number()
    .integer()
    .required("required")
    .transform((value) => (isNaN(value) ? null : value)),
});

export type IApplicationSchema = InferType<typeof applicationSchema>;
