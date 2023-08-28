import React, { useState } from "react";
import { ValueOf } from "next/dist/shared/lib/constants";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { IActionType } from "@/models/action-type";
import { IUserData } from "@/models/user";
import { IStatus } from "@/models/application-status";
import { useProfileStore } from "@/stores/profile";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { Box, Typography } from "@mui/material";
import { GridSortModel, GridValueGetterParams } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Button from "@/components/ui/Button";
import { GridTable, IFilterSubmitParams } from "@/components/ui/GridTable";
import Pagination from "@/components/ui/Pagination";
import Link from "@/components/ui/Link";
import { ApplicationListActions } from "./ApplicationListActions";
import { IStatus } from "@/models/dictionaries/status";

interface IAppQueryParams {
  pageSize: number;
  page: number;
  sortBy: string[];
  filterValues: Record<string, (string | number)[]>;
}

export default function ApplicationList() {
  const t = useTranslations();
  const { locale } = useRouter();
  const { data: actionTypeData } = useFetch("/api/dictionaries/action-type", "POST");
  const { data: documentTypeData } = useFetch("/api/dictionaries/document-type", "POST");
  const { data: statusData } = useFetch("/api/dictionaries/status", "POST");

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
        <Typography variant="h4" color="text.primary">
          {t("Notarial actions")}
        </Typography>
        <Link href="applications/create">
          <Button sx={{ py: "10px", px: "20px" }} component="label" startIcon={<PostAddIcon />}>
            {t("Create")}
          </Button>
        </Link>
      </Box>

      <GridTable
        columns={[
          {
            field: "QR",
            headerName: "QR",
            width: 90,
            sortable: false,
            renderCell: (params: any) => <QrCode2Icon />,
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
            field: "product.name",
            headerName: "Type of document",
            width: 250,
            editable: false,
            sortable: false,
            filter: {
              data: documentTypeData?.data ?? [],
              labelField: "name",
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
            renderCell: (params) => <ApplicationListActions params={params} onDelete={handleDelete} />,
          },
        ]}
        rows={data?.data ?? []}
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
