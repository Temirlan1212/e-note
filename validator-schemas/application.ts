import { number, object, InferType, string, mixed, date, array, boolean } from "yup";
import { personSchema } from "./person";
import { addressSchema } from "./address";

export type IApplicationSchema = InferType<typeof applicationSchema>;

export const applicationSchema = object()
  .shape({
    id: number().integer().positive().nullable(),
    version: number().integer().positive().nullable(),
    notaryDistrict: object({
      id: number().integer().positive(),
    })
      .nullable()
      .default(null),
    company: object({
      id: number().integer().positive(),
    })
      .nullable()
      .default(null)
      .test("nullable-required", "required", (v) => v != null),
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
  })
  .concat(addressSchema.pick(["region", "district", "city"]));
