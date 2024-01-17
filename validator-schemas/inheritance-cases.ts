import { object, InferType, string } from "yup";

export type IInheritanceCasesFilterFormFields = InferType<typeof inheritanceCasesFilterFormFields>;
export type IInheritanceCasesSearchBarForm = InferType<typeof inheritanceCasesSearchBarForm>;
export type IInheritanceCasesFilterForm = IInheritanceCasesFilterFormFields & IInheritanceCasesSearchBarForm;

export const inheritanceCasesFilterFormFields = object().shape({
  inheritanceCaseNumber: string(),
  pin: string(),
  fullName: string(),
  dateOfDeath: string(),
  year: string(),
});

export const inheritanceCasesSearchBarForm = object().shape({
  keyWord: string(),
});
