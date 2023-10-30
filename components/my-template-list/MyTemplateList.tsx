import { useState, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { ValueOf } from "next/dist/shared/lib/constants";
import { Box, IconButton, Typography } from "@mui/material";
import { GridSortModel, GridValueGetterParams } from "@mui/x-data-grid";
import useFetch from "@/hooks/useFetch";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import { GridTable, IFilterSubmitParams } from "@/components/ui/GridTable";
import ClearIcon from "@mui/icons-material/Clear";
import { INotarialAction, INotarialActionData } from "@/models/notarial-action";
import { useProfileStore } from "@/stores/profile";

interface ITempQueryParams {
  pageSize: number;
  page: number;
  sortBy: string[];
  filterValues: Record<string, (string | number)[]>;
  searchValue: string;
  isSystem: boolean;
  createdById?: number;
}

export default function TemplateList() {
  const profile = useProfileStore((state) => state.getUserData());
  const [tempQueryParams, setTempQueryParams] = useState<ITempQueryParams>({
    pageSize: 7,
    page: 1,
    sortBy: ["id"],
    filterValues: {},
    searchValue: "",
    isSystem: false,
    createdById: profile?.group.id,
  });
  const [searchValue, setSearchValue] = useState<string>("");

  const t = useTranslations();
  const { locale } = useRouter();

  const { data, loading } = useFetch("/api/templates", "POST", {
    body: tempQueryParams,
  });

  const { data: notarialData } = useFetch<INotarialActionData>("/api/dictionaries/notarial-action", "GET");

  const updateTempQueryParams = (key: keyof ITempQueryParams, newValue: ValueOf<ITempQueryParams>) => {
    setTempQueryParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const handleFilterSubmit = async (value: IFilterSubmitParams) => {
    handleUpdateFilterValues(value);
    if (value.value.length > 0) updateTempQueryParams("page", 1);
  };

  const handlePageChange = (page: number) => {
    if (tempQueryParams.page !== page) updateTempQueryParams("page", page);
  };

  const handleUpdateFilterValues = (value: IFilterSubmitParams) => {
    const type = value.rowParams.colDef.filter?.type;
    if (type === "dictionary") {
      const field = value.rowParams.colDef.filter?.field;
      const prevValue = tempQueryParams.filterValues;

      if (field && Array.isArray(value.value)) {
        if (value.value.length > 0) {
          updateTempQueryParams("filterValues", {
            ...prevValue,
            [field]: value.value,
          });
        } else {
          const updatedFilterValues = { ...prevValue };
          delete updatedFilterValues[field];
          updateTempQueryParams("filterValues", updatedFilterValues);
        }
      }
    }
  };

  const handleSortByDate = async (model: GridSortModel) => {
    const sortBy = model.map((s) => (s.sort === "asc" ? s.field : `-${s.field}`));
    updateTempQueryParams("sortBy", sortBy);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === "") {
      setTempQueryParams((prevParams) => ({
        ...prevParams,
        searchValue: "",
      }));
    }
    setSearchValue(value);
  };

  const handleSearchSubmit = () => {
    if (searchValue == null) return;
    setTempQueryParams((prevParams) => ({
      ...prevParams,
      page: 1,
      searchValue: searchValue,
    }));
  };

  const handleReset = () => {
    setSearchValue("");
    setTempQueryParams((prevParams) => ({
      ...prevParams,
      searchValue: "",
    }));
  };

  return (
    <Box height={{ xs: "600px", md: "700px" }} sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Typography variant="h4" color="success.main">
        {t("My templates")}
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
            width: 150,
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
            field: "notaryObject",
            headerName: "Object",
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
            field: "notaryObjectType",
            headerName: "Object type",
            width: 280,
            sortable: false,
            filter: {
              data: notarialData?.objectType ?? [],
              labelField: "title_" + locale,
              valueField: "value",
              type: "dictionary",
              field: "notaryObjectType",
            },
            valueGetter: (params: GridValueGetterParams) => {
              if (notarialData?.objectType != null) {
                const matchedItem = notarialData?.objectType?.find(
                  (item: INotarialAction) => item.value == params.value
                );
                const translatedTitle = matchedItem?.[("title_" + locale) as keyof INotarialAction];
                return !!translatedTitle ? translatedTitle : matchedItem?.["title" as keyof INotarialAction] ?? "";
              }
              return params.value;
            },
          },
          {
            field: "notaryAction",
            headerName: "Notarial action",
            width: 340,
            editable: false,
            sortable: false,
            filter: {
              data: notarialData?.notarialAction ?? [],
              labelField: "title_" + locale,
              valueField: "value",
              type: "dictionary",
              field: "notaryAction",
            },
            valueGetter: (params: GridValueGetterParams) => {
              if (notarialData?.notarialAction != null) {
                const matchedItem = notarialData?.notarialAction.find(
                  (item: INotarialAction) => item.value == params.value
                );
                const translatedTitle = matchedItem?.[("title_" + locale) as keyof INotarialAction];
                return !!translatedTitle ? translatedTitle : matchedItem?.["title" as keyof INotarialAction] ?? "";
              }
              return params.value;
            },
          },
          {
            field: "notaryActionType",
            headerName: "Action type",
            width: 200,
            editable: false,
            sortable: false,
            filter: {
              data: notarialData?.typeNotarialAction ?? [],
              labelField: "title_" + locale,
              valueField: "value",
              type: "dictionary",
              field: "notaryActionType",
            },
            valueGetter: (params: GridValueGetterParams) => {
              if (notarialData?.typeNotarialAction != null) {
                const matchedItem = notarialData?.typeNotarialAction.find(
                  (item: INotarialAction) => item.value == params.value
                );
                const translatedTitle = matchedItem?.[("title_" + locale) as keyof INotarialAction];
                return !!translatedTitle ? translatedTitle : matchedItem?.["title" as keyof INotarialAction] ?? "";
              }
              return params.value;
            },
          },
          {
            field: "notaryRequestAction",
            headerName: "Purpose of action",
            width: 300,
            sortable: false,
            filter: {
              data: notarialData?.action ?? [],
              labelField: "title_" + locale,
              valueField: "value",
              type: "dictionary",
              field: "notaryRequestAction",
            },
            valueGetter: (params: GridValueGetterParams) => {
              if (notarialData?.action != null) {
                const matchedItem = notarialData?.action?.find((item: INotarialAction) => item.value == params.value);
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
            width: 200,
            cellClassName: "actions-pinnable",
            renderCell: () => (
              <Button href="/applications/create" variant="contained">
                <Typography fontSize={14} fontWeight={600}>
                  {t("New application")}
                </Typography>
              </Button>
            ),
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
        sx={{ display: "flex", justifyContent: "center" }}
        currentPage={tempQueryParams.page}
        totalPages={data?.total ? Math.ceil(data.total / tempQueryParams.pageSize) : 1}
        onPageChange={handlePageChange}
      />
    </Box>
  );
}
