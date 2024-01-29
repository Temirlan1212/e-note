import { FC } from "react";
import { useTranslations } from "next-intl";
import useFetch from "@/hooks/useFetch";
import { Box, CircularProgress } from "@mui/material";
import ExpandingFields from "@/components/fields/ExpandingFields";
import InheritanceCaseInfo from "@/components/inheritance-cases/inheritance-case/info/InheritanceCaseInfo";
import TestatorInfo from "@/components/inheritance-cases/inheritance-case/info/TestatorInfo";
import HeirsList from "@/components/inheritance-cases/heirs-list/HeirsList";
import { FetchListParamsContextProvider } from "@/contexts/fetch-list-params";
import { IApplication } from "@/models/application";

interface IInheritanceCaseInfoContentProps {
  inheritanceCaseInfo?: IApplication;
  loadingInheritanceCaseInfo?: boolean;
}

const InheritanceCaseInfoContent: FC<IInheritanceCaseInfoContentProps> = ({
  inheritanceCaseInfo,
  loadingInheritanceCaseInfo,
}) => {
  const t = useTranslations();

  const {
    data: testatorInfo,
    loading: loadingTestatorInfo,
    status,
  } = useFetch(inheritanceCaseInfo?.id ? "/api/inheritance-cases/testator/" + inheritanceCaseInfo?.id : "", "POST");

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
        <InheritanceCaseInfo inheritanceCaseInfo={inheritanceCaseInfo} />
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

      <FetchListParamsContextProvider>
        <HeirsList parentRequestStatus={status} />
      </FetchListParamsContextProvider>
    </Box>
  );
};

export default InheritanceCaseInfoContent;
