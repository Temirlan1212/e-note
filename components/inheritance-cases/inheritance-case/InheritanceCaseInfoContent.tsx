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
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";
import ExpandingFields from "@/components/fields/ExpandingFields";
import SearchBar from "@/components/ui/SearchBar";
import ClearIcon from "@mui/icons-material/Clear";
import ExcelIcon from "@/public/icons/excel.svg";
import { GridValueGetterParams } from "@mui/x-data-grid";
import { GridTable } from "@/components/ui/GridTable";
import { FC, useEffect } from "react";
import HeirsTable from "@/components/inheritance-cases/inheritance-case/heirs-table/HeirsTable";
import SearchBarForm from "@/components/inheritance-cases/inheritance-cases-list.tsx/filter-content/search-bar-form/SearchBarForm";
import { IInheritanceCasesListSearchBarForm } from "@/validator-schemas/inheritance-cases";
import { useForm } from "react-hook-form";
import InheritanceCaseInfo from "./info/InheritanceCaseInfo";
import TestatorInfo from "./info/TestatorInfo";
import HeirInfo from "./info/HeirInfo";
import { format } from "date-fns";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { IPartner } from "@/models/user";

interface IInheritanceCaseInfoContentProps {
  inheritanceCaseInfo?: any;
  loadingInheritanceCaseInfo?: any;
}

const InheritanceCaseInfoContent: FC<IInheritanceCaseInfoContentProps> = ({
  inheritanceCaseInfo,
  loadingInheritanceCaseInfo,
}) => {
  const t = useTranslations();

  const locale = useLocale();

  const theme = useTheme();

  const searchBarForm = useForm<IInheritanceCasesListSearchBarForm>();

  const { data: testatorInfo, loading: loadingTestatorInfo } = useFetch(
    inheritanceCaseInfo?.requester?.[0]?.id
      ? "/api/inheritance-cases/testator/" + inheritanceCaseInfo?.requester?.[0]?.id
      : "",
    "POST"
  );

  const getAddressFullName = (data: IPartner) => {
    const { mainAddress } = data || {};
    const { region, district, city, addressL4, addressL3, addressL2 } = mainAddress || {};

    const key = locale !== "en" ? "$t:name" : "name";
    const fallbackKey = locale !== "en" ? "name" : "$t:name";
    const formatAddressPart = (part: any) => part?.[key] || part?.[fallbackKey] || "";

    const formattedRegion = formatAddressPart(region);
    const formattedDistrict = formatAddressPart(district);
    const formattedCity = formatAddressPart(city);

    const addressParts = [
      [formattedRegion, formattedDistrict, formattedCity].filter(Boolean).join(", "),
      [addressL4, addressL3, addressL2].filter(Boolean).join(" "),
    ];

    return addressParts.filter(Boolean).join(", ");
  };

  const inheritanceCasetitles = [
    {
      title: "Номер",
      value: inheritanceCaseInfo?.notaryUniqNumber ? inheritanceCaseInfo?.notaryUniqNumber : t("absent"),
    },
    {
      title: "Дата открытия",
      value: inheritanceCaseInfo?.createdOn
        ? format(new Date(inheritanceCaseInfo?.createdOn!), "dd.MM.yyyy HH:mm:ss")
        : t("absent"),
    },
    {
      title: "Кем создан",
      value: inheritanceCaseInfo?.company?.name ? inheritanceCaseInfo?.company?.name : t("absent"),
    },
  ].filter(Boolean);

  const testatorTitles = [
    {
      title: "ПИН",
      value: testatorInfo?.data?.[0]?.personalNumber ? testatorInfo?.data?.[0]?.personalNumber : t("absent"),
    },
    { title: "Фамилия", value: testatorInfo?.data?.[0]?.lastName ? testatorInfo?.data?.[0]?.lastName : t("absent") },
    { title: "Имя", value: testatorInfo?.data?.[0]?.firstName ? testatorInfo?.data?.[0]?.firstName : t("absent") },
    {
      title: "Отчество",
      value: testatorInfo?.data?.[0]?.middleName ? testatorInfo?.data?.[0]?.middleName : t("absent"),
    },
    {
      title: "Дата рождения",
      value: testatorInfo?.data?.[0]?.birthDate ? testatorInfo?.data?.[0]?.birthDate : t("absent"),
    },
    {
      title: "Дата смерти",
      value: testatorInfo?.data?.[0]?.deathDate ? testatorInfo?.data?.[0]?.deathDate : t("absent"),
    },
    {
      title: "Место последнего проживания",
      value: getAddressFullName(testatorInfo?.data?.[0]),
    },
    {
      title: "Дата окончания наслед. дела",
      value: testatorInfo?.data?.[0]?.lastName ? testatorInfo?.data?.[0]?.personalNumber : "---",
    },
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
      {loadingInheritanceCaseInfo ? <CircularProgress /> : <InheritanceCaseInfo titles={inheritanceCasetitles} />}

      <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        {loadingTestatorInfo ? <CircularProgress /> : <TestatorInfo titles={testatorTitles} />}

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
        {/* <GridTable
        columns={[
          {
            field: "QR",
            headerName: "QR",
            width: 70,
            sortable: false,
            renderCell: (params: any) => <ApplicationListQRMenu params={params} />,
          },
          {
            field: "notaryUniqNumber",
            headerName: "Unique number",
            width: 200,
            sortable: isSearchedData ? false : true,
            valueGetter: (params: GridValueGetterParams) => {
              return params.row?.notaryUniqNumber || t("not assigned");
            },
          },
          {
            field: "requester",
            headerName: "Requested persons-1",
            width: 200,
            sortable: false,
            cellClassName: "requestersColumn",
            valueGetter: (params: GridValueGetterParams) => {
              const requesters = params.value.map((requester: any) => requester.fullName).join(", ");
              return isSearchedData ? params.row?.requester?.[0]?.fullName : requesters || t("not assigned");
            },
          },
          {
            field: "members",
            headerName: "Requested persons-2",
            width: 200,
            sortable: false,
            cellClassName: "membersColumn",
            valueGetter: (params: GridValueGetterParams) => {
              const members = params.value.map((member: any) => member.fullName).join(", ");
              return isSearchedData ? params.row?.member?.[0]?.fullName : members || t("not assigned");
            },
          },
          // {
          //   field: "typeNotarialAction",
          //   headerName: "Type of action",
          //   width: 200,
          //   editable: false,
          //   sortable: false,
          //   filter: isSearchedData
          //     ? undefined
          //     : {
          //         data: actionTypeData?.data ?? [],
          //         labelField: "title_" + locale,
          //         valueField: "value",
          //         type: "dictionary",
          //         field: "typeNotarialAction",
          //       },
          //   valueGetter: (params: GridValueGetterParams) => {
          //     if (actionTypeData?.data != null) {
          //       const matchedItem = actionTypeData?.data.find(
          //         (item: IActionType) => item.value == (isSearchedData ? params.row.typeNotarialAction : params.value)
          //       );
          //       const translatedTitle = matchedItem?.[("title_" + locale) as keyof IActionType];
          //       return !!translatedTitle ? translatedTitle : matchedItem?.["title" as keyof IActionType] ?? "";
          //     }
          //     return params.value;
          //   },
          // },
          {
            field: "productName",
            headerName: "Type of document",
            width: 250,
            editable: false,
            sortable: false,
            filter: isSearchedData
              ? undefined
              : {
                  data: documentTypeData?.data.filter((item: any) => item.isSystem === true) ?? [],
                  labelField: locale !== "en" ? "$t:name" : "name",
                  valueField: "id",
                  type: "dictionary",
                  field: "product.id",
                },
            valueGetter: (params: GridValueGetterParams) => {
              const nameKey = locale !== "en" ? "$t:name" : "name";
              const fullNameKey = locale !== "en" ? "$t:fullName" : "fullName";
              return isSearchedData
                ? params.row?.product?.[fullNameKey]
                : params.value?.[nameKey] || params.value?.["name"] || t("not assigned");
            },
          },
          {
            field: "statusSelect",
            headerName: "Status",
            description: "statusSelect",
            width: 200,
            editable: false,
            sortable: false,
            filter: isSearchedData
              ? undefined
              : {
                  data: statusData?.data ?? [],
                  labelField: "title_" + locale,
                  valueField: "value",
                  type: "dictionary",
                  field: "statusSelect",
                },
            valueGetter: (params: GridValueGetterParams) => {
              if (statusData != null) {
                const matchedItem = statusData?.data?.find((item: IStatus) => item.value == String(params.value));
                const translatedTitle = matchedItem?.[("title_" + locale) as keyof IActionType];
                return !!translatedTitle ? translatedTitle : matchedItem?.["title" as keyof IActionType] ?? "";
              }
              return params.value;
            },
          },
          {
            field: "createdOn",
            headerName: "Date of creation",
            width: 190,
            sortable: isSearchedData ? false : true,
            valueGetter: (params: GridValueGetterParams) => {
              if (!params.value) return t("absent");
              const date = new Date(params.value);
              return isValid(date) ? format(date, "dd.MM.yyyy HH:mm") : t("absent");
            },
          },
          {
            field: "notaryDocumentSignDate",
            headerName: "Date of signing",
            width: 190,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) => {
              if (!params.value) return t("absent");
              const date = new Date(params.value);
              return isValid(date) ? format(date, "dd.MM.yyyy HH:mm") : t("absent");
            },
          },
          {
            field: "description",
            headerName: "Description",
            width: 190,
            sortable: false,
            cellClassName: "descriptionColumn",
            valueGetter: (params: GridValueGetterParams) => {
              return params.value || t("absent");
            },
          },
          {
            field: "companyName",
            headerName: "Executor",
            width: 200,
            sortable: false,
            cellClassName: "executorColumn",
            valueGetter: (params: GridValueGetterParams) => {
              return isSearchedData ? params.row?.createdBy?.fullName : params.value || t("not assigned");
            },
          },
          {
            field: "actions",
            headerName: "Actions",
            headerClassName: "pinnable",
            width: isMobileMedia ? 250 : 350,
            sortable: false,
            type: isMobileMedia ? "actions" : "string",
            cellClassName: isMobileMedia ? "actions-pinnable" : "actions-on-hover",
            renderCell: (params) => (
              <ApplicationListActions
                params={params}
                onDelete={handleDelete}
                checkNotaryLicense={handleCheckLicenseDate}
                setAlertOpen={setAlertOpen}
              />
            ),
          },
        ]}
        rows={filteredData ?? []}
        onFilterSubmit={handleFilterSubmit}
        onSortModelChange={handleSortByDate}
        cellMaxHeight="200px"
        loading={loading || searchLoading}
        sx={{
          height: "100%",
          ".executorColumn": {
            color: "success.main",
          },
          ".descriptionColumn .MuiDataGrid-cellContent, .requestersColumn .MuiDataGrid-cellContent, .membersColumn .MuiDataGrid-cellContent":
            {
              display: "-webkit-box !important",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical !important",
              overflow: "hidden !important",
            },
        }}
        rowHeight={65}
        autoHeight
        props={{ wrapper: { height: `${100 * filteredData?.length ?? 1}px` } }}
      />
      */}
      </Box>
    </Box>
  );
};

export default InheritanceCaseInfoContent;
