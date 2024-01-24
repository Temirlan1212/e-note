import { Alert, Avatar, Box, CircularProgress, Collapse, Typography, List, ListItem, IconButton } from "@mui/material";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Rating from "@/components/ui/Rating";
import Link from "@/components/ui/Link";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LicenseIcon from "@/public/icons/license.svg";
import ContentPlusIcon from "@/public/icons/content-plus.svg";
import CloudMessageIcon from "@/public/icons/cloud-message.svg";
import { useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";
import ExpandingFields from "@/components/fields/ExpandingFields";
import SearchBar from "@/components/ui/SearchBar";
import ClearIcon from "@mui/icons-material/Clear";
import ExcelIcon from "@/public/icons/excel.svg";
import { GridValueGetterParams } from "@mui/x-data-grid";
import { GridTable } from "@/components/ui/GridTable";
import { FC } from "react";
import { IInheritanceCasesListSearchBarForm } from "@/validator-schemas/inheritance-cases";
import { useForm } from "react-hook-form";

interface ITestatorInfoProps {
  titles?: any;
}

const TestatorInfo: FC<ITestatorInfoProps> = ({ titles }) => {
  const t = useTranslations();

  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <Typography variant="h4" pl="16px">
        {t("Информация о наследодателе")}
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
