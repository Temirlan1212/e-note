import { InferType, boolean, number, object, string } from "yup";

export type IAddressSchema = InferType<typeof addressSchema>;

export const addressSchema = object().shape({
  id: number().integer().positive().nullable(),
  version: number().integer().positive().nullable(),
  region: object({
    id: number().integer().positive(),
  })
    .nullable()
    .default(null),
  district: object({
    id: number().integer().positive(),
  })
    .nullable()
    .default(null),
  city: object({
    id: number().integer().positive(),
  })
    .nullable()
    .default(null),
  addressL4: string().trim(),
  addressL3: string().trim(),
  addressL2: string().trim(),
});
