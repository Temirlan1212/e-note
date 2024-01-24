import { Box, CircularProgress, Typography, Grid } from "@mui/material";
import Button from "@/components/ui/Button";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";
import ExpandingFields from "@/components/fields/ExpandingFields";
import SearchBar from "@/components/ui/SearchBar";
import { GridValueGetterParams } from "@mui/x-data-grid";
import { GridTable } from "@/components/ui/GridTable";
import { FC, useEffect, useState } from "react";
import { IInheritanceCasesListSearchBarForm } from "@/validator-schemas/inheritance-cases";
import { useForm } from "react-hook-form";
import InheritanceCaseInfo from "./info/InheritanceCaseInfo";
import TestatorInfo from "./info/TestatorInfo";
import { format } from "date-fns";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { IPartner } from "@/models/user";
import { useFilterValues } from "@/components/inheritance-cases/inheritance-cases-list.tsx/core/FilterValuesContext";
import Pagination from "@/components/ui/Pagination";

interface IInheritanceCaseInfoContentProps {
  inheritanceCaseInfo?: any;
  loadingInheritanceCaseInfo?: any;
}

interface IAppQueryParams {
  pageSize: number;
  page: number;
  sortBy: string[];
  filterValues: Record<string, (string | number)[]>;
}

const InheritanceCaseInfoContent: FC<IInheritanceCaseInfoContentProps> = ({
  inheritanceCaseInfo,
  loadingInheritanceCaseInfo,
}) => {
  const t = useTranslations();

  const locale = useLocale();

  const theme = useTheme();

  const searchBarForm = useForm<IInheritanceCasesListSearchBarForm>();

  const [filteredData, setFilteredData] = useState([]);

  const { updateQueryParams, queryParams } = useFilterValues();

  const { data: testatorInfo, loading: loadingTestatorInfo } = useFetch(
    inheritanceCaseInfo?.requester?.[0]?.id
      ? "/api/inheritance-cases/testator/" + inheritanceCaseInfo?.requester?.[0]?.id
      : "",
    "POST"
  );

  const {
    data: tableInfo,
    loading: tableInfoLoading,
    update: getTableInfo,
  } = useFetch<FetchResponseBody | null>(
    inheritanceCaseInfo?.id ? "/api/inheritance-cases/heirs-list/" + inheritanceCaseInfo?.id : "",
    "POST",
    {
      body: queryParams,
    }
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

  const total = tableInfo?.total || 1;

  const calculateTotalPages = () => {
    return Math.ceil(Number(total) / queryParams.pageSize);
  };

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
              <SearchBar name="keyWord" register={searchBarForm.register} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                color="success"
                type="button"
                sx={{
                  height: "auto",
                  gap: "10px",
                  fontSize: "14px",
                  padding: "10px 22px",
                  width: { xs: "100%" },
                  "&:hover": { color: "#F6F6F6" },
                }}
                fullWidth
              >
                {t("Export to excel")}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <GridTable
          columns={[
            {
              field: "requester.personalNumber",
              headerName: "ПИН",
              width: 280,
            },
            {
              field: "requester.fullName",
              headerName: "ФИО",
              width: 280,
            },
            {
              field: "requester.relationships.relationshipType",
              headerName: "Родственные отношения",
              width: 200,
            },
            {
              field: "createdOn",
              headerName: "Дата заявления",
              width: 220,
            },
            {
              field: "requester.mainAddress.fullName",
              headerName: "Адрес",
              width: 180,
            },
            {
              field: "requester.mobilePhone",
              headerName: "Номер моб. телефона",
              width: 180,
            },
          ]}
          sx={{
            height: "100%",
            ".notaryColumn": {
              color: "success.main",
            },
          }}
          rowHeight={65}
          cellMaxHeight="200px"
          loading={tableInfoLoading}
          rows={tableInfo?.data ?? []}
          // onFilterSubmit={handleFilterSubmit}
          // onSortModelChange={handleSortByDate}
        />
        <Box alignSelf="center">
          <Pagination
            sx={{ display: "flex", justifyContent: "center" }}
            currentPage={queryParams.page}
            onPageChange={(page: any) => updateQueryParams("page", page)}
            totalPages={calculateTotalPages()}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InheritanceCaseInfoContent;
