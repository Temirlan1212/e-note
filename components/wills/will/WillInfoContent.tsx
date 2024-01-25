import { Box, CircularProgress } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import ExpandingFields from "@/components/fields/ExpandingFields";
import { FC } from "react";
import WillInfo from "@/components/wills/will/info/WillInfo";
import TestatorInfo from "@/components/wills/will/info/TestatorInfo";
import { format } from "date-fns";
import useFetch from "@/hooks/useFetch";
import { IPartner } from "@/models/user";

interface IWillInfoContentProps {
  willInfo?: any;
}

const WillInfoContent: FC<IWillInfoContentProps> = ({ willInfo }) => {
  const t = useTranslations();

  const locale = useLocale();

  const { data: testatorInfo, loading: loadingTestatorInfo } = useFetch(
    willInfo?.id ? "/api/wills/testator/" + willInfo?.id : "",
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

  const willTitles = [
    {
      title: "Unique number",
      value: willInfo?.notaryUniqNumber ? willInfo?.notaryUniqNumber : t("absent"),
    },
    {
      title: "Opening date",
      value: willInfo?.createdOn ? format(new Date(willInfo?.createdOn!), "dd.MM.yyyy HH:mm:ss") : t("absent"),
    },
    {
      title: "Created by",
      value: willInfo?.company?.name ? willInfo?.company?.name : t("absent"),
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
      title: "Place of residence",
      value: getAddressFullName(testatorInfo?.data?.[0]),
    },
    {
      title: "Date of will",
      value: testatorInfo?.data?.[0]?.requester?.[0]?.willData
        ? testatorInfo?.data?.[0]?.requester?.[0]?.willData
        : t("absent"),
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
      <WillInfo titles={willTitles} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        {loadingTestatorInfo ? <CircularProgress /> : <TestatorInfo titles={testatorTitles} />}

        <ExpandingFields title="Will" permanentExpand={false}>
          {t("Will")}
        </ExpandingFields>
      </Box>
    </Box>
  );
};

export default WillInfoContent;
