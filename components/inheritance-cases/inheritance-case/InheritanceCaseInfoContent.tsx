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
import { format, isValid } from "date-fns";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { IPartner } from "@/models/user";
import Pagination from "@/components/ui/Pagination";

interface IInheritanceCaseInfoContentProps {
  inheritanceCaseInfo?: any;
  loadingInheritanceCaseInfo?: any;
}

interface IQueryParams {
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

  const [queryParams, setQueryParams] = useState<IQueryParams>({
    pageSize: 7,
    page: 1,
    sortBy: ["-createdOn"],
    filterValues: {},
  });

  const { data: testatorInfo, loading: loadingTestatorInfo } = useFetch(
    inheritanceCaseInfo?.id ? "/api/inheritance-cases/testator/" + inheritanceCaseInfo?.id : "",
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
      title: "Unique number",
      value: inheritanceCaseInfo?.notaryUniqNumber ? inheritanceCaseInfo?.notaryUniqNumber : t("absent"),
    },
    {
      title: "Opening date",
      value: inheritanceCaseInfo?.createdOn
        ? format(new Date(inheritanceCaseInfo?.createdOn!), "dd.MM.yyyy HH:mm:ss")
        : t("absent"),
    },
    {
      title: "Created by",
      value: inheritanceCaseInfo?.company?.name ? inheritanceCaseInfo?.company?.name : t("absent"),
    },
  ].filter(Boolean);

  const testatorTitles = [
    {
      title: "PIN",
      value: testatorInfo?.data?.[0]?.requester?.[0]?.personalNumber
        ? testatorInfo?.data?.[0]?.requester?.[0]?.personalNumber
        : t("absent"),
    },
    {
      title: "Last name",
      value: testatorInfo?.data?.[0]?.requester?.[0]?.lastName
        ? testatorInfo?.data?.[0]?.requester?.[0]?.lastName
        : t("absent"),
    },
    {
      title: "Имя",
      value: testatorInfo?.data?.[0]?.requester?.[0]?.firstName
        ? testatorInfo?.data?.[0]?.requester?.[0]?.firstName
        : t("absent"),
    },
    {
      title: "Middle name",
      value: testatorInfo?.data?.[0]?.requester?.[0]?.middleName
        ? testatorInfo?.data?.[0]?.requester?.[0]?.middleName
        : t("absent"),
    },
    {
      title: "Date of birth",
      value: testatorInfo?.data?.[0]?.requester?.[0]?.birthDate
        ? testatorInfo?.data?.[0]?.requester?.[0]?.birthDate
        : t("absent"),
    },
    {
      title: "Date of death",
      value: testatorInfo?.data?.[0]?.requester?.[0]?.deathDate
        ? testatorInfo?.data?.[0]?.requester?.[0]?.deathDate
        : t("absent"),
    },
    {
      title: "Place of last residence",
      value: getAddressFullName(testatorInfo?.data?.[0]),
    },
    {
      title: "End date of inheritance",
      value: testatorInfo?.data?.[0]?.notaryInheritanceEndDate
        ? testatorInfo?.data?.[0]?.notaryInheritanceEndDate
        : "---",
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

        <ExpandingFields title="Will" permanentExpand={false}>
          {t("Will")}
        </ExpandingFields>

        <ExpandingFields title="Document" permanentExpand={false}>
          {t("Document")}
        </ExpandingFields>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "25px", mt: "30px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" color="success.main" pl="16px">
              {t("List of heirs")}
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
              {t("Create an heir")}
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
              headerName: "PIN",
              width: 180,
            },
            {
              field: "requester.fullName",
              headerName: "Fullname",
              width: 320,
            },
            {
              field: "requester.relationships.relationshipType",
              headerName: "Family relationships",
              width: 200,
            },
            {
              field: "createdOn",
              headerName: "Date of application",
              width: 280,
              valueGetter: (params: GridValueGetterParams) => {
                if (!params.value) return t("absent");
                const date = new Date(params.value);
                return isValid(date) ? format(date, "dd.MM.yyyy HH:mm") : t("absent");
              },
            },
            {
              field: "requester.mainAddress.fullName",
              headerName: "Address",
              width: 300,
            },
            {
              field: "requester.mobilePhone",
              headerName: "Phone number",
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
            onPageChange={(page: any) => console.log("page", page)}
            totalPages={calculateTotalPages()}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InheritanceCaseInfoContent;
