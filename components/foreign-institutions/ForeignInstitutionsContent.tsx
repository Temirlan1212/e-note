import React, { FC, useState } from "react";

import { useTranslations } from "next-intl";

import { Box, Tooltip, IconButton } from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import ExcelIcon from "@/public/icons/excel.svg";
import Button from "../ui/Button";
import SearchBar from "../ui/SearchBar";
import { GridTable } from "../ui/GridTable";

interface IForeignInstitutionsContentProps {}

const ForeignInstitutionsContent: FC<IForeignInstitutionsContentProps> = (props) => {
  const [selectedPage, setSelectedPage] = useState(1);

  const t = useTranslations();

  const columns = [
    { field: "fullName", headerName: "User's full name", width: 280 },
    { field: "userRole", headerName: "User role", width: 160 },
    { field: "login", headerName: "Login", width: 140 },
    { field: "pin", headerName: "PIN", width: 160 },
    { field: "phoneNumber", headerName: "Phone Number", width: 160 },
    { field: "email", headerName: "E-mail", width: 220 },
    { field: "registerDate", headerName: "Date and time of registration", width: 180 },
    { field: "whoRegister", headerName: "Registered by whom", width: 200 },
    {
      field: "actions",
      headerName: "Action",
      type: "acitons",
      sortable: false,
      width: 120,
      renderCell: (params: any) => (
        <Box
          sx={{
            background: "transparent !important",
          }}
        >
          <Tooltip title={t("Password Reset")}>
            <IconButton
              sx={{
                "&:hover, &.Mui-focusVisible": { color: "#1BAA75" },
              }}
            >
              <RefreshRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("Delete a user")}>
            <IconButton
              sx={{
                "&:hover, &.Mui-focusVisible": { color: "#1BAA75" },
              }}
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      pin: 20102199000001,
      fullName: "Чалбеков Анарбек Ибраимович",
      userRole: "Пользователь",
      login: "nuramir",
      phoneNumber: "0555 26 29 30",
      email: "nuramir@example.org",
      registerDate: "01.01.2022 00:00:00",
      whoRegister: "nuramir@example.org",
    },
    {
      id: 2,
      pin: 20102199000001,
      fullName: "Чалбеков Анарбек Ибраимович",
      userRole: "Пользователь",
      login: "nuramir",
      phoneNumber: "0555 26 29 30",
      email: "nuramir@example.org",
      registerDate: "01.01.2022 00:00:00",
      whoRegister: "nuramir@example.org",
    },
    {
      id: 3,
      pin: 20102199000001,
      fullName: "Чалбеков Анарбек Ибраимович",
      userRole: "Пользователь",
      login: "nuramir",
      phoneNumber: "0555 26 29 30",
      email: "nuramir@example.org",
      registerDate: "01.01.2022 00:00:00",
      whoRegister: "nuramir@example.org",
    },
    {
      id: 4,
      pin: 20102199000001,
      fullName: "Чалбеков Анарбек Ибраимович",
      userRole: "Пользователь",
      login: "nuramir",
      phoneNumber: "0555 26 29 30",
      email: "nuramir@example.org",
      registerDate: "01.01.2022 00:00:00",
      whoRegister: "nuramir@example.org",
    },
    {
      id: 5,
      pin: 20102199000001,
      fullName: "Чалбеков Анарбек Ибраимович",
      userRole: "Пользователь",
      login: "nuramir",
      phoneNumber: "0555 26 29 30",
      email: "nuramir@example.org",
      registerDate: "01.01.2022 00:00:00",
      whoRegister: "nuramir@example.org",
    },
    {
      id: 6,
      pin: 20102199000001,
      fullName: "Чалбеков Анарбек Ибраимович",
      userRole: "Пользователь",
      login: "nuramir",
      phoneNumber: "0555 26 29 30",
      email: "nuramir@example.org",
      registerDate: "01.01.2022 00:00:00",
      whoRegister: "nuramir@example.org",
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

  const onPageChange = (page: number) => {
    setSelectedPage(page);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
      }}
    >
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
          sx={{
            ":hover": {
              //   background: "#fff !important"
            },
            display: {
              xs: "none",
              md: "flex",
            },
            width: {
              xs: "100%",
              md: "20%",
            },
            padding: "13px 10px",
          }}
          color="primary"
          variant="outlined"
          endIcon={<ExcelIcon />}
        >
          {t("Export to Excel")}
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

export default ForeignInstitutionsContent;
