import { Box, CircularProgress } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import ExpandingFields from "@/components/fields/ExpandingFields";
import { FC } from "react";
import InheritanceCaseInfo from "./info/InheritanceCaseInfo";
import TestatorInfo from "./info/TestatorInfo";
import { format } from "date-fns";
import useFetch from "@/hooks/useFetch";
import { IPartner } from "@/models/user";
import HeirsList from "../heirs-list/HeirsList";
import { FetchListParamsContextProvider } from "@/contexts/fetch-list-params";

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

  const { data: testatorInfo, loading: loadingTestatorInfo } = useFetch(
    inheritanceCaseInfo?.id ? "/api/inheritance-cases/testator/" + inheritanceCaseInfo?.id : "",
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
      </Box>

      <FetchListParamsContextProvider>
        <HeirsList />
      </FetchListParamsContextProvider>
    </Box>
  );
};

export default InheritanceCaseInfoContent;
