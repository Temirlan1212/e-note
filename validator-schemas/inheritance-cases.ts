import { object, InferType, string } from "yup";

export type IInheritanceCasesListFilterFormFields = InferType<typeof inheritanceCasesListFilterFormFields>;
export type IInheritanceCasesListSearchBarForm = InferType<typeof inheritanceCasesListSearchBarForm>;

export const inheritanceCasesListFilterFormFields = object().shape({
  year: string(),
});

export const inheritanceCasesListSearchBarForm = object().shape({
  keyWord: string(),
});
