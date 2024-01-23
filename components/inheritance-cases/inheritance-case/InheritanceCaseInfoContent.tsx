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

interface IInheritanceCaseInfoContentProps {
  id?: string | string[];
}

const InheritanceCaseInfoContent: FC<IInheritanceCaseInfoContentProps> = ({ id }) => {
  const t = useTranslations();

  console.log(id, "ID");

  const theme = useTheme();

  const InheritanceCasetitles = [
    { title: "Номер", value: "пусто" },
    { title: "Дата открытия", value: "пусто" },
    { title: "Кем создан", value: "пусто" },
  ].filter(Boolean);

  const testatorTitles = [
    { title: "ПИН", value: "пусто" },
    { title: "Фамилия", value: "пусто" },
    { title: "Имя", value: "пусто" },
    { title: "Отчество", value: "пусто" },
    { title: "Дата рождения", value: "пусто" },
    { title: "Дата смерти", value: "пусто" },
    { title: "Место последнего проживания", value: "пусто" },
    { title: "Дата окончания наслед. дела", value: "---" },
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
      <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        <Typography variant="h4" color="success.main" pl="16px">
          {t("Наследственное дело")}
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
              {InheritanceCasetitles.map((el, idx) => {
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
              onClick={() => {}}
            >
              {t("Edit")}
            </Button>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        <Typography variant="h4" pl="16px">
          {t("Информация о наследнике")}
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
              {testatorTitles.map((el, idx) => {
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

        <ExpandingFields title="Завещание" permanentExpand={false}>
          Exp 1
        </ExpandingFields>

        <ExpandingFields title="Документы" permanentExpand={false}>
          Exp 2
        </ExpandingFields>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "25px", mt: "30px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" color="success.main" pl="16px">
              {t("Наследственное дело")}
            </Typography>
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
              {t("Создать наследника")}
            </Button>
          </Box>

          <Box
            sx={{
              marginBottom: "20px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <SearchBar
              // value={searchValue}
              // onChange={handleSearchChange}
              // onClick={handleSearchSubmit}
              InputProps={{
                endAdornment: (
                  <IconButton sx={{ visibility: "visible" }}>
                    <ClearIcon />
                  </IconButton>
                ),
              }}
            />

            <Button
              component="label"
              endIcon={<ExcelIcon />}
              color="primary"
              variant="outlined"
              sx={{
                gap: "10px",
                width: {
                  sx: "100%",
                  md: "320px",
                },
                padding: "10px 0",
                "&:hover": { color: "#F6F6F6" },
              }}
            >
              {t("Export to excel")}
            </Button>
          </Box>
        </Box>
        <GridTable
          columns={[
            {
              field: "description",
              headerName: "ПИН",
              width: 190,
              sortable: false,
              cellClassName: "descriptionColumn",
              valueGetter: (params: GridValueGetterParams) => {
                return params.value || t("absent");
              },
            },
            {
              field: "description",
              headerName: "ФИО",
              width: 190,
              sortable: false,
              cellClassName: "descriptionColumn",
              valueGetter: (params: GridValueGetterParams) => {
                return params.value || t("absent");
              },
            },
            {
              field: "description",
              headerName: "Родственные отношения",
              width: 190,
              sortable: false,
              cellClassName: "descriptionColumn",
              valueGetter: (params: GridValueGetterParams) => {
                return params.value || t("absent");
              },
            },
            {
              field: "description",
              headerName: "Дата заявления",
              width: 190,
              sortable: false,
              cellClassName: "descriptionColumn",
              valueGetter: (params: GridValueGetterParams) => {
                return params.value || t("absent");
              },
            },
            {
              field: "description",
              headerName: "Адрес",
              width: 190,
              sortable: false,
              cellClassName: "descriptionColumn",
              valueGetter: (params: GridValueGetterParams) => {
                return params.value || t("absent");
              },
            },
            {
              field: "description",
              headerName: "Номер моб. телефона",
              width: 190,
              sortable: false,
              cellClassName: "descriptionColumn",
              valueGetter: (params: GridValueGetterParams) => {
                return params.value || t("absent");
              },
            },
          ]}
          rows={[]}
          // onFilterSubmit={handleFilterSubmit}
          // onSortModelChange={handleSortByDate}
          cellMaxHeight="200px"
          // loading={loading || searchLoading}
          sx={{
            height: "100%",
            ".executorColumn": {
              color: "success.main",
            },
            ".descriptionColumn .MuiDataGrid-cellContent, .requestersColumn .MuiDataGrid-cellContent, .membersColumn .MuiDataGrid-cellContent":
              {
                display: "-webkit-box !important",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical !important",
                overflow: "hidden !important",
              },
          }}
          rowHeight={65}
          autoHeight
          props={{ wrapper: { height: `${100 * 1}px` } }}
        />
      </Box>
    </Box>
  );
};

export default InheritanceCaseInfoContent;
