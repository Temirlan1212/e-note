import { Alert, Avatar, Box, CircularProgress, Collapse, Typography, List, ListItem, IconButton } from "@mui/material";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Rating from "@/components/ui/Rating";
import Link from "@/components/ui/Link";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LicenseIcon from "@/public/icons/license.svg";
import ContentPlusIcon from "@/public/icons/content-plus.svg";
import CloudMessageIcon from "@/public/icons/cloud-message.svg";
import { useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";
import ExpandingFields from "@/components/fields/ExpandingFields";
import SearchBar from "@/components/ui/SearchBar";
import ClearIcon from "@mui/icons-material/Clear";
import ExcelIcon from "@/public/icons/excel.svg";
import { GridValueGetterParams } from "@mui/x-data-grid";
import { GridTable } from "@/components/ui/GridTable";
import { FC } from "react";
import InheritanceCasesTable from "../inheritance-cases-table/InheritanceCasesTable";
import SearchBarForm from "../filter-content/search-bar-form/SearchBarForm";
import { IInheritanceCasesSearchBarForm } from "@/validator-schemas/inheritance-cases";
import { useForm } from "react-hook-form";
import InheritanceCaseInfo from "./info/InheritanceCaseInfo";
import TestatorInfo from "./info/TestatorInfo";
import HeirInfo from "./info/HeirInfo";

interface IInheritanceCaseInfoContentProps {
  id?: string | string[];
}

const InheritanceCaseInfoContent: FC<IInheritanceCaseInfoContentProps> = ({ id }) => {
  const t = useTranslations();

  const theme = useTheme();

  const searchBarForm = useForm<IInheritanceCasesSearchBarForm>();

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

  const inheritanceCasetitles = [
    { title: "Номер", value: "пусто" },
    { title: "Дата открытия", value: "пусто" },
    { title: "Кем создан", value: "пусто" },
  ].filter(Boolean);

  const testatorTitles = [
    { title: "ПИН", value: "пусто" },
    { title: "Фамилия", value: "пусто" },
    { title: "Имя", value: "пусто" },
    { title: "Отчество", value: "пусто" },
    { title: "Дата рождения", value: "пусто" },
    { title: "Дата смерти", value: "пусто" },
    { title: "Место последнего проживания", value: "пусто" },
    { title: "Дата окончания наслед. дела", value: "---" },
  ].filter(Boolean);

  const heirTitles = [
    { title: "ПИН", value: "пусто" },
    { title: "Фамилия", value: "пусто" },
    { title: "Имя", value: "пусто" },
    { title: "Отчество", value: "пусто" },
  ].filter(Boolean);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: {
          xs: "center",
          md: "space-between",
        },
        flexDirection: "column",
        gap: "35px",
      }}
    >
      <InheritanceCaseInfo titles={inheritanceCasetitles} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        <TestatorInfo titles={testatorTitles} />

        <ExpandingFields title="Завещание" permanentExpand={false}>
          Завещание
        </ExpandingFields>

        <ExpandingFields title="Документы" permanentExpand={false}>
          Документы
        </ExpandingFields>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "25px", mt: "30px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" color="success.main" pl="16px">
              {t("Список наследников")}
            </Typography>
            <Button
              onClick={() => {}}
              color="success"
              sx={{
                width: {
                  sx: "100%",
                  md: "320px",
                },
                padding: "10px 0",
              }}
            >
              {t("Создать наследника")}
            </Button>
          </Box>

          <SearchBarForm form={searchBarForm} />
        </Box>
        <InheritanceCasesTable
          rows={rows}
          cellMaxHeight="200px"
          rowHeight={65}
          autoHeight
          props={{ wrapper: { height: `${100 * rows?.length ?? 1}px` } }}
        />
      </Box>
    </Box>
  );
};

export default InheritanceCaseInfoContent;
