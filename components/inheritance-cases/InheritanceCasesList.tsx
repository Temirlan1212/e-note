import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Typography } from "@mui/material";
import Pagination from "@/components/ui/Pagination";
import FilterContent from "./filter-content/FilterContent";
import InheritanceCasesTable from "./inheritance-cases-table/InheritanceCasesTable";
import { IInheritanceCasesFilterForm } from "@/validator-schemas/inheritance-cases";

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

export default function InheritanceCasesList() {
  const [selectedPage, setSelectedPage] = useState(1);
  const [formValues, setFormValues] = useState<IInheritanceCasesFilterForm>({});

  const t = useTranslations();

  const itemsPerPage = 6;
  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const onPageChange = (page: number) => {
    setSelectedPage(page);
  };

  const updatFormValues = (data: Record<string, any>) => {
    setFormValues((prev) => {
      return { ...prev, ...data };
    });
  };

  return (
    <>
      <Typography typography="h4" color="primary">
        {t("Register of inheritance cases")}
      </Typography>

      <FilterContent
        onSearchBarFormSubmit={updatFormValues}
        onFilterFormFieldsSubmit={updatFormValues}
        onFilterFormFieldsReset={updatFormValues}
      />

      <Box height="50dvh">
        <InheritanceCasesTable rows={rows} />
      </Box>

      <Box alignSelf="center">
        <Pagination currentPage={selectedPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>
    </>
  );
}
