import { ValueOf } from "next/dist/shared/lib/constants";
import { FC, createContext, useContext, PropsWithChildren, useState, Dispatch, SetStateAction, useRef } from "react";

type ParamsProps<T> = {
  pageSize: number;
  page: number;
  sortBy: string[];
  filterValues: T;
  requestType: "search" | "fetch";
};

type FetchListParams<T> = {
  setParams: Dispatch<SetStateAction<ParamsProps<T>>>;
  updateParams: (key: keyof ParamsProps<T>, newValue: ValueOf<ParamsProps<T>>) => void;
  updateFilterValues: (
    key: keyof ParamsProps<T>["filterValues"],
    newValue: ValueOf<ParamsProps<T>["filterValues"]>
  ) => void;
} & { params: ParamsProps<T> };

const paramsInitState: ParamsProps<any> = {
  pageSize: 7,
  page: 1,
  sortBy: ["-creationDate"],
  filterValues: {},
  requestType: "fetch",
};

const Context = createContext<FetchListParams<any>>({
  params: paramsInitState,
  setParams: () => {},
  updateParams: () => {},
  updateFilterValues: () => {},
});

function useTypedContext<Item extends any>() {
  const context = useContext<Item>(Context as unknown as React.Context<Item>);
  if (!context) {
    throw new Error("useMyContext must be used under MyContextProvider");
  }
  return context;
}

function useFetchListParams<T extends any>() {
  return useTypedContext<FetchListParams<T>>();
}

const FetchListParamsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [params, setParams] = useState(paramsInitState);

  const updateParams = (key: keyof ParamsProps<any>, newValue: ValueOf<ParamsProps<any>>) => {
    setParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const updateFilterValues = (key: any, newValue: any) => {
    setParams((prev) => {
      let filterValues: Partial<any> = { ...prev.filterValues, [key]: newValue };
      if (!newValue) delete filterValues[key];
      return { ...prev, filterValues };
    });
  };

  return (
    <Context.Provider value={{ params, setParams, updateParams, updateFilterValues }}>{children}</Context.Provider>
  );
};

export { FetchListParamsContextProvider, useFetchListParams };
