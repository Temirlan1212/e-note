import { object, InferType, string } from "yup";

export type IWillsListFilterFormFields = InferType<typeof willsListFilterFormFields>;
export type IWillsListSearchBarForm = InferType<typeof willsListSearchBarForm>;

export const willsListFilterFormFields = object().shape({
  year: string(),
});

export const willsListSearchBarForm = object().shape({
  keyWord: string(),
});
