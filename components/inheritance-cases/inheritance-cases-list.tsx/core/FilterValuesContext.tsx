import {
  IInheritanceCasesListFilterFormFields,
  IInheritanceCasesListSearchBarForm,
} from "@/validator-schemas/inheritance-cases";
import { ValueOf } from "next/dist/shared/lib/constants";
import { FC, createContext, useContext, PropsWithChildren, useState, Dispatch, SetStateAction } from "react";

type FilterValuesProps = {
  inheritanceCaseNumber: string;
  pin: string;
  fullName: string;
  dateOfDeath: string;
} & IInheritanceCasesListFilterFormFields &
  IInheritanceCasesListSearchBarForm;

type QueryParamsProps = {
  pageSize: number;
  page: number;
  sortBy: string[];
  filterValues: Partial<FilterValuesProps>;
};

type FilterValuesContextProps = {
  setQueryParams: Dispatch<SetStateAction<QueryParamsProps>>;
  updateQueryParams: (key: keyof QueryParamsProps, newValue: ValueOf<QueryParamsProps>) => void;
  updateFilterValues: (
    key: keyof QueryParamsProps["filterValues"],
    newValue: ValueOf<QueryParamsProps["filterValues"]>
  ) => void;
} & { queryParams: QueryParamsProps };

const FilterValuesContext = createContext<FilterValuesContextProps>({
  queryParams: {
    pageSize: 0,
    page: 0,
    sortBy: [],
    filterValues: {},
  },
  setQueryParams: () => {},
  updateQueryParams: () => {},
  updateFilterValues: () => {},
});

const useFilterValues = () => useContext(FilterValuesContext);

const FilterValuesProvider: FC<PropsWithChildren> = ({ children }) => {
  const [queryParams, setQueryParams] = useState({
    pageSize: 7,
    page: 1,
    sortBy: ["-creationDate"],
    filterValues: {},
  });

  const updateQueryParams = (key: keyof QueryParamsProps, newValue: ValueOf<QueryParamsProps>) => {
    setQueryParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const updateFilterValues = (key: keyof Partial<FilterValuesProps>, newValue: ValueOf<Partial<FilterValuesProps>>) => {
    setQueryParams((prev) => {
      const filterValues = prev.filterValues;
      return { ...prev, filterValues: { ...filterValues, [key]: newValue } };
    });
  };

  return (
    <FilterValuesContext.Provider value={{ queryParams, setQueryParams, updateQueryParams, updateFilterValues }}>
      {children}
    </FilterValuesContext.Provider>
  );
};

export { FilterValuesProvider, useFilterValues };
