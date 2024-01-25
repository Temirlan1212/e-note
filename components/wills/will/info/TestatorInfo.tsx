import { FC } from "react";
import { useTranslations } from "next-intl";
import { Avatar, Box, Typography, List, ListItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export interface InfoItem {
  title: string;
  value: string;
}

interface ITestatorInfoProps {
  titles: InfoItem[];
}

const TestatorInfo: FC<ITestatorInfoProps> = ({ titles }) => {
  console.log(titles);
  const t = useTranslations();

  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <Typography variant="h4" pl="16px">
        {t("Информация о завещателе")}
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
                      maxWidth: { xs: "100%", md: "280px" },
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
                      maxWidth: { xs: "100%", md: "380px" },
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
            gap: "30px",
            marginTop: { xs: "30px", sm: "30px", md: "unset", lg: "unset" },
            pr: "50px",
          }}
        >
          <Avatar
            sizes="194"
            sx={{
              bgcolor: "success.main",
              width: "194px",
              height: "194px",
              borderRadius: 0,
            }}
            aria-label="recipe"
            src={""}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TestatorInfo;
