import React, { ChangeEvent, useEffect, useState } from "react";
import { ValueOf } from "next/dist/shared/lib/constants";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { IActionType } from "@/models/action-type";
import { IStatus } from "@/models/application-status";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { Box, IconButton, Typography } from "@mui/material";
import { GridSortModel, GridValueGetterParams } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Button from "@/components/ui/Button";
import { GridTable, IFilterSubmitParams } from "@/components/ui/GridTable";
import Pagination from "@/components/ui/Pagination";
import Link from "@/components/ui/Link";
import { ApplicationListActions } from "./ApplicationListActions";
import { ApplicationListQRMenu } from "./ApplicationListQRMenu";
import SearchBar from "@/components/ui/SearchBar";
import ClearIcon from "@mui/icons-material/Clear";
import { IApplication } from "@/models/application";

interface IAppQueryParams {
  pageSize: number;
  page: number;
  sortBy: string[];
  filterValues: Record<string, (string | number)[]>;
  searchValue: string;
}

export default function ApplicationList() {
  const t = useTranslations();
  const { locale } = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { data: actionTypeData } = useFetch("/api/dictionaries/action-type", "POST");
  const { data: documentTypeData } = useFetch("/api/dictionaries/document-type", "POST");
  const { data: statusData } = useFetch("/api/dictionaries/application-status", "POST");
  const { data: executorData } = useFetch(
    "/api/dictionaries/selection/notary.filter.saleorder.by.performer.type.select",
    "POST"
  );

  const [appQueryParams, setAppQueryParams] = useState<IAppQueryParams>({
    pageSize: 7,
    page: 1,
    sortBy: ["-creationDate"],
    filterValues: {},
    searchValue: "",
  });

  const { data, loading, update } = useFetch("/api/applications", "POST", {
    body: appQueryParams,
  });

  useEffect(() => {
    setFilteredData(data?.data);
  }, [data?.data]);

  const { data: searchedData, update: search } = useFetch("", "POST");

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
    search("/api/applications/search", {
      content: searchValue,
    });
    setAppQueryParams((prevParams) => ({
      ...prevParams,
      searchValue: searchValue,
    }));
  };

  useEffect(() => {
    const matchedItems = data?.data?.filter(
      (dataItem: IApplication) =>
        Array.isArray(searchedData?.data) && searchedData?.data?.some((searchedItem) => searchedItem.id === dataItem.id)
    );
    setFilteredData(matchedItems);
  }, [searchedData]);

  const handleReset = () => {
    setSearchValue("");
    setAppQueryParams((prevParams) => ({
      ...prevParams,
      searchValue: "",
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
    <Box height={{ xs: "600px", md: "700px" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h4" color="primary">
          {t("Notarial actions")}
        </Typography>
        <Link href="applications/create">
          <Button sx={{ py: "10px", px: "20px" }} component="label" startIcon={<PostAddIcon />}>
            {t("Create")}
          </Button>
        </Link>
      </Box>

      <Box
        sx={{
          marginBottom: "20px",
          width: { xs: "100%", md: "70%" },
        }}
      >
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
      </Box>

      <GridTable
        columns={[
          {
            field: "QR",
            headerName: "QR",
            width: 70,
            sortable: false,
            renderCell: (params: any) => <ApplicationListQRMenu params={params} />,
          },
          {
            field: "notaryUniqNumber",
            headerName: "Unique number",
            width: 200,
            sortable: true,
          },
          {
            field: "requester.fullName",
            headerName: "Member-1",
            width: 200,
            sortable: true,
          },
          {
            field: "members.fullName",
            headerName: "Member-2",
            width: 200,
            sortable: true,
          },
          {
            field: "typeNotarialAction",
            headerName: "Type of action",
            width: 200,
            editable: false,
            sortable: false,
            filter: {
              data: actionTypeData?.data ?? [],
              labelField: "title_" + locale,
              valueField: "value",
              type: "dictionary",
              field: "typeNotarialAction",
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
            field: locale !== "en" ? "$t:product.name" : "product.name",
            headerName: "Type of document",
            width: 250,
            editable: false,
            sortable: false,
            filter: {
              data: documentTypeData?.data ?? [],
              labelField: locale !== "en" ? "$t:name" : "name",
              valueField: "id",
              type: "dictionary",
              field: "product.id",
            },
          },
          {
            field: "statusSelect",
            headerName: "Status",
            description: "statusSelect",
            width: 200,
            editable: false,
            sortable: false,
            filter: {
              data: statusData?.data ?? [],
              labelField: "title_" + locale,
              valueField: "value",
              type: "dictionary",
              field: "statusSelect",
            },
            valueGetter: (params: GridValueGetterParams) => {
              if (statusData != null) {
                const matchedItem = statusData?.data?.find((item: IStatus) => item.value == String(params.value));
                const translatedTitle = matchedItem?.[("title_" + locale) as keyof IActionType];
                return !!translatedTitle ? translatedTitle : matchedItem?.["title" as keyof IActionType] ?? "";
              }
              return params.value;
            },
          },
          {
            field: "creationDate",
            headerName: "Date",
            width: 170,
            sortable: true,
          },
          {
            field: "createdBy.partner.fullName",
            headerName: "Executor",
            width: 200,
            sortable: false,
            filter: {
              data: executorData?.data ?? [],
              labelField: locale === "ru" || locale === "kg" ? "title_ru" : "title",
              valueField: "value",
              type: "dictionary",
              field: "createdBy.partner.fullName",
            },
            cellClassName: "executorColumn",
          },
          {
            field: "actions",
            headerName: "",
            width: 275,
            sortable: false,
            type: "actions",
            cellClassName: "actions-pinnable",
            renderCell: (params) => <ApplicationListActions params={params} onDelete={handleDelete} />,
          },
        ]}
        rows={filteredData ?? []}
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
