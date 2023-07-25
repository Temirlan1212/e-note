import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import Head from "next/head";

import { Box, Typography, Container, InputLabel } from "@mui/material";
import Grid from "@mui/material/Grid";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostAddIcon from "@mui/icons-material/PostAdd";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Pagination from "../ui/Pagination";
import SearchBar from "../ui/SearchBar";
import { GridTable } from "../ui/GridTable";

export default function BlackList() {
  const [selectedPage, setSelectedPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const t = useTranslations();

  const handleActionsPopupToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(anchorEl == null ? event.currentTarget : null);
  };

  const columns = [
    { field: "pin", headerName: "Subject PIN", width: 180 },
    { field: "fullName", headerName: "Subject full name", width: 320 },
    { field: "dateOfBirth", headerName: "Date of birth", width: 210 },
    { field: "entryDate", headerName: "Entry date", width: 180 },
    { field: "whoCreated", headerName: "Who created", width: 320 },
    {
      field: "reasonForBlacklisting",
      headerName: "Reason for blacklisting",
      type: "acitons",
      sortable: false,
      width: 340,
      renderCell: (params: any) => (
        <Grid sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <Typography fontSize={14} fontWeight={500}>
            {t(`${params.row.reasonForBlacklisting}`)}
          </Typography>

          <IconButton sx={{ visibility: anchorEl ? "visible" : "hidden" }} onClick={handleActionsPopupToggle}>
            <MoreVertIcon color="info" />
          </IconButton>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleActionsPopupToggle}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                boxShadow: "none",
              },
            }}
          >
            <Grid sx={{ padding: "16px 32px", height: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
              <Button sx={{ background: "#3F5984", padding: "13px 29px", "&:hover": { backgroundColor: "#3F5984" } }}>
                <Typography fontSize={14} fontWeight={600}>
                  {t("Редактировать")}
                </Typography>
              </Button>

              <Button sx={{ border: "1px dashed #CDCDCD", "&:hover": { backgroundColor: "inherit" } }} variant="text">
                <Typography color="success" fontSize={14} fontWeight={600}>
                  {t("Удалить")}
                </Typography>
              </Button>
            </Grid>
          </Popover>
        </Grid>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      pin: 20607199701071,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1977",
      entryDate: "01.01.2022",
      whoCreated: "ЧН Абдыгулов",
      reasonForBlacklisting: t("Incapacitated"),
    },
    {
      id: 2,
      pin: 20607199701099,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1966",
      entryDate: "02.01.2022",
      whoCreated: "ЧН Абдыгулов",
      reasonForBlacklisting: t("Fake passport"),
    },
    {
      id: 3,
      pin: 20607199701010,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1976",
      entryDate: "03.01.2022",
      whoCreated: "ЧН Абдыгулов",
      reasonForBlacklisting: t("In the lists of Financial Intelligence"),
    },
    {
      id: 4,
      pin: 20607192701022,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1969",
      entryDate: "04.01.2022",
      whoCreated: "ЧН Абдыгулов",
      reasonForBlacklisting: t("Against the law"),
    },
    {
      id: 5,
      pin: 20607199701033,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1986",
      entryDate: "05.01.2022",
      whoCreated: "ЧН Абдыгулов",
      reasonForBlacklisting: t("Fake passport"),
    },
    {
      id: 6,
      pin: 20603199701079,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1996",
      entryDate: "06.01.2022",
      whoCreated: "ЧН Абдыгулов",
      reasonForBlacklisting: t("Mental deviation"),
    },
    {
      id: 7,
      pin: 11107199701079,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1995",
      entryDate: "07.01.2022",
      whoCreated: "ЧН Абдыгулов",
      reasonForBlacklisting: t("Fake passport"),
    },
    {
      id: 8,
      pin: 20222199701079,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1999",
      entryDate: "08.01.2022",
      whoCreated: "ЧН Абдыгулов",
      reasonForBlacklisting: t("Mental deviation"),
    },
    {
      id: 9,
      pin: 20607199711079,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1988",
      entryDate: "09.01.2022",
      whoCreated: "ЧН Абдыгулов",
      reasonForBlacklisting: t("Fake passport"),
    },
  ];

  const dataGridStyles = {
    ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": { padding: "10px 16px" },
    ".MuiBox-root": { backgroundColor: "#FFF" },
    ".MuiDataGrid-columnHeader": { padding: "16px" },
  };

  const itemsPerPage = 6;
  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const onPageChange = (page: number) => {
    setSelectedPage(page);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredRows = rows.filter((row) => {
    const query = searchQuery.toLowerCase();

    if (String(row.pin).toLowerCase().includes(query)) {
      return true;
    }

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

  return (
    <>
      <Head>
        <title>{t("Black list")}</title>
      </Head>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          padding: { xs: "30px 20px 31px 20px", sm: "30px 20px 57px 20px", md: "60px 60px 198px 60px" },
          maxWidth: { xs: "unset", sm: "unset", md: "unset", lg: "usnet" },
        }}
      >
        <Grid
          container
          spacing={{ xs: 2.5, sm: 3.75, md: 3.75 }}
          justifyContent="space-between"
          sx={{
            display: { xs: "flex", sm: "flex" },
            flexDirection: { xs: "column-reverse", sm: "column", md: "unset" },
            alignItems: { xs: "unset", sm: "flex-end", md: "unset" },
          }}
        >
          <Grid item xs={12} sm={12} md={9} sx={{ alignSelf: "stretch" }}>
            <SearchBar onChange={handleSearchInputChange} value={searchQuery} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="success"
              sx={{
                height: "56px",
                gap: "8px",
                padding: "13px 22px",
              }}
              fullWidth
            >
              <PostAddIcon />
              <Typography fontWeight={600}>{t("Enter subject")}</Typography>
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 2.5, sm: 2.5, md: 5 }}>
          <Grid item xs={12} sm={12} md={4}>
            <InputLabel htmlFor="input-reason" sx={{ fontSize: "14px", fontWeight: "500" }}>
              {t("Reason")}
            </InputLabel>
            <Input placeholder={t("Enter a reason")} variant="outlined" name="input-reason" fullWidth />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <InputLabel htmlFor="input-pin" sx={{ fontSize: "14px", fontWeight: "500" }}>
              {t("Subject PIN")}
            </InputLabel>
            <Input placeholder={t("Enter PIN")} variant="outlined" name="input-pin" fullWidth />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <InputLabel htmlFor="input-full-name" sx={{ fontSize: "14px", fontWeight: "500" }}>
              {t("Subject full name")}
            </InputLabel>
            <Input placeholder={t("Enter full name")} variant="outlined" name="input-full-name" fullWidth />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Box
            sx={{
              display: {
                xs: "flex",
                sm: "flex",
                md: "none",
                lg: "none",
              },
              justifyContent: "space-between",
            }}
          >
            <HelpOutlineOutlinedIcon color="success" />
            <Box
              sx={{
                display: "flex",
                gap: "10px",
              }}
            >
              <Button
                variant="text"
                sx={{ padding: "12px", border: "1px solid #EFEFEF", "&:hover": { color: "#FFF" } }}
              >
                <KeyboardArrowLeftOutlinedIcon />
              </Button>
              <Button
                variant="text"
                sx={{ padding: "12px", border: "1px solid #EFEFEF", "&:hover": { color: "#FFF" } }}
              >
                <KeyboardArrowRightOutlinedIcon />
              </Button>
            </Box>
          </Box>

          <Box sx={{ height: "448px" }}>
            <GridTable
              rows={filteredRows}
              columns={columns}
              filterData={{
                data: {
                  rows: [rows],
                },
                filterField: { field: "id" },
              }}
              sx={dataGridStyles}
            />
          </Box>
        </Box>

        <Box alignSelf="center">
          <Pagination currentPage={selectedPage} totalPages={totalPages} onPageChange={onPageChange} />
        </Box>
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/black-list.json`)).default,
      },
    },
  };
}
