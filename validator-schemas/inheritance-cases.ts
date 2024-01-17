import { object, InferType, string } from "yup";
import { addressSchema } from "./address";

export type IInheritanceCasesFilterForm = InferType<typeof inheritanceCasesFilterForm>;

export const inheritanceCasesFilterForm = object().shape({
  inheritanceCaseNumber: string(),
  pin: string(),
  fullName: string(),
  dateOfDeath: string(),
  year: string(),
  keyWord: string(),
});
