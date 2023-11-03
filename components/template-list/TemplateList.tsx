import { useState, ChangeEvent, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { ValueOf } from "next/dist/shared/lib/constants";
import { Box, IconButton, Typography } from "@mui/material";
import { GridSortModel, GridValueGetterParams } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import { GridTable, IFilterSubmitParams } from "@/components/ui/GridTable";
import { INotarialAction, INotarialActionData } from "@/models/notarial-action";

interface ITempQueryParams {
  pageSize: number;
  page: number;
  sortBy: string[];
  filterValues: Record<string, (string | number)[]>;
  searchValue: string;
  isSystem: boolean;
}

export interface ITemplateData {
  editUrl: string;
  userToken: string;
}

const capitalize = (str: string) => str?.[0].toUpperCase() + str?.slice(1);

function GridTableActionsCell({ row }: { row: Record<string, any> }) {
  const t = useTranslations();

  const { data, loading, update } = useFetch<FetchResponseBody<ITemplateData>>("", "POST");

  const handleInMyTemplatesClick = async () => {
    await update("/api/templates/" + row.id);
  };

  useEffect(() => {
    if (data?.data?.editUrl && data?.data?.userToken) {
      const href = `${data.data.editUrl}?AuthorizationBasic=${data.data.userToken.replace(/Basic /, "")}` as string;
      window.open(href, "_blank");
    }
  }, [data?.data]);

  return (
    <Box sx={{ display: "flex", gap: "16px" }}>
      <Button variant="contained" href="/applications/create">
        <Typography fontSize={14} fontWeight={600}>
          {t("New application")}
        </Typography>
      </Button>

      <Button
        variant="text"
        sx={{
          border: "1px dashed #CDCDCD",
          "&:hover": { backgroundColor: "inherit" },
        }}
        loading={loading}
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
  const [tempQueryParams, setTempQueryParams] = useState<ITempQueryParams>({
    pageSize: 7,
    page: 1,
    sortBy: [],
    filterValues: {},
    searchValue: "",
    isSystem: true,
  });
  const [searchValue, setSearchValue] = useState<string>("");
  const t = useTranslations();
  const { locale } = useRouter();

  const { data, loading } = useFetch("/api/templates", "POST", {
    body: tempQueryParams,
  });

  const { data: objectData, loading: objectLoading } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=object`,
    "POST"
  );

  const { data: objectTypeData, loading: objectTypeLoading } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=objectType`,
    "POST"
  );

  const { data: notarialActionData, loading: notarialActionLoading } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=notarialAction`,
    "POST"
  );

  const { data: typeNotarialActionData, loading: typeNotarialActionLoading } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=typeNotarialAction}`,
    "POST"
  );

  const { data: actionData, loading: actionLoading } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=action`,
    "POST"
  );

  const updateAppQueryParams = (key: keyof ITempQueryParams, newValue: ValueOf<ITempQueryParams>) => {
    setTempQueryParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const handleFilterSubmit = async (value: IFilterSubmitParams) => {
    handleUpdateFilterValues(value);
    if (value.value.length > 0) updateAppQueryParams("page", 1);
  };

  const handlePageChange = (page: number) => {
    if (tempQueryParams.page !== page) updateAppQueryParams("page", page);
  };

  const handleUpdateFilterValues = (value: IFilterSubmitParams) => {
    const type = value.rowParams.colDef.filter?.type;
    if (type === "dictionary") {
      const field = value.rowParams.colDef.filter?.field;
      const prevValue = tempQueryParams.filterValues;

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
              data: objectData?.data ?? [],
              labelField: "nameIn" + capitalize(locale ?? ""),
              valueField: "id",
              type: "dictionary",
              field: "notaryObject",
            },
            valueGetter: (params: GridValueGetterParams) => {
              if (objectData?.data != null) {
                const matchedItem = objectData?.data?.find((item: INotarialAction) => item.id == params.id);
                const translatedTitle = matchedItem?.[("nameIn" + capitalize(locale ?? "")) as keyof INotarialAction];
                return !!translatedTitle ? translatedTitle : matchedItem?.["name" as keyof INotarialAction] ?? "";
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
              data: objectTypeData?.data ?? [],
              labelField: "nameIn" + capitalize(locale ?? ""),
              valueField: "id",
              type: "dictionary",
              field: "notaryObjectType",
            },
            valueGetter: (params: GridValueGetterParams) => {
              if (objectTypeData?.data != null) {
                const matchedItem = objectTypeData?.data?.find((item: INotarialAction) => item.id == params.id);
                const translatedTitle = matchedItem?.[("nameIn" + capitalize(locale ?? "")) as keyof INotarialAction];
                return !!translatedTitle ? translatedTitle : matchedItem?.["name" as keyof INotarialAction] ?? "";
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
              data: notarialActionData?.data ?? [],
              labelField: "nameIn" + capitalize(locale ?? ""),
              valueField: "id",
              type: "dictionary",
              field: "notaryAction",
            },
            valueGetter: (params: GridValueGetterParams) => {
              if (notarialActionData?.data != null) {
                const matchedItem = notarialActionData?.data.find((item: INotarialAction) => item.id == params.id);
                const translatedTitle = matchedItem?.[("nameIn" + capitalize(locale ?? "")) as keyof INotarialAction];
                return !!translatedTitle ? translatedTitle : matchedItem?.["name" as keyof INotarialAction] ?? "";
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
              data: typeNotarialActionData?.data ?? [],
              labelField: "nameIn" + capitalize(locale ?? ""),
              valueField: "id",
              type: "dictionary",
              field: "notaryActionType",
            },
            valueGetter: (params: GridValueGetterParams) => {
              if (typeNotarialActionData?.data != null) {
                const matchedItem = typeNotarialActionData?.data.find((item: INotarialAction) => item.id == params.id);
                const translatedTitle = matchedItem?.[("nameIn" + capitalize(locale ?? "")) as keyof INotarialAction];
                return !!translatedTitle ? translatedTitle : matchedItem?.["name" as keyof INotarialAction] ?? "";
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
              data: actionData?.data ?? [],
              labelField: "nameIn" + capitalize(locale ?? ""),
              valueField: "id",
              type: "dictionary",
              field: "notaryRequestAction",
            },
            valueGetter: (params: GridValueGetterParams) => {
              if (actionData?.data != null) {
                const matchedItem = actionData?.data?.find((item: INotarialAction) => item.id == params.id);
                const translatedTitle = matchedItem?.[("nameIn" + capitalize(locale ?? "")) as keyof INotarialAction];
                return !!translatedTitle ? translatedTitle : matchedItem?.["name" as keyof INotarialAction] ?? "";
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
        sx={{ display: "flex", justifyContent: "center" }}
        currentPage={tempQueryParams.page}
        totalPages={data?.total ? Math.ceil(data.total / tempQueryParams.pageSize) : 1}
        onPageChange={handlePageChange}
      />
    </Box>
  );
}
