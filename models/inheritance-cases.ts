import {
  IInheritanceCasesListFilterFormFields,
  IInheritanceCasesListSearchBarForm,
} from "@/validator-schemas/inheritance-cases";

export type InheritanceCasesFilterValuesProps = {
  notaryUniqNumber: string;
  ["requester.personalNumber"]: string;
  ["requester.fullName"]: string;
  ["requester.deathDate"]: string;
} & IInheritanceCasesListFilterFormFields &
  IInheritanceCasesListSearchBarForm;
