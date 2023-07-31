import React, { useState } from "react";
import { useTranslations } from "next-intl";

import { Box, Typography, InputLabel } from "@mui/material";
import Grid from "@mui/material/Grid";

import ExelIcon from "../../public/icons/exel.svg";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import Select from "../ui/Select";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Pagination from "../ui/Pagination";
import SearchBar from "../ui/SearchBar";
import { GridTable } from "../ui/GridTable";

export default function InheritanceCases() {
  const [selectedPage, setSelectedPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("All years");
  const [sortByYear, setSortByYear] = useState(false);

  const t = useTranslations();

  const columns = [
    {
      field: "QR",
      headerName: "QR",
      width: 90,
      sortable: false,
      renderCell: (params: any) => <QrCode2Icon />,
    },
    {
      field: "registryNumber",
      headerName: "Registry number",
      width: 210,
    },
    {
      field: "pin",
      headerName: t("PIN of the deceased"),
      width: 210,
      sortable: false,
    },
    {
      field: "fullName",
      headerName: t("Full name of the deceased"),
      width: 270,
    },
    {
      field: "dateOfBirth",
      headerName: t("Date of birth"),
      width: 180,
    },
    {
      field: "placeOfLastResidence",
      headerName: t("Place of last residence"),
      width: 270,
      sortable: false,
    },
    {
      field: "dateOfDeath",
      headerName: t("Date of death"),
      width: 200,
    },
    {
      field: "dateOfCreation",
      headerName: t("Date of creation"),
      width: 210,
    },
    {
      field: "whoCreated",
      headerName: t("Who created"),
      width: 200,
      sortable: false,
    },
  ];

  const rows = [
    {
      id: 1,
      registryNumber: "125-1511",
      pin: 20607199701071,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1977",
      placeOfLastResidence: "Кыргызстан, Таласская обл., село Арпачы, ул Бакыракай-Ата, ул 25",
      dateOfDeath: "02.08.2000",
      dateOfCreation: "01.01.2021",
      whoCreated: "ЧН Абдыгулов",
    },
    {
      id: 2,
      registryNumber: "125-1522",
      pin: 20607199701099,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1966",
      placeOfLastResidence: "Кыргызстан, Таласская обл., село Бакай, ул Бакыракай-Ата, ул 25",
      dateOfDeath: "02.08.2009",
      dateOfCreation: "01.01.2022",
      whoCreated: "ЧН Абдыгулов",
    },
    {
      id: 3,
      registryNumber: "125-1533",
      pin: 20607199701010,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1976",
      placeOfLastResidence: "Кыргызстан, Таласская обл., село Жусай, ул Бакыракай-Ата, ул 25",
      dateOfDeath: "12.08.2020",
      dateOfCreation: "01.01.2022",
      whoCreated: "ЧН Абдыгулов",
    },
    {
      id: 4,
      registryNumber: "125-1544",
      pin: 20607192701022,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1969",
      placeOfLastResidence: "Кыргызстан, Таласская обл., село Кишиш, ул Бакыракай-Ата, ул 25",
      dateOfDeath: "11.08.2017",
      dateOfCreation: "01.01.2022",
      whoCreated: "ЧН Абдыгулов",
    },
    {
      id: 5,
      registryNumber: "125-1555",
      pin: 20607199701033,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1986",
      placeOfLastResidence: "Кыргызстан, Таласская обл., село Чатыр, ул Бакыракай-Ата, ул 25",
      dateOfDeath: "02.11.2013",
      dateOfCreation: "01.01.2022",
      whoCreated: "ЧН Абдыгулов",
    },
    {
      id: 6,
      registryNumber: "125-1566",
      pin: 20603199701079,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1996",
      placeOfLastResidence: "Кыргызстан, Таласская обл., село Март, ул Бакыракай-Ата, ул 25",
      dateOfDeath: "09.08.2015",
      dateOfCreation: "01.01.2022",
      whoCreated: "ЧН Абдыгулов",
    },
    {
      id: 7,
      registryNumber: "125-1577",
      pin: 11107199701079,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1995",
      placeOfLastResidence: "Кыргызстан, Таласская обл., село Апрель, ул Бакыракай-Ата, ул 25",
      dateOfDeath: "02.08.2010",
      dateOfCreation: "01.01.2023",
      whoCreated: "ЧН Абдыгулов",
    },
    {
      id: 8,
      registryNumber: "125-1588",
      pin: 20222199701079,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "02.01.1966",
      placeOfLastResidence: "Кыргызстан, Таласская обл., село Арпачы, ул Бакыракай-Ата, ул 25",
      dateOfDeath: "05.02.2001",
      dateOfCreation: "01.01.2022",
      whoCreated: "ЧН Абдыгулов",
    },
    {
      id: 9,
      registryNumber: "125-1599",
      pin: 20607199711079,
      fullName: "Чалбеков Анарбек Ибраимович",
      dateOfBirth: "01.07.1970",
      placeOfLastResidence: "Кыргызстан, Таласская обл., село Арпачы, ул Бакыракай-Ата, ул 25",
      dateOfDeath: "09.09.1999",
      dateOfCreation: "01.01.2022",
      whoCreated: "ЧН Абдыгулов",
    },
  ];

  const selectSortData = [
    { value: "all", label: t("All years") },
    { value: `2023 ${t("год")}`, label: `2023 ${t("год")}` },
    { value: `2022 ${t("год")}`, label: `2022 ${t("год")}` },
    { value: `2021 ${t("год")}`, label: `2021 ${t("год")}` },
  ];

  const dataGridStyles = {
    ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": {
      padding: "10px 16px",
      whiteSpace: "normal",
    },
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

    if (sortByYear) {
      if (selectedYear === "all") {
        return true;
      }
      const selectedYearValue = parseInt(selectedYear);
      const dateOfCreationYear = parseInt(row.dateOfCreation.split(".")[2]);
      return dateOfCreationYear === selectedYearValue;
    }

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

  const handleSortByYear = (selectedValue: string) => {
    if (selectedValue === "all") {
      setSelectedYear("");
      setSortByYear(false);
    } else {
      setSelectedYear(selectedValue);
      setSortByYear(true);
    }
  };

  const toggleFilter = () => {
    setFilterVisible((prevValue) => !prevValue);
  };

  return (
    <>
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

        <Grid item xs={12} sm={6} md={3} sx={{ display: { xs: "none", sm: "none", md: "unset" } }}>
          <Button
            variant="outlined"
            color="success"
            sx={{
              height: "56px",
              gap: "10px",
              padding: "14px 24px",
              "&:hover": { color: "#F6F6F6" },
            }}
            fullWidth
          >
            <Typography fontWeight={600} fontSize={14}>
              {t("Export to excel")}
            </Typography>
            <ExelIcon />
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: "30px", alignItems: "center" }}>
        <Button
          variant="contained"
          sx={{
            gap: "10px",
            boxShadow: "0px 10px 20px 0px #99DBAF",
            width: { xs: "100%", sm: "100%", md: "243px" },
            padding: "10px 0",
          }}
          onClick={toggleFilter}
        >
          <FilterAltOffIcon />
          <Typography fontWeight={600} fontSize={16}>
            {filterVisible ? t("Collapse filter") : t("Expand filter")}
          </Typography>
        </Button>

        <Box sx={{ display: { xs: "none", sm: "none", md: "flex" }, gap: "20px", alignItems: "center" }}>
          <Typography fontSize={16} fontWeight={600}>
            {t("Sorting for")}:
          </Typography>
          <Select
            data={selectSortData}
            name="select-sort"
            defaultValue={selectedYear}
            selectType="primary"
            sx={{ width: "180px", height: "44px" }}
            fullWidth
            onChange={(event: React.ChangeEvent<{ value: unknown }>) => handleSortByYear(event.target.value as string)}
          />
        </Box>
      </Box>

      <Grid container spacing={{ xs: 2.5, sm: 2.5, md: 5 }} sx={{ display: filterVisible ? "flex" : "none" }}>
        <Grid item xs={12} sm={12} md={4}>
          <InputLabel htmlFor="input-number" sx={{ fontSize: "14px", fontWeight: "500", color: "#24334B" }}>
            {t("Registry number")}
          </InputLabel>
          <Input placeholder={t("Enter number")} variant="outlined" name="input-nubmer" fullWidth />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <InputLabel htmlFor="input-pin" sx={{ fontSize: "14px", fontWeight: "500", color: "#24334B" }}>
            {t("PIN of the deceased")}
          </InputLabel>
          <Input placeholder={t("Enter PIN")} variant="outlined" name="input-pin" fullWidth />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <InputLabel htmlFor="input-full-name" sx={{ fontSize: "14px", fontWeight: "500", color: "#24334B" }}>
            {t("Full name of the deceased")}
          </InputLabel>
          <Input placeholder={t("Enter full name")} variant="outlined" name="input-full-name" fullWidth />
        </Grid>
      </Grid>

      <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}>
        <InputLabel htmlFor="select-sort" sx={{ fontSize: "16px", fontWeight: "600", color: "#24334B" }}>
          <Typography fontSize={16} fontWeight={600}>
            {t("Sorting")}:
          </Typography>
        </InputLabel>
        <Select
          data={selectSortData}
          name="select-sort"
          defaultValue={selectedYear}
          selectType="primary"
          sx={{ height: "44px" }}
          fullWidth
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => handleSortByYear(event.target.value as string)}
        />
      </Box>

      <GridTable rows={filteredRows} columns={columns} sx={dataGridStyles} />

      <Box alignSelf="center">
        <Pagination currentPage={selectedPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>

      <Grid sx={{ display: { xs: "unset", sm: "unset", md: "none" }, width: "320px", alignSelf: "center" }}>
        <Button
          variant="outlined"
          color="success"
          sx={{
            height: "56px",
            gap: "10px",
            padding: "14px 24px",
          }}
        >
          <Typography fontWeight={600} fontSize={14}>
            {t("Export to excel")}
          </Typography>
          <ExelIcon />
        </Button>
      </Grid>
    </>
  );
}
