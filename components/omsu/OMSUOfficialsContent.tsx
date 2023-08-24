import React, { FC, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Box, Typography } from "@mui/material";
import useFetch from "@/hooks/useFetch";
import { GridTable, IFilterSubmitParams } from "@/components/ui/GridTable";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";

import ExcelIcon from "@/public/icons/excel.svg";
import { GridSortModel } from "@mui/x-data-grid";
import { ValueOf } from "next/dist/shared/lib/constants";

interface IRequestBody {
  searchValue: string | null;
  roleValue: string | null;
  requestType?: string | null;
  pageSize: number;
  page: number;
  sortBy: string[];
  filterValues: Record<string, (string | number)[]>;
}

interface IRowData {
  status: number;
  offset: number;
  total: number;
  data: Array<Record<string, any>>;
}

export default function OMSUOfficialsContent() {
  const t = useTranslations();
  const [keywordValue, setKeywordValue] = useState<string>("");
  const [rowData, setRowData] = useState<IRowData | null>(null);

  const [requestBody, setRequestBody] = useState<IRequestBody>({
    pageSize: 7,
    page: 1,
    sortBy: [],
    searchValue: null,
    roleValue: "OMSU official",
    requestType: "getAllData",
    filterValues: {},
  });

  const { data, loading, update } = useFetch("/api/officials", "POST", {
    body: requestBody,
  });

  const { export: exportExcel, download: downloadExcel } = useFetch("", "POST", {
    body: requestBody,
  });

  const updateRequestBodyParams = (key: keyof IRequestBody, newValue: ValueOf<IRequestBody>) => {
    setRequestBody((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordValue(event.target.value);
  };

  const handleKeywordSearch = async () => {
    updateRequestBodyParams("requestType", "search");
    updateRequestBodyParams("searchValue", keywordValue);

    setRowData(data);
  };

  const exportToExcel = () => {
    // updateRequestBodyParams("requestType", "export");
  };

  const handleSortByDate = (model: GridSortModel) => {
    const sortBy = model.map((s) => (s.sort === "asc" ? s.field : `-${s.field}`));
    setRequestBody((prev: any) => ({
      ...prev,
      sortBy: sortBy,
    }));
  };

  const handleFilterSubmit = async (value: IFilterSubmitParams) => {
    const field = value.rowParams.colDef.filter?.field;
    if (value.value.length > 0) {
      updateRequestBodyParams("filterValues", { [field]: value.value });
      updateRequestBodyParams("requestType", "searchFilterValue");
    }
  };

  const handlePageChange = (page: number) => {
    if (requestBody.page !== page) updateRequestBodyParams("page", page);
  };

  useEffect(() => {
    if (data && keywordValue === "") {
      setRowData(data);
    }
  }, [data, keywordValue]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Typography typography="h4" color={"#1BAA75"}>
        {t("OMSUOfficials")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "30px",
          alignItems: "center",
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <SearchBar
          boxSx={{
            width: {
              xs: "100%",
              md: "80%",
            },
          }}
          onChange={handleKeywordChange}
          onClick={handleKeywordSearch}
          value={keywordValue}
        />
        <Button
          variant="outlined"
          color="primary"
          sx={{
            height: "auto",
            gap: "10px",
            padding: "10px 22px",
            width: { md: "20%", xs: "100%" },
            display: { xs: "none", sm: "none", md: "unset" },
            "&:hover": { color: "#F6F6F6" },
          }}
          endIcon={<ExcelIcon />}
          onClick={exportToExcel}
        >
          <Typography fontWeight={600} fontSize={14}>
            {t("Export to excel")}
          </Typography>
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <GridTable
            columns={[
              {
                field: "fullName",
                headerName: "Full name",
                width: 280,
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

          <Button
            color="primary"
            variant="outlined"
            sx={{
              "&:hover": {
                background: "#fff !important",
                border: "1px solid",
              },
              padding: "10px 10px",
              marginTop: "30px",
              display: { xs: "flex", sm: "flex", md: "none" },
              alignSelf: "center",
            }}
            fullWidth
            endIcon={<ExcelIcon />}
            onClick={exportToExcel}
          >
            <Typography fontWeight={600} fontSize={14}>
              {t("Export to excel")}
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
