import { GridTable, IFilterSubmitParams } from "../ui/GridTable";
import { Box, Typography } from "@mui/material";
import { GridSortModel, GridValueGetterParams } from "@mui/x-data-grid";
import { useDictionaryStore } from "@/stores/dictionaries";
import { useState } from "react";
import { GridTableActionsCell } from "./GridTableActionsCell";
import { useRouter } from "next/router";
import { IActionType } from "@/models/dictionaries/action-type";
import Pagination from "@/components/ui/Pagination";
import useFetch from "@/hooks/useFetch";
import { ValueOf } from "next/dist/shared/lib/constants";
import Button from "@/components/ui/Button";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Link from "@/components/ui/Link";
import { useTranslations } from "next-intl";

interface IAppQueryParams {
  pageSize: number;
  page: number;
  sortBy: string[];
  filterValues: Record<string, (string | number)[]>;
}

export default function ApplicationList() {
  const t = useTranslations();
  const { locale } = useRouter();
  const actionTypeData = useDictionaryStore((store) => store.actionTypeData);
  const documentTypeData = useDictionaryStore((store) => store.documentTypeData);
  const statusData = useDictionaryStore((store) => store.statusData);
  const [appQueryParams, setAppQueryParams] = useState<IAppQueryParams>({
    pageSize: 7,
    page: 1,
    sortBy: ["creationDate"],
    filterValues: {},
  });

  const { data, loading, update } = useFetch("/api/applications", "POST", {
    body: appQueryParams,
  });

  const updateAppQueryParams = (key: keyof IAppQueryParams, newValue: ValueOf<IAppQueryParams>) => {
    setAppQueryParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const handleFilterSubmit = async (value: IFilterSubmitParams) => {
    handleUpdateFilterValues(value);
    updateAppQueryParams("page", 1);
  };

  const handlePageChange = (page: number) => {
    if (appQueryParams.page !== page) updateAppQueryParams("page", page);
  };

  const handleUpdateFilterValues = (value: IFilterSubmitParams) => {
    const outPutFieldName = value.rowParams.colDef.description;
    const prevValue = appQueryParams.filterValues;

    if (outPutFieldName) {
      if (value.value.length > 0) {
        updateAppQueryParams("filterValues", { ...prevValue, [outPutFieldName]: value.value });
      } else {
        const updatedFilterValues = { ...prevValue };
        delete updatedFilterValues[outPutFieldName];
        updateAppQueryParams("filterValues", updatedFilterValues);
      }
    }
  };

  const handleSortByDate = async (model: GridSortModel) => {
    const sortBy = model.map((s) => (s.sort === "asc" ? s.field : `-${s.field}`));
    updateAppQueryParams("sortBy", sortBy);
  };

  const handleDelete = async () => {
    const res = await update();
    if (res?.total) {
      const page = Math.ceil(res.total / appQueryParams.pageSize);
      updateAppQueryParams("page", page);
    }
  };

  return (
    <Box height={{ xs: "600px", md: "700px" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h4" color="text.primary">
          {t("Your applications")}
        </Typography>
        <Link href="applications">
          <Button sx={{ py: "10px", px: "20px" }} component="label" startIcon={<PostAddIcon />}>
            {t("Create application")}
          </Button>
        </Link>
      </Box>

      <GridTable
        columns={[
          {
            field: "typeNotarialAction",
            headerName: "Type of action",
            description: "typeNotarialAction",
            width: 200,
            editable: false,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) => {
              if (actionTypeData != null) {
                const matchedItem = actionTypeData?.find((item) => item.value == params.value);
                return matchedItem?.[("title_" + locale) as keyof IActionType];
              }

              return params.value;
            },
          },
          {
            field: "product.name",
            description: "product.id",
            headerName: "Type of document",
            width: 250,
            editable: false,
            sortable: false,
          },
          {
            field: "statusSelect",
            headerName: "Status",
            description: "statusSelect",
            width: 200,
            editable: false,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) => {
              if (statusData != null) {
                const matchedItem = statusData?.find((item) => item.value == String(1));
                return matchedItem?.[("title_" + locale) as keyof IActionType];
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
            field: "company.name",
            headerName: "Notary",
            width: 200,
            sortable: false,
            cellClassName: "notaryColumn",
          },
          {
            field: "actions",
            headerName: "",
            width: 200,
            sortable: false,
            type: "actions",
            renderCell: (params) => <GridTableActionsCell params={params} onDelete={handleDelete} />,
          },
        ]}
        rows={data?.data ?? []}
        filterData={{
          data: {
            typeNotarialAction: actionTypeData ?? [],
            statusSelect: statusData ?? [],
            "product.name": documentTypeData ?? [],
          },
          filterField: {
            typeNotarialAction: { field: "title_" + locale, outputField: "value" },
            statusSelect: { field: "title_" + locale, outputField: "value" },
            "product.name": { field: "name", outputField: "id" },
          },
        }}
        onFilterSubmit={handleFilterSubmit}
        onSortModelChange={handleSortByDate}
        cellMaxHeight="200px"
        loading={loading}
        sx={{
          height: "100%",
          ".notaryColumn": {
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
