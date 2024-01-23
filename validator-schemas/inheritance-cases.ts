import { object, InferType, string } from "yup";

export type IInheritanceCasesFilterFormFields = InferType<typeof inheritanceCasesFilterFormFields>;
export type IInheritanceCasesSearchBarForm = InferType<typeof inheritanceCasesSearchBarForm>;

export const inheritanceCasesFilterFormFields = object().shape({
  year: string(),
});

export const inheritanceCasesSearchBarForm = object().shape({
  keyWord: string(),
});
