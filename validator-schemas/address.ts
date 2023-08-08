import { InferType, boolean, number, object, string } from "yup";

export type IAddressSchema = InferType<typeof addressSchema>;

export const addressSchema = object().shape({
  region: object({
    id: number()
      .integer()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value)),
  }).nullable(),
  district: object({
    id: number()
      .integer()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value)),
  }).nullable(),
  city: object({
    id: number()
      .integer()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value)),
  }).nullable(),
  addressL4: string().trim(),
  addressL3: string().trim(),
  addressL2: string().trim(),
  isDeliveryAddr: boolean(),
  isDefaultAddr: boolean(),
  isInvoicingAddr: boolean(),
});
