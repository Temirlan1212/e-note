import {
  IInheritanceCasesListFilterFormFields,
  IInheritanceCasesListSearchBarForm,
} from "@/validator-schemas/inheritance-cases";
import { ValueOf } from "next/dist/shared/lib/constants";
import { FC, createContext, useContext, PropsWithChildren, useState, Dispatch, SetStateAction, useRef } from "react";

type FilterValuesProps = {
  notaryUniqNumber: string;
  ["requester.personalNumber"]: string;
  ["requester.fullName"]: string;
  ["requester.deathDate"]: string;
} & IInheritanceCasesListFilterFormFields &
  IInheritanceCasesListSearchBarForm;

type QueryParamsProps = {
  pageSize: number;
  page: number;
  sortBy: string[];
  filterValues: Partial<FilterValuesProps>;
  requestType: "search" | "fetch";
};

type FilterValuesContextProps = {
  setQueryParams: Dispatch<SetStateAction<QueryParamsProps>>;
  updateQueryParams: (key: keyof QueryParamsProps, newValue: ValueOf<QueryParamsProps>) => void;
  updateFilterValues: (
    key: keyof QueryParamsProps["filterValues"],
    newValue: ValueOf<QueryParamsProps["filterValues"]>
  ) => void;
} & { queryParams: QueryParamsProps };

const queryParamsInitState: QueryParamsProps = {
  pageSize: 7,
  page: 1,
  sortBy: ["-creationDate"],
  filterValues: {},
  requestType: "fetch",
};

const FilterValuesContext = createContext<FilterValuesContextProps>({
  queryParams: queryParamsInitState,
  setQueryParams: () => {},
  updateQueryParams: () => {},
  updateFilterValues: () => {},
});

const useFilterValues = () => useContext(FilterValuesContext);

const FilterValuesProvider: FC<PropsWithChildren> = ({ children }) => {
  const [queryParams, setQueryParams] = useState(queryParamsInitState);

  const updateQueryParams = (key: keyof QueryParamsProps, newValue: ValueOf<QueryParamsProps>) => {
    setQueryParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const updateFilterValues = (key: keyof Partial<FilterValuesProps>, newValue: ValueOf<Partial<FilterValuesProps>>) => {
    setQueryParams((prev) => {
      let filterValues: Partial<FilterValuesProps> = { ...prev.filterValues, [key]: newValue };
      if (!newValue) delete filterValues[key];
      return { ...prev, filterValues };
    });
  };

  return (
    <FilterValuesContext.Provider value={{ queryParams, setQueryParams, updateQueryParams, updateFilterValues }}>
      {children}
    </FilterValuesContext.Provider>
  );
};

export { FilterValuesProvider, useFilterValues };
