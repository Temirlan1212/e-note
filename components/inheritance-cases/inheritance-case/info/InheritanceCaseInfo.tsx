import { FC } from "react";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { Box, Typography, List, ListItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IApplication } from "@/models/application";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";

interface IInheritanceCaseInfoProps {
  inheritanceCaseInfo?: IApplication;
}

const InheritanceCaseInfo: FC<IInheritanceCaseInfoProps> = ({ inheritanceCaseInfo }) => {
  const t = useTranslations();

  const router = useRouter();

  const theme = useTheme();

  const titles = [
    {
      title: "Number",
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

  const handlePrevClick = () => {
    router.push("/inheritance-cases");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" color="success.main" pl="16px">
          {t("Inheritance case")}
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
          onClick={handlePrevClick}
          startIcon={<KeyboardBackspaceOutlinedIcon />}
        >
          {t("Back")}
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: {
            xs: "center",
            md: "space-between",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "25px",
          }}
        >
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
            }}
          >
            {titles.map((el: any, idx: any) => {
              return (
                <ListItem
                  key={idx}
                  sx={{
                    gap: "10px",
                    display: "flex",
                    [theme.breakpoints.down("sm")]: {
                      flexDirection: "column",
                    },
                    alignItems: "start",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "600",
                      width: "100%",
                      minWidth: "260px",
                      maxWidth: { md: "280px", xs: "260px" },
                      [theme.breakpoints.down("sm")]: {
                        maxWidth: "unset",
                      },
                      wordBreak: "break-word",
                    }}
                  >
                    {t(el?.title)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "500",
                      width: "100%",
                      minWidth: "260px",
                      maxWidth: { md: "280px", xs: "260px" },
                      color: "#687C9B",
                      [theme.breakpoints.down("sm")]: {
                        maxWidth: "unset",
                      },
                      wordBreak: "break-all",
                    }}
                  >
                    {el?.value != null && el?.value !== "" ? el?.value : t("absent")}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "30px",
            marginTop: { xs: "30px", sm: "30px", md: "unset", lg: "unset" },
          }}
        >
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
            {t("Save")}
          </Button>
          <Button
            onClick={() => {}}
            buttonType="secondary"
            loading={false}
            sx={{
              width: {
                sx: "100%",
                md: "320px",
              },
              padding: "10px 0",
              ":hover": {
                backgroundColor: "#3F5984",
              },
            }}
          >
            {t("Edit")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InheritanceCaseInfo;
