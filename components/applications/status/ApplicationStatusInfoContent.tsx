import { FC } from "react";

import { useTranslations } from "next-intl";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { Box, Typography } from "@mui/material";

import Button from "@/components/ui/Button";
import ApplicationStatusRead from "./ApplicationStatusRead";
import ApplicationStatusView from "./ApplicationStatusView";

interface IApplicationStatusInfoContentProps {}

const ApplicationStatusInfoContent: FC<IApplicationStatusInfoContentProps> = (props) => {
  const t = useTranslations();

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
      <ApplicationStatusRead />
      <ApplicationStatusView />
    </Box>
  );
};

export default ApplicationStatusInfoContent;
