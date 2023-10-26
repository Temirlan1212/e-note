import React, { useState, useEffect, ChangeEvent } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import useFetch from "@/hooks/useFetch";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import { GridTable, IFilterSubmitParams, IGridColDef } from "@/components/ui/GridTable";
import { GridSortModel, GridValueGetterParams } from "@mui/x-data-grid";
import { ValueOf } from "next/dist/shared/lib/constants";
import ClearIcon from "@mui/icons-material/Clear";
import { IActionType } from "@/models/action-type";
import { useRouter } from "next/router";
import { INotarialAction, INotarialActionData } from "@/models/notarial-action";

interface IAppQueryParams {
  pageSize: number;
  page: number;
  sortBy: string[];
  filterValues: Record<string, (string | number)[]>;
  searchValue: string;
}

function GridTableActionsCell({ row }: { row: Record<string, any> }) {
  const t = useTranslations();

  const handleNewApplicationClick = async () => {};

  const handleInMyTemplatesClick = async () => {};

  return (
    <Box sx={{ display: "flex", gap: "16px" }}>
      <Button variant="contained" sx={{ width: "132px", padding: "13px 29px" }} onClick={handleNewApplicationClick}>
        <Typography fontSize={14} fontWeight={600}>
          {t("New application")}
        </Typography>
      </Button>

      <Button
        variant="text"
        sx={{
          width: "132px",
          border: "1px dashed #CDCDCD",
          padding: "13px 29px",
          overflow: "hidden",
          "&:hover": { backgroundColor: "inherit" },
        }}
        onClick={handleInMyTemplatesClick}
      >
        <Typography fontSize={14} fontWeight={600}>
          {t("In my templates")}
        </Typography>
      </Button>
    </Box>
  );
}

export default function TemplateList() {
  const [appQueryParams, setAppQueryParams] = useState<IAppQueryParams>({
    pageSize: 7,
    page: 1,
    sortBy: ["id"],
    filterValues: {},
    searchValue: "",
  });
  const [searchValue, setSearchValue] = useState<string>("");

  const t = useTranslations();
  const { locale } = useRouter();

  const { data, loading } = useFetch("/api/templates", "POST", {
    body: appQueryParams,
  });

  const { data: notarialData, loading: notarialLoading } = useFetch<INotarialActionData>(
    "/api/dictionaries/notarial-action",
    "GET"
  );

  const { data: actionTypeData } = useFetch("/api/dictionaries/action-type", "POST");
  const updateAppQueryParams = (key: keyof IAppQueryParams, newValue: ValueOf<IAppQueryParams>) => {
    setAppQueryParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const handleFilterSubmit = async (value: IFilterSubmitParams) => {
    handleUpdateFilterValues(value);
    if (value.value.length > 0) updateAppQueryParams("page", 1);
  };

  const handlePageChange = (page: number) => {
    if (appQueryParams.page !== page) updateAppQueryParams("page", page);
  };

  const handleUpdateFilterValues = (value: IFilterSubmitParams) => {
    const type = value.rowParams.colDef.filter?.type;
    if (type === "dictionary") {
      const field = value.rowParams.colDef.filter?.field;
      const prevValue = appQueryParams.filterValues;

      if (field && Array.isArray(value.value)) {
        if (value.value.length > 0) {
          updateAppQueryParams("filterValues", {
            ...prevValue,
            [field]: value.value,
          });
        } else {
          const updatedFilterValues = { ...prevValue };
          delete updatedFilterValues[field];
          updateAppQueryParams("filterValues", updatedFilterValues);
        }
      }
    }
  };

  const handleSortByDate = async (model: GridSortModel) => {
    const sortBy = model.map((s) => (s.sort === "asc" ? s.field : `-${s.field}`));
    updateAppQueryParams("sortBy", sortBy);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === "") {
      setAppQueryParams((prevParams) => ({
        ...prevParams,
        searchValue: "",
      }));
    }
    setSearchValue(value);
  };

  const handleSearchSubmit = () => {
    if (searchValue == null) return;
    setAppQueryParams((prevParams) => ({
      ...prevParams,
      page: 1,
      searchValue: searchValue,
    }));
  };

  const handleReset = () => {
    setSearchValue("");
    setAppQueryParams((prevParams) => ({
      ...prevParams,
      searchValue: "",
    }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Typography variant="h4" color="success.main">
        {t("System templates")}
      </Typography>
      <SearchBar
        value={searchValue}
        onChange={handleSearchChange}
        onClick={handleSearchSubmit}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleReset} sx={{ visibility: searchValue === "" ? "hidden" : "visible" }}>
              <ClearIcon />
            </IconButton>
          ),
        }}
      />

      <GridTable
        columns={[
          {
            field: "id",
            headerName: "Template ID",
            width: 180,
          },
          {
            field: "name",
            headerName: "Template name",
            width: 340,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) => {
              return locale !== "en" ? params.row["$t:name"] : params.row.name;
            },
          },
          {
            field: "notaryActionType",
            headerName: "Action type",
            width: 200,
            editable: false,
            sortable: false,
            filter: {
              data: actionTypeData?.data ?? [],
              labelField: "title_" + locale,
              valueField: "value",
              type: "dictionary",
              field: "notaryActionType",
            },
            valueGetter: (params: GridValueGetterParams) => {
              if (actionTypeData?.data != null) {
                const matchedItem = actionTypeData?.data.find((item: IActionType) => item.value == params.value);
                const translatedTitle = matchedItem?.[("title_" + locale) as keyof IActionType];
                return !!translatedTitle ? translatedTitle : matchedItem?.["title" as keyof IActionType] ?? "";
              }
              return params.value;
            },
          },
          {
            field: "notaryObject",
            headerName: "Object type",
            width: 320,
            sortable: false,
            filter: {
              data: notarialData?.object ?? [],
              labelField: "title_" + locale,
              valueField: "value",
              type: "dictionary",
              field: "notaryObject",
            },
            valueGetter: (params: GridValueGetterParams) => {
              if (notarialData?.object != null) {
                const matchedItem = notarialData?.object?.find((item: INotarialAction) => item.value == params.value);
                const translatedTitle = matchedItem?.[("title_" + locale) as keyof INotarialAction];
                return !!translatedTitle ? translatedTitle : matchedItem?.["title" as keyof INotarialAction] ?? "";
              }
              return params.value;
            },
          },
          {
            field: "actions",
            type: "actions",
            sortable: false,
            width: 320,
            cellClassName: "actions-pinnable",
            renderCell: ({ row }) => <GridTableActionsCell row={row} />,
          },
        ]}
        rows={data?.data ?? []}
        onFilterSubmit={handleFilterSubmit}
        onSortModelChange={handleSortByDate}
        cellMaxHeight="200px"
        loading={loading}
        sx={{
          height: "100%",
          ".executorColumn": {
            color: "success.main",
          },
        }}
        rowHeight={65}
      />

      <Pagination
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
        currentPage={appQueryParams.page}
        totalPages={data?.total ? Math.ceil(data.total / appQueryParams.pageSize) : 1}
        onPageChange={handlePageChange}
      />
    </Box>
  );
}
