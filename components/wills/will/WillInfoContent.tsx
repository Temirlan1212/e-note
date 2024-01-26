import { FC } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { Box, CircularProgress } from "@mui/material";
import ExpandingFields from "@/components/fields/ExpandingFields";
import WillInfo from "@/components/wills/will/info/WillInfo";
import TestatorInfo from "@/components/wills/will/info/TestatorInfo";
import ApplicationStatusInfoContent from "@/components/applications/status/ApplicationStatusInfoContent";
import { IApplication } from "@/models/application";
import Button from "@/components/ui/Button";
import Hint from "@/components/ui/Hint";

interface IWillInfoContentProps {
  willInfo: IApplication;
}

const WillInfoContent: FC<IWillInfoContentProps> = ({ willInfo }) => {
  const t = useTranslations();
  const router = useRouter();

  const { data: testatorInfo, loading: loadingTestatorInfo } = useFetch<FetchResponseBody | null>(
    willInfo?.id ? "/api/wills/testator/" + willInfo?.id : "",
    "POST"
  );

  const handleRevokeWill = () => {
    router.push(`/applications/create`);
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
      <WillInfo willInfo={willInfo} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        {loadingTestatorInfo ? <CircularProgress /> : <TestatorInfo testatorInfo={testatorInfo} />}

        <ExpandingFields title="Will" permanentExpand={false}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "flex-end",
              px: { xs: "10px", md: "40px" },
              gap: "15px",
              mb: "20px",
            }}
          >
            <Hint type="hint" defaultActive={false}>
              {t("When a will is revoked, a 'Statement of Revocation of Will' must be made")}
            </Hint>
            <Box sx={{ height: "40px" }}>
              <Button sx={{ width: "300px" }} onClick={handleRevokeWill}>
                {t("Revoke the will")}
              </Button>
            </Box>
          </Box>
          <ApplicationStatusInfoContent id={willInfo?.id} isWill={true} />
        </ExpandingFields>
      </Box>
    </Box>
  );
};

export default WillInfoContent;
