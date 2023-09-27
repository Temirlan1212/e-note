import React, { FC, useEffect, useState } from "react";

import { Box, IconButton, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import UserRegistryFilterForm from "./UserRegistryFilterForm";
import UserRegistryTableList from "./UserRegistryTableList";
import Button from "../ui/Button";
import useFetch from "@/hooks/useFetch";
import { ValueOf } from "next/dist/shared/lib/constants";
import { useForm } from "react-hook-form";
import HeirNotFoundData from "@/components/search-for-heirs/HeirNotFoundData";
import { GridSortModel } from "@mui/x-data-grid";
import SearchBar from "@/components/ui/SearchBar";
import ExcelIcon from "@/public/icons/excel.svg";
import ClearIcon from "@mui/icons-material/Clear";
import { IUserRegistryFiltrationSchema } from "@/validator-schemas/user-registry";

interface IUserRegistryContentProps {}

export interface IUsersQueryParams {
  pageSize: number;
  page: number;
  sortBy: string[] | null;
  searchValue?: string | null;
  filterData?: any;
}

const UserRegistryContent: FC<IUserRegistryContentProps> = (props) => {
  const t = useTranslations();

  const form = useForm<IUserRegistryFiltrationSchema>();
  const { reset, register, watch } = form;

  const [fileName, setFileName] = useState<string | null>("");
  const [excelReqBody, setExcelReqBody] = useState({
    roleValue: "user registry",
    filterValues: {},
  });
  const [usersQueryParams, setUsersQueryParams] = useState<IUsersQueryParams>({
    pageSize: 8,
    page: 1,
    sortBy: null,
    searchValue: null,
    filterData: null,
  });

  const {
    data: users,
    loading,
    update,
  } = useFetch("/api/user-registry", "POST", {
    body: usersQueryParams,
  });

  const { update: downloadExcel } = useFetch("", "GET", {
    returnResponse: true,
  });
  const { data: exportExcel } = useFetch("/api/officials/export", "POST", {
    body: excelReqBody,
  });

  const updateUsersQueryParams = (key: keyof IUsersQueryParams, newValue: ValueOf<IUsersQueryParams>) => {
    setUsersQueryParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const handlePageChange = (page: number) => {
    if (usersQueryParams.page !== page) updateUsersQueryParams("page", page);
  };

  const handleSearchSubmit = () => {
    const searchValue = form.getValues().keyword;
    if (searchValue == null) return;
    updateUsersQueryParams("searchValue", searchValue);
  };

  const handleSearchReset = () => {
    form.resetField("keyword");
    if (usersQueryParams.searchValue) {
      updateUsersQueryParams("searchValue", "");
    }
  };

  const handleFormReset = () => {
    reset();
    updateUsersQueryParams("filterData", null);
  };

  const handleFormSubmit = (data: any) => {
    const filteredData: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        filteredData[key] = data[key] === "" ? null : data[key];
      }
    }
    updateUsersQueryParams("filterData", filteredData);
  };

  const handleSortByDate = async (model: GridSortModel) => {
    const sortBy = model.map((s) => (s.sort === "asc" ? s.field : `-${s.field}`));
    updateUsersQueryParams("sortBy", sortBy);
  };

  const handleDelete = async () => {
    const res = await update();
    if (res?.total) {
      const pageQuantity = Math.ceil(res.total / usersQueryParams.pageSize);
      const page = usersQueryParams.page;
      if (pageQuantity >= page) {
        updateUsersQueryParams("page", page);
      } else {
        updateUsersQueryParams("page", pageQuantity);
      }
    }
  };

  const download = async () => {
    const response = await downloadExcel(`/api/officials/download/${fileName}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName || "exported-data.csv";
    document.body.appendChild(a);
    a.click();
  };

  useEffect(() => {
    if (exportExcel?.data) {
      setFileName(exportExcel.data.fileName);
    }
  }, [exportExcel?.data]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      <Typography variant="h4" color="success.main">
        {t("User registry")}
      </Typography>
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
      <Box
        sx={{
          display: "flex",
          gap: "30px",
          alignItems: "flex-start",
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <SearchBar
          boxSx={{ width: { xs: "100%", md: "80%" } }}
          register={register}
          onClick={handleSearchSubmit}
          name="keyword"
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => watch("keyword") && handleSearchReset()}
                sx={{ visibility: watch("keyword") ? "visible" : "hidden" }}
              >
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
        <Button
          sx={{
            fontSize: "14px",
            ":hover": {
              color: "#fff",
            },
            display: {
              md: "flex",
            },
            width: {
              xs: "100%",
              md: "30%",
            },
            padding: "13px 10px",
          }}
          color="success"
          variant="outlined"
          endIcon={<ExcelIcon />}
          onClick={download}
        >
          {t("Export to Excel")}
        </Button>
      </Box>
      <UserRegistryFilterForm form={form} onFormSubmit={handleFormSubmit} onFormReset={handleFormReset} />
      {users?.data?.length! > 0 ? (
        <UserRegistryTableList
          handlePageChange={handlePageChange}
          loading={loading}
          users={users}
          usersQueryParams={usersQueryParams}
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
