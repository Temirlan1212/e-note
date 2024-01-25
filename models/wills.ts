import { IWillsListFilterFormFields, IWillsListSearchBarForm } from "@/validator-schemas/will";

export type WillsFilterValuesProps = {
  notaryUniqNumber: string;
  ["requester.personalNumber"]: string;
  ["requester.fullName"]: string;
  ["requester.deathDate"]: string;
} & IWillsListFilterFormFields &
  IWillsListSearchBarForm;
