import { FC } from "react";

import { useTranslations } from "next-intl";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { Box, Typography } from "@mui/material";

import Button from "@/components/ui/Button";
import ApplicationStatusRead from "./ApplicationStatusRead";
import ApplicationStatusView from "./ApplicationStatusView";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";

interface IApplicationStatusInfoContentProps {
  id?: number;
}

const ApplicationStatusInfoContent: FC<IApplicationStatusInfoContentProps> = (props) => {
  const { id } = props;
  const t = useTranslations();

  const { data, update: getStatusInfo } = useFetch("", "POST");

  useEffectOnce(() => {
    if (id) {
      getStatusInfo(`/api/applications/${id}`);
    }
  }, [id]);

  return (
    <Box
      sx={{
        p: {
          xs: "10px",
          md: "40px",
        },
      }}
      display="flex"
      flexDirection="column"
      gap="40px"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          {t("InformationAboutStatusApplication")}
        </Typography>
        <Button
          variant="text"
          sx={{
            backgroundColor: "none",
            color: "#1BAA75",
            fontSize: "16px",
            width: "auto",
            ":hover": {
              backgroundColor: "transparent !important",
            },
          }}
          startIcon={<KeyboardBackspaceOutlinedIcon />}
        >
          {t("Back")}
        </Button>
      </Box>
      <ApplicationStatusRead data={data?.data[0]} />
      <ApplicationStatusView />
    </Box>
  );
};

export default ApplicationStatusInfoContent;
