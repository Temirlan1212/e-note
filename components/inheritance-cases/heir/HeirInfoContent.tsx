import { FC } from "react";
import { useTranslations } from "next-intl";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { Box, CircularProgress, Typography } from "@mui/material";
import ExpandingFields from "@/components/fields/ExpandingFields";
import HeirInfo from "@/components/inheritance-cases/heir/info/HeirInfo";
import AdditionalInfo from "./info/AdditionalInfo";
import InheritanceCaseInfo from "./info/InheritanceCaseInfo";
import TestatorInfo from "./info/TestatorInfo";

interface IHeirInfoContentProps {
  heirId?: string | string[];
  inheritanceCaseId?: string | string[];
}

const HeirInfoContent: FC<IHeirInfoContentProps> = ({ heirId, inheritanceCaseId }) => {
  const t = useTranslations();

  const { data: heirInfo, loading: loadingHeirInfo } = useFetch(
    heirId != null ? "/api/inheritance-cases/heir/" + heirId : "",
    "POST"
  );

  const { data: inheritanceCaseInfo, loading: loadingInheritanceCaseInfo } = useFetch(
    inheritanceCaseId != null ? "/api/inheritance-cases/" + inheritanceCaseId : "",
    "POST"
  );

  const {
    data: testatorInfo,
    loading: loadingTestatorInfo,
    status,
  } = useFetch(
    inheritanceCaseInfo?.data?.[0]?.id ? "/api/inheritance-cases/testator/" + inheritanceCaseInfo?.data?.[0]?.id : "",
    "POST"
  );

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
      {loadingInheritanceCaseInfo ? (
        <CircularProgress />
      ) : (
        <InheritanceCaseInfo inheritanceCaseInfo={inheritanceCaseInfo?.data?.[0]} />
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        {loadingTestatorInfo ? <CircularProgress /> : <TestatorInfo testatorInfo={testatorInfo} />}

        <ExpandingFields title="Will" permanentExpand={false}>
          {t("Will")}
        </ExpandingFields>

        <ExpandingFields title="Document" permanentExpand={false}>
          {t("Document")}
        </ExpandingFields>
      </Box>
      {loadingHeirInfo ? <CircularProgress /> : <HeirInfo heirInfo={heirInfo} />}

      <ExpandingFields title="Additional information" permanentExpand={false}>
        <AdditionalInfo additionalInfo={heirInfo} />
      </ExpandingFields>
    </Box>
  );
};

export default HeirInfoContent;
