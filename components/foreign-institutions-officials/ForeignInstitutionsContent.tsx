import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Box, Typography } from "@mui/material";
import useFetch from "@/hooks/useFetch";
import { GridTable, IFilterSubmitParams } from "@/components/ui/GridTable";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import ExcelIcon from "@/public/icons/excel.svg";
import { GridSortModel } from "@mui/x-data-grid";
import { ValueOf } from "next/dist/shared/lib/constants";

interface IRequestBody {
  searchValue?: string | null;
  roleValue?: string | null;
  requestType?: string | null;
  pageSize?: number;
  page?: number;
  sortBy?: string[];
  filterValues: Record<string, (string | number)[]>;
}

interface IRowData {
  status: number;
  offset: number;
  total: number;
  data: Array<Record<string, any>>;
}

export default function ForeignInstitutionsOfficialsContent() {
  const t = useTranslations();
  const [rowData, setRowData] = useState<IRowData | null>(null);
  const [fileName, setFileName] = useState<string | null>("");

  const [requestBody, setRequestBody] = useState<IRequestBody>({
    pageSize: 7,
    page: 1,
    sortBy: [],
    searchValue: null,
    roleValue: "Foreign institution official",
    requestType: "getAllData",
    filterValues: {},
  });

  const [excelReqBody, setExcelReqBody] = useState<IRequestBody>({
    roleValue: "Foreign institution official",
    filterValues: {},
  });

  const { data, loading } = useFetch("/api/officials", "POST", {
    body: requestBody,
  });

  const { data: exportExcel } = useFetch("/api/officials/export", "POST", {
    body: excelReqBody,
  });

  const { update: downloadExcel } = useFetch("", "GET", {
    returnResponse: true,
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
    const field = value.rowParams.colDef.field;
    const prevValue = requestBody.filterValues;

    if (field) {
      if (value.value.length > 0) {
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
  };

  const handlePageChange = (page: number) => {
    if (requestBody.page !== page) updateRequestBodyParams("page", page);
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
    if (data && exportExcel?.data) {
      setRowData(data);
      setFileName(exportExcel.data.fileName);
    }
  }, [data, exportExcel?.data]);

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
        <Box>
          <Button
            component="label"
            endIcon={<ExcelIcon />}
            color="primary"
            variant="outlined"
            sx={{
              gap: "10px",
              "&:hover": { color: "#F6F6F6" },
            }}
            onClick={download}
          >
            {t("Export to excel")}
          </Button>
        </Box>
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
            currentPage={requestBody.page}
            totalPages={data?.total ? Math.ceil(data.total / requestBody.pageSize) : 1}
            onPageChange={handlePageChange}
          />
        </Box>
      </Box>
    </Box>
  );
}
