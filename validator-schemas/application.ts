import { number, object, InferType, string, mixed, date, array, boolean } from "yup";
import { personSchema } from "./person";
import { addressSchema } from "./address";

export type IApplicationSchema = InferType<typeof applicationSchema>;

export const applicationSchema = object()
  .shape({
    id: number().integer().positive().nullable(),
    version: number().integer().positive().nullable(),
    statusSelect: number().integer().positive().nullable(),
    notarySignatureStatus: number().integer().positive().nullable(),
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
      .nullable(),
    objectType: number()
      .integer()
      .transform((value) => (isNaN(value) ? null : value))
      .nullable(),
    notarialAction: number()
      .integer()
      .transform((value) => (isNaN(value) ? null : value))
      .nullable(),
    typeNotarialAction: number()
      .integer()
      .transform((value) => (isNaN(value) ? null : value))
      .nullable(),
    isToPrintLineSubTotal: boolean().nullable(),
    action: number()
      .integer()
      .transform((value) => (isNaN(value) ? null : value))
      .nullable(),
    product: object({
      id: number().integer().positive(),
      oneSideAction: boolean(),
      idProductCancelled: boolean(),
    })
      .nullable()
      .default(null)
      .test("nullable-required", "required", (v) => v != null),

    requester: array().of(personSchema),
    members: array().of(
      personSchema.concat(
        object({
          tundukPassportSeries: string().transform((value) => (value == null ? "" : value)),
          tundukPassportNumber: string()
            .trim()
            .matches(/^[0-9]*$/, "onlyNumbers"),
          subjectRole: string(),
        })
      )
    ),
    openFields: boolean(),
    selectTemplateFromMade: boolean(),
    orderNumber: mixed().nullable(),
    currency: object({
      id: number().integer().positive().nullable(),
      code: string().nullable(),
      name: string().nullable(),
    }).nullable(),
  })
  .concat(addressSchema.pick(["region", "district", "city"]));
