import React, { FC, useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import { Box, Typography } from "@mui/material";

import useFetch from "@/hooks/useFetch";

import Button from "@/components/ui/Button";
import SearchBar from "@/components/ui/SearchBar";
import { GridTable } from "@/components/ui/GridTable";
import Pagination from "@/components/ui/Pagination";

import ExcelIcon from "@/public/icons/excel.svg";

interface IRequestBody {
  searchValue: string | null;
  roleValue: string | null;
  requestType?: string | null;
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

  const [requestBody, setRequestBody] = useState<any>({
    searchValue: null,
    roleValue: "OMSU official",
    requestType: "getAllData",
  });

  const { data, loading } = useFetch("/api/officials", "POST", {
    body: requestBody,
  });

  const { export: exportExcel, download: downloadExcel } = useFetch("", "POST", {
    body: requestBody,
  });

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordValue(event.target.value);
  };

  const handleKeywordSearch = async () => {
    setRequestBody((prev: any) => ({
      ...prev,
      requestType: "search",
      searchValue: keywordValue,
      roleValue: "OMSU official",
    }));

    setRowData(data);
  };

  const exportToExcel = async () => {
    // setRequestBody((prev: any) => ({
    //   ...prev,
    //   roleValue: "OMSU official",
    //   requestType: "export",
    // }));
    // await exportExcel("/api/officials", requestBody);
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
        gap: "40px",
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
          sx={{
            "&:hover": {
              background: "#fff !important",
              border: "1px solid",
            },
            display: {
              xs: "none",
              md: "flex",
            },
            width: {
              xs: "100%",
              md: "20%",
            },
            padding: "10px 10px",
          }}
          color="primary"
          variant="outlined"
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
            rows={rowData?.data ?? []}
            columns={[
              { field: "fullName", headerName: "Full name", width: 280 },
              { field: "notaryPosition", headerName: "Position", width: 280 },
              { field: "birthDate", headerName: "Date of birth", width: 200 },
              { field: "mobilePhone", headerName: "Phone number", width: 220 },
              { field: "emailAddress.address", headerName: "E-mail", width: 180 },
              { field: "simpleFullName", headerName: "Institution", width: 180 },
              { field: "notaryWorkOrder", headerName: "Order", width: 200 },
              { field: "notaryCriminalRecord", headerName: "Criminal record", width: 200 },
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
          />
          <Pagination
            sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
            totalPages={data?.total ? Math.ceil(data.total / 7) : 1}
          />

          <Button
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
            color="primary"
            variant="outlined"
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
