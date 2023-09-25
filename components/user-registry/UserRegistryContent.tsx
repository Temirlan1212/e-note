import React, { FC, useState } from "react";

import { Box } from "@mui/material";
import { useTranslations } from "next-intl";

import UserRegistryFiltration from "./UserRegistryFiltration";
import UserRegistryTableList from "./UserRegistryTableList";
import Button from "../ui/Button";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { ValueOf } from "next/dist/shared/lib/constants";
import { useForm } from "react-hook-form";
import HeirNotFoundData from "@/components/search-for-heirs/HeirNotFoundData";
import { GridSortModel } from "@mui/x-data-grid";
import { IPartner } from "@/models/user";

interface IUserRegistryContentProps {}

interface IAppQueryParams {
  pageSize: number;
  page: number;
  sortBy: string[] | null;
  searchValue?: string | null;
  requestType?: string | null;
  requestData?: any;
}

export interface IUserRegistryFilterData {
  createdOn: {
    value: string;
    value2: string;
  };
  role: string | null;
  createdBy: string | null;
}

export interface IUserRegistryCriteria {
  value2?: string;
  value: string;
  fieldName: string;
  operator: string;
}

export interface IUserRegistryData extends Partial<FetchResponseBody> {
  data: IPartner[];
}

const UserRegistryContent: FC<IUserRegistryContentProps> = (props) => {
  const t = useTranslations();

  const form = useForm();

  const { handleSubmit, control, reset } = form;

  const [appQueryParams, setAppQueryParams] = useState<IAppQueryParams>({
    pageSize: 8,
    page: 1,
    sortBy: null,
    searchValue: null,
    requestData: null,
    requestType: null,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: users,
    loading,
    update,
  } = useFetch<IUserRegistryData>("/api/user-registry", "POST", {
    body: appQueryParams,
  });

  const updateAppQueryParams = (key: keyof IAppQueryParams, newValue: ValueOf<IAppQueryParams>) => {
    setAppQueryParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const handlePageChange = (page: number) => {
    if (appQueryParams.page !== page) updateAppQueryParams("page", page);
  };

  const handleSearchSubmit = () => {
    if (!searchQuery) {
      return;
    }

    setAppQueryParams((prevParams) => ({
      ...prevParams,
      page: 1,
      requestType: "keywordSearch",
      searchValue: searchQuery,
    }));
  };

  const onFilterClear = () => {
    reset();
    setAppQueryParams((prevParams) => ({
      ...prevParams,
      requestType: null,
      requestData: null,
    }));
  };

  const onFilterSubmit = (data: any) => {
    const filteredData: any = {};

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        filteredData[key] = data[key] === "" ? null : data[key];
      }
    }

    setAppQueryParams((prevParams) => ({
      ...prevParams,
      requestType: "filterSearch",
      requestData: filteredData,
    }));
  };

  const handleSortByDate = async (model: GridSortModel) => {
    const sortBy = model.map((s) => (s.sort === "asc" ? s.field : `-${s.field}`));
    updateAppQueryParams("sortBy", sortBy);
  };

  const handleDelete = async () => {
    const res = await update();
    if (res?.total) {
      const pageQuantity = Math.ceil(res.total / appQueryParams.pageSize);
      const page = appQueryParams.page;
      if (pageQuantity >= page) {
        updateAppQueryParams("page", page);
      } else {
        updateAppQueryParams("page", pageQuantity);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      <Button
        href="/user-registry/create"
        color="success"
        sx={{
          width: "320px",
          margin: {
            xs: "0 auto",
            sm: "0 auto 0 0",
          },
        }}
      >
        {t("Add a new user")}
      </Button>
      <UserRegistryFiltration
        loading={loading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onFilterSubmit={onFilterSubmit}
        handleSubmit={handleSubmit}
        control={control}
        onFilterClear={onFilterClear}
      />
      {users?.data?.length! > 0 ? (
        <UserRegistryTableList
          handlePageChange={handlePageChange}
          loading={loading}
          users={users}
          appQueryParams={appQueryParams}
          onDelete={handleDelete}
          onSortChange={handleSortByDate}
        />
      ) : (
        <HeirNotFoundData />
      )}
    </Box>
  );
};

export default UserRegistryContent;
