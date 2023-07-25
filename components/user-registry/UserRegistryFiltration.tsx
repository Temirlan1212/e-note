import { FC, useState } from "react";

import { useTranslations } from "next-intl";

import { format, parse } from "date-fns";
import { Box, InputLabel, Typography } from "@mui/material";
import { FilterAltOffOutlined, Search } from "@mui/icons-material";

import SearchBar from "../ui/SearchBar";
import Button from "../ui/Button";
import Select from "../ui/Select";
import DatePicker from "../ui/DatePicker";

import ExcelIcon from "@/public/icons/excel.svg";
import EraserIcon from "@/public/icons/eraser.svg";

interface IUserRegistryFiltrationProps {}

const notariesSortOptionsData = [
  { value: 10, label: "Все" },
  { value: 20, label: "В алфавитном порядке" },
  { value: 30, label: "В алфавитном порядке" },
];

const UserRegistryFiltration: FC<IUserRegistryFiltrationProps> = (props) => {
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  const t = useTranslations();

  const handleFromDateChange = (start: string) => {
    // Try to parse the date manually
    const parsedDate = parse(start, "yyyy-MM-dd", new Date());

    if (!isNaN(parsedDate.getTime())) {
      // The parsing was successful
      setFromDate(format(parsedDate, "yyyy-MM-dd"));
    } else {
      // Invalid date format
      setFromDate(null);
    }
  };

  const handleToDateChange = (finish: string) => {
    const parsedDate = parse(finish, "yyyy-MM-dd", new Date());

    if (!isNaN(parsedDate.getTime())) {
      // The parsing was successful
      setToDate(format(parsedDate, "yyyy-MM-dd"));
    } else {
      // Invalid date format
      setToDate(null);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "30px",
          alignItems: "center",
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <SearchBar
          boxSx={{
            width: {
              xs: "100%",
              md: "80%",
            },
          }}
          placeholder={t("Search")}
        />
        <Button
          sx={{
            ":hover": {},
            display: {
              xs: "none",
              md: "flex",
            },
            width: {
              xs: "100%",
              md: "20%",
            },
            padding: "13px 10px",
          }}
          color="success"
          variant="outlined"
          endIcon={<ExcelIcon />}
        >
          {t("Export to Excel")}
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "30px",
          alignItems: "center",
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {t("Registration period")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <DatePicker
              sx={{
                ".MuiInputBase-root": {
                  width: {
                    xs: "100%",
                    md: "150px",
                  },
                },
              }}
              onChange={handleFromDateChange}
              placeholder="__/__/____"
            />
            <Typography>{t("FromTo")}</Typography>
            <DatePicker onChange={handleToDateChange} placeholder="__/__/____" />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {t("User role")}
          </Typography>
          <Select
            data={notariesSortOptionsData}
            startAdornment={<Search />}
            defaultValue={notariesSortOptionsData[0].value}
            selectType="primary"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {t("Registered by whom")}
          </Typography>
          <Select
            data={notariesSortOptionsData}
            startAdornment={<Search />}
            defaultValue={notariesSortOptionsData[0].value}
            selectType="primary"
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "30px",
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <Button
          startIcon={<FilterAltOffOutlined />}
          color="success"
          buttonType="primary"
          sx={{
            width: {
              sx: "100%",
              md: "320px",
            },
            padding: "10px 0",
          }}
        >
          {t("Apply a filter")}
        </Button>
        <Button
          startIcon={<EraserIcon />}
          buttonType="secondary"
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
          {t("Clear the filter")}
        </Button>
      </Box>
    </Box>
  );
};

export default UserRegistryFiltration;
