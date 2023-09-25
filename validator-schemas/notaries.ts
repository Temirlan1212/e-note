import { number, object, InferType, string } from "yup";
import { addressSchema } from "./address";

export type INotariesSchema = InferType<typeof notariesSchema>;

export const notariesSchema = object()
  .shape({
    notaryDistrict: object({
      id: number().integer().positive(),
    })
      .nullable()
      .default(null),
    workingDay: object({
      value: number().integer().positive(),
    })
      .nullable()
      .default(null),
    typeOfNotary: object({
      value: number().integer().positive(),
    })
      .nullable()
      .default(null),
    keyWord: string(),
    workMode: string(),
    notariesSort: string(),
  })
  .concat(addressSchema.pick(["region", "district", "city"]));
