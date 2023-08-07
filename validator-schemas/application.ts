import { number, object, InferType, string, mixed, date, array, boolean } from "yup";
import { personSchema } from "./person";

export type IApplicationSchema = InferType<typeof applicationSchema>;

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
  product: object({
    id: number()
      .integer()
      .transform((value) => (isNaN(value) ? null : value))
      .nullable()
      .test("nullable-required", "required", (v) => v != null),
  }),
  requester: array().of(personSchema),
  members: array().of(personSchema),
});
