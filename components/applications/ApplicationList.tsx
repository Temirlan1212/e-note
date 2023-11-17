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
}

interface ISearchedDataItem {
  SaleOrder: Partial<IApplication>;
  content: string;
  editUrl: string;
  id: number;
  title: string;
  url: string;
}

export default function ApplicationList() {
  const t = useTranslations();
  const { locale } = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchedData, setIsSearchedData] = useState(false);
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
  });

  const { data, loading, update } = useFetch<FetchResponseBody | null>("/api/applications", "POST", {
    body: appQueryParams,
  });

  useEffect(() => {
    setFilteredData(data?.data);
  }, [data?.data]);

  const { data: searchedData, update: search, loading: searchLoading } = useFetch<FetchResponseBody | null>("", "POST");

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
      setFilteredData([]);
      setIsSearchedData(false);
      setAppQueryParams((prevParams) => ({
        ...prevParams,
      }));
    }
    setSearchValue(value);
  };

  const handleSearchSubmit = async () => {
    if (searchValue == null || searchValue === "") return;
    const searchResult = await search("/api/applications/search", {
      content: searchValue,
    });

    const searchedDataArray = searchResult?.data?.map((item: ISearchedDataItem) => item?.SaleOrder) || [];
    setFilteredData(searchedDataArray);
    setIsSearchedData(searchedDataArray.length > 0);
  };

  const handleReset = () => {
    setSearchValue("");
    setFilteredData([]);
    setIsSearchedData(false);
    setAppQueryParams((prevParams) => ({
      ...prevParams,
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

  const calculateTotalPages = () => {
    const sourceData = isSearchedData ? searchedData?.data : data;
    return Math.ceil((sourceData?.total || sourceData?.length || 1) / appQueryParams.pageSize);
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
            sortable: isSearchedData ? false : true,
          },
          {
            field: "requester.fullName",
            headerName: "Member-1",
            width: 200,
            sortable: isSearchedData ? false : true,
            valueGetter: (params: GridValueGetterParams) => {
              return isSearchedData ? params.row?.requester?.[0]?.fullName : params.row?.["requester.fullName"];
            },
          },
          {
            field: "members.fullName",
            headerName: "Member-2",
            width: 200,
            sortable: isSearchedData ? false : true,
            valueGetter: (params: GridValueGetterParams) => {
              return isSearchedData ? params.row?.members?.[0]?.fullName : params.row?.["members.fullName"];
            },
          },
          {
            field: "typeNotarialAction",
            headerName: "Type of action",
            width: 200,
            editable: false,
            sortable: false,
            filter: isSearchedData
              ? undefined
              : {
                  data: actionTypeData?.data ?? [],
                  labelField: "title_" + locale,
                  valueField: "value",
                  type: "dictionary",
                  field: "typeNotarialAction",
                },
            valueGetter: (params: GridValueGetterParams) => {
              if (actionTypeData?.data != null) {
                const matchedItem = actionTypeData?.data.find(
                  (item: IActionType) => item.value == (isSearchedData ? params.row.typeNotarialAction : params.value)
                );
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
            filter: isSearchedData
              ? undefined
              : {
                  data: documentTypeData?.data ?? [],
                  labelField: locale !== "en" ? "$t:name" : "name",
                  valueField: "id",
                  type: "dictionary",
                  field: "product.id",
                },
            valueGetter: (params: GridValueGetterParams) => {
              const nameKey = locale !== "en" ? "$t:product.name" : "product.name";
              const fullNameKey = locale !== "en" ? "$t:fullName" : "fullName";
              return isSearchedData
                ? params.row?.product?.[fullNameKey]
                : params.row?.[nameKey] || params.row?.["product.name"];
            },
          },
          {
            field: "statusSelect",
            headerName: "Status",
            description: "statusSelect",
            width: 200,
            editable: false,
            sortable: false,
            filter: isSearchedData
              ? undefined
              : {
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
            sortable: isSearchedData ? false : true,
          },
          {
            field: "createdBy.partner.fullName",
            headerName: "Executor",
            width: 200,
            sortable: false,
            filter: isSearchedData
              ? undefined
              : {
                  data: executorData?.data ?? [],
                  labelField: locale === "ru" || locale === "kg" ? "title_ru" : "title",
                  valueField: "value",
                  type: "dictionary",
                  field: "createdBy.partner.fullName",
                },
            cellClassName: "executorColumn",
            valueGetter: (params: GridValueGetterParams) => {
              return isSearchedData ? params.row?.createdBy?.fullName : params.row?.["createdBy.partner.fullName"];
            },
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
        loading={loading || searchLoading}
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
        totalPages={calculateTotalPages()}
        onPageChange={handlePageChange}
      />
    </Box>
  );
}
