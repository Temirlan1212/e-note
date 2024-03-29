import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Box, Typography } from "@mui/material";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { GridTable, IFilterSubmitParams } from "@/components/ui/GridTable";
import Pagination from "@/components/ui/Pagination";
import { GridSortModel } from "@mui/x-data-grid";
import { ValueOf } from "next/dist/shared/lib/constants";

interface IRequestBody {
  searchValue?: string | null;
  roleValue?: string | null;
  requestType?: string | null;
  pageSize?: number;
  page?: number;
  sortBy?: string[];
  filterValues: Record<string, any>;
}

export default function ForeignInstitutionsOfficialsContent() {
  const t = useTranslations();
  const [rowData, setRowData] = useState<FetchResponseBody | null>(null);

  const [requestBody, setRequestBody] = useState<IRequestBody>({
    pageSize: 7,
    page: 1,
    sortBy: [],
    searchValue: null,
    roleValue: "Foreign institution official",
    requestType: "getAllData",
    filterValues: {},
  });

  const { data, loading } = useFetch("/api/officials", "POST", {
    body: requestBody,
  });

  const updateRequestBodyParams = (key: keyof IRequestBody, newValue: ValueOf<IRequestBody>) => {
    setRequestBody((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const handleSortByDate = (model: GridSortModel) => {
    const sortBy = model.map((s) => (s.sort === "asc" ? s.field : `-${s.field}`));
    setRequestBody((prev: any) => ({
      ...prev,
      sortBy: sortBy,
    }));
  };

  const handleFilterSubmit = async (value: IFilterSubmitParams) => {
    handleUpdateFilterValues(value);
    if (value.value.length > 0) updateRequestBodyParams("page", 1);
  };

  const handleUpdateFilterValues = (value: IFilterSubmitParams) => {
    const type = value.rowParams.colDef.filter?.type;
    if (type === "simple") {
      const field = value.rowParams.colDef.field;
      const prevValue = requestBody.filterValues;

      if (field) {
        if (value.value.length > 0 && value.value) {
          updateRequestBodyParams("filterValues", {
            ...prevValue,
            [field]: value.value,
          });
          updateRequestBodyParams("requestType", "searchFilter");
        } else {
          const updatedFilterValues = { ...prevValue };
          delete updatedFilterValues[field];
          updateRequestBodyParams("filterValues", updatedFilterValues);
        }
      }
    }
  };

  const handlePageChange = (page: number) => {
    if (requestBody.page !== page) updateRequestBodyParams("page", page);
  };

  useEffect(() => {
    data && setRowData(data);
  }, [data]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h4" color="success.main">
          {t("ForeignInstitutions")}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <GridTable
            columns={[
              {
                field: "fullName",
                headerName: "Full name",
                width: 280,
                filter: {
                  type: "simple",
                },
                sortable: false,
              },
              {
                field: "notaryPosition",
                headerName: "Position",
                width: 280,
                filter: {
                  type: "simple",
                },
                sortable: false,
              },
              {
                field: "birthDate",
                headerName: "Date of birth",
                width: 200,
              },
              {
                field: "mobilePhone",
                headerName: "Phone number",
                width: 220,
              },
              {
                field: "emailAddress.address",
                headerName: "E-mail",
                width: 180,
              },
              {
                field: "simpleFullName",
                headerName: "Institution",
                width: 180,
              },
              {
                field: "notaryWorkOrder",
                headerName: "Order",
                width: 200,
                sortable: false,
              },
              {
                field: "notaryCriminalRecord",
                headerName: "Criminal record",
                width: 200,
                sortable: false,
              },
            ]}
            sx={{
              height: "100%",
              ".notaryColumn": {
                color: "success.main",
              },
            }}
            rowHeight={65}
            cellMaxHeight="200px"
            loading={loading}
            rows={rowData?.data ?? []}
            onFilterSubmit={handleFilterSubmit}
            onSortModelChange={handleSortByDate}
          />
          <Pagination
            sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
            currentPage={requestBody.page ?? 1}
            totalPages={data?.total ? Math.ceil(data.total / (requestBody.pageSize ?? 7)) : 1}
            onPageChange={handlePageChange}
          />
        </Box>
      </Box>
    </Box>
  );
}
