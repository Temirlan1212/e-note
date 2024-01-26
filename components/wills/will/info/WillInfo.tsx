import { FC } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, List, ListItem } from "@mui/material";
import { IApplication } from "@/models/application";
import { InfoItem } from "./TestatorInfo";

interface IWillInfoProps {
  willInfo: IApplication;
}

const WillInfo: FC<IWillInfoProps> = ({ willInfo }) => {
  const t = useTranslations();

  const theme = useTheme();

  const titles = [
    {
      title: "Number",
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <Typography variant="h4" color="success.main" pl="16px">
        {t("Завещание")}
      </Typography>
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
            {titles.map((el: InfoItem, idx: number) => {
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
      </Box>
    </Box>
  );
};

export default WillInfo;
