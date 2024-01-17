import React, { useState } from "react";
import { useTranslations } from "next-intl";

import { Box, Typography, InputLabel } from "@mui/material";
import Grid from "@mui/material/Grid";
import ExcelIcon from "@/public/icons/excel.svg";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import { GridTable, IGridColDef } from "@/components/ui/GridTable";
import { IInheritanceCasesFilterForm } from "@/validator-schemas/inheritance-cases";
import { useForm } from "react-hook-form";
import FilterContent from "./filter-content";

export default function InheritanceCases() {
  const [selectedPage, setSelectedPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("All years");
  const [sortByYear, setSortByYear] = useState(false);

  const t = useTranslations();

  const columns: IGridColDef[] = [
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
      sortable: false,
      filter: {
        type: "simple",
      },
    },
    {
      field: "pin",
      headerName: "PIN of the deceased",
      width: 210,
      filter: {
        type: "simple",
      },
      sortable: false,
    },
    {
      field: "fullName",
      headerName: "Full name of the deceased",
      width: 270,
      filter: {
        type: "simple",
      },
      sortable: false,
    },
    {
      field: "dateOfBirth",
      headerName: "Date of birth",
      width: 180,
    },
    {
      field: "placeOfLastResidence",
      headerName: "Place of last residence",
      width: 270,
      sortable: false,
    },
    {
      field: "dateOfDeath",
      headerName: "Date of death",
      width: 200,
    },
    {
      field: "dateOfCreation",
      headerName: "Date of creation",
      width: 210,
    },
    {
      field: "whoCreated",
      headerName: "Created by",
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
    { value: `2023 ${t("year")}`, label: `2023 ${t("year")}` },
    { value: `2022 ${t("year")}`, label: `2022 ${t("year")}` },
    { value: `2021 ${t("year")}`, label: `2021 ${t("year")}` },
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

  const form = useForm<IInheritanceCasesFilterForm>();

  return (
    <>
      <Typography typography="h4" color="primary">
        {t("Register of inheritance cases")}
      </Typography>

      <FilterContent form={form} />

      <Box
        sx={{
          display: { xs: "none", sm: "none", md: "flex" },
          gap: "20px",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
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
            height: "43px",
            gap: "10px",
            padding: "14px 24px",
          }}
        >
          <Typography fontWeight={600} fontSize={14}>
            {t("Export to excel")}
          </Typography>
          <ExcelIcon />
        </Button>
      </Grid>
    </>
  );
}
