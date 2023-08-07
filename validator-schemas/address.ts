import { InferType, boolean, number, object, string } from "yup";

export type IAddressSchema = InferType<typeof addressSchema>;

export const addressSchema = object().shape({
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
