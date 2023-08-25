import React, { FC, useState } from "react";

import { useTranslations } from "next-intl";

import { Box, Typography } from "@mui/material";

import Button from "../ui/Button";
import SearchBar from "../ui/SearchBar";
import { GridTable } from "../ui/GridTable";

import ExcelIcon from "@/public/icons/excel.svg";

interface IOMSUOfficialsContentProps {}

const OMSUOfficialsContent: FC<IOMSUOfficialsContentProps> = (props) => {
  const [selectedPage, setSelectedPage] = useState(1);

  const t = useTranslations();

  const columns = [
    { field: "fullName", headerName: "Full name", width: 280 },
    { field: "position", headerName: "Position", width: 280 },
    { field: "birthDate", headerName: "Date of birth", width: 140 },
    { field: "phoneNumber", headerName: "Phone number", width: 160 },
    { field: "email", headerName: "E-mail", width: 180 },
    { field: "institution", headerName: "Institution", width: 180 },
    { field: "order", headerName: "Order", width: 200 },
    { field: "criminalRecord", headerName: "Criminal record", width: 200 },
  ];

  const rows = [
    {
      id: 1,
      fullName: "Чалбеков Анарбек Ибраимович",
      position: "Сотрудник Консульства",
      birthDate: "01.01.2022",
      phoneNumber: "0555 26 29 30",
      email: "turat@gmail.com",
      institution: "Доверенность",
      order: "",
      criminalRecord: "",
    },
    {
      id: 2,
      fullName: "Чалбеков Анарбек Ибраимович",
      position: "Сотрудник Консульства",
      birthDate: "01.01.2022",
      phoneNumber: "0555 26 29 30",
      email: "turat@gmail.com",
      institution: "Доверенность",
      order: "",
      criminalRecord: "",
    },
    {
      id: 3,
      fullName: "Чалбеков Анарбек Ибраимович",
      position: "Сотрудник Консульства",
      birthDate: "01.01.2022",
      phoneNumber: "0555 26 29 30",
      email: "turat@gmail.com",
      institution: "Доверенность",
      order: "",
      criminalRecord: "",
    },
    {
      id: 4,
      fullName: "Чалбеков Анарбек Ибраимович",
      position: "Сотрудник Консульства",
      birthDate: "01.01.2022",
      phoneNumber: "0555 26 29 30",
      email: "turat@gmail.com",
      institution: "Доверенность",
      order: "",
      criminalRecord: "",
    },
    {
      id: 5,
      fullName: "Чалбеков Анарбек Ибраимович",
      position: "Сотрудник Консульства",
      birthDate: "01.01.2022",
      phoneNumber: "0555 26 29 30",
      email: "turat@gmail.com",
      institution: "Доверенность",
      order: "",
      criminalRecord: "",
    },
    {
      id: 6,
      fullName: "Чалбеков Анарбек Ибраимович",
      position: "Сотрудник Консульства",
      birthDate: "01.01.2022",
      phoneNumber: "0555 26 29 30",
      email: "turat@gmail.com",
      institution: "Доверенность",
      order: "",
      criminalRecord: "",
    },
  ];

  const dataGridStyles = {
    ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": { padding: "10px 16px" },
    ".MuiDataGrid-row": { "&:hover": { "& .MuiIconButton-root": { visibility: "visible" } } },
    ".MuiBox-root": { backgroundColor: "#FFF" },
    ".MuiDataGrid-columnHeader": { padding: "16px" },
  };

  const itemsPerPage = 6;

  const totalPages = Math.ceil(rows.length / itemsPerPage);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Typography typography="h4" color="primary">
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
          placeholder={t("Search")}
        />
        <Button
          variant="outlined"
          color="primary"
          sx={{
            height: "auto",
            gap: "10px",
            padding: "10px 22px",
            fontSize: "14px",
            width: { md: "30%", xs: "100%" },
            "&:hover": { color: "#F6F6F6" },
          }}
          fullWidth
          endIcon={<ExcelIcon />}
        >
          {t("Export to excel")}
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box>
          <GridTable rows={rows} columns={columns} sx={dataGridStyles} />
        </Box>
      </Box>
    </Box>
  );
};

export default OMSUOfficialsContent;
