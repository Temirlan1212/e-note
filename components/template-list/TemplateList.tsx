import React, { useState } from "react";
import Head from "next/head";
import { Box, Typography, Container } from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";

import { useTranslations } from "next-intl";

import SwitchLanguage from "./SwitchLanguage";
import Pagination from "../ui/Pagination";
import SearchBar from "../ui/SearchBar";
import Button from "../ui/Button";
import { GridTable } from "../ui/GridTable";

export default function TemplateList() {
  const [selectedPage, setSelectedPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const t = useTranslations();

  const columns = [
    { field: "templateId", headerName: "Template ID", width: 180 },
    { field: "name", headerName: "Template name", width: 340 },
    { field: "actionType", headerName: "Action type", width: 320 },
    { field: "documentType", headerName: "Document type", width: 640 },
    { field: "objectType", headerName: "Object type", width: 320 },
    {
      field: "actions",
      headerName: "Actions",
      type: "acitons",
      sortable: false,
      width: 320,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", gap: "16px" }}>
          <Button variant="contained" sx={{ width: "132px", padding: "13px 29px" }}>
            <Typography fontSize={14} fontWeight={600}>
              {t("New application")}
            </Typography>
          </Button>

          <Button
            variant="text"
            sx={{
              width: "132px",
              border: "1px dashed #CDCDCD",
              padding: "13px 29px",
              overflow: "hidden",
              "&:hover": { backgroundColor: "inherit" },
            }}
          >
            <Typography fontSize={14} fontWeight={600}>
              {t("In my templates")}
            </Typography>
          </Button>
        </Box>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      templateId: "01238",
      name: t("Movable property"),
      actionType: t("Treaty"),
      documentType: t("Power of attorney to receive salar"),
      objectType: t("Real estate"),
    },
    {
      id: 2,
      templateId: "01239",
      name: t("Movable property"),
      actionType: t("Treaty"),
      documentType: t(
        "Contract for the sale of an apartment (residential building) with the participation of a representative"
      ),
      objectType: t("Real estate"),
    },
    {
      id: 3,
      templateId: "01300",
      name: t("Movable property"),
      actionType: t("Decree"),
      documentType: t("Power of attorney to receive salary"),
      objectType: t("Salary"),
    },
    {
      id: 4,
      templateId: "01301",
      name: t("Movable property"),
      actionType: t("Treaty"),
      documentType: t(
        "Contract for the sale of an apartment (residential building) with the participation of a representative"
      ),
      objectType: t("Residential building"),
    },
    {
      id: 5,
      templateId: "01302",
      name: t("Movable property"),
      actionType: t("Treaty"),
      documentType: t("Power of attorney to receive salary"),
      objectType: t("Real estate"),
    },
    {
      id: 6,
      templateId: "01303",
      name: t("Movable property"),
      actionType: t("Treaty"),
      documentType: t(
        "Contract for the sale of an apartment (residential building) with the participation of a representative"
      ),
      objectType: t("Real estate"),
    },
    {
      id: 7,
      templateId: "01304",
      name: t("Movable property"),
      actionType: t("Treaty"),
      documentType: t(
        "Contract for the sale of an apartment (residential building) with the participation of a representative"
      ),
      objectType: t("Apartments"),
    },
    {
      id: 8,
      templateId: "01305",
      name: t("Movable property"),
      actionType: t("Bequest"),
      documentType: t(
        "Contract for the sale of an apartment (residential building) with the participation of a representative"
      ),
      objectType: t("Real estate"),
    },
    {
      id: 9,
      templateId: "01306",
      name: t("Movable property"),
      actionType: t("Treaty"),
      documentType: t(
        "Contract for the sale of an apartment (residential building) with the participation of a representative"
      ),
      objectType: t("Apartments"),
    },
  ];

  const dataGridStyles = {
    ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": { padding: "10px 16px" },
    ".MuiBox-root": { backgroundColor: "#FFF" },
    ".MuiDataGrid-columnHeader": { padding: "16px" },
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const filteredRows = rows.filter((row) => {
    const query = searchQuery.toLowerCase();

    return Object.values(row).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(query);
      } else if (Array.isArray(value)) {
        return value.some((item) => String(item).toLowerCase().includes(query));
      } else {
        return false;
      }
    });
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const onPageChange = (page: number) => {
    setSelectedPage(page);
  };

  return (
    <>
      <SearchBar onChange={handleSearchInputChange} value={searchQuery} />

      <SwitchLanguage defaultLanguage="Russian" languages={["Kyrgyz", "Russian"]} />

      <Box sx={{ height: "448px" }}>
        <GridTable
          rows={filteredRows}
          columns={columns}
          filterData={{
            data: {
              rows: [rows],
            },
            filterField: { field: "id", outputField: "name" },
          }}
          sx={dataGridStyles}
        />
      </Box>

      <Box alignSelf="center">
        <Pagination currentPage={selectedPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>
    </>
  );
}
