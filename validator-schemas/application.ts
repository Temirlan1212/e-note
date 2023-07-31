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
  company: number()
    .integer()
    .required("required")
    .transform((value) => (isNaN(value) ? null : value)),
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
});

export type IApplicationSchema = InferType<typeof applicationSchema>;
