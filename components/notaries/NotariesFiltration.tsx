import React, { useState } from "react";

import { Box, FormGroup, RadioGroup, Typography } from "@mui/material";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";

import SearchBar from "../ui/SearchBar";
import Button from "../ui/Button";
import Select from "../ui/Select";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import EraserIcon from "@/public/icons/EraserIcon.svg";
import NotariesMultipleSelects from "./NotariesMultipleSelects";
import Radio from "../ui/Radio";
import { useTranslations } from "next-intl";

interface INotariesFiltrationProps {}

const NotariesFiltration = (props: INotariesFiltrationProps) => {
  const t = useTranslations();

  const optionSelectData: any = [
    {
      id: 1,
      label: t("Area"),
      options: [
        {
          name: "area",
          value: "all",
          label: "Все",
        },
        {
          name: "area",
          value: "osh",
          label: "Ош",
        },
        {
          name: "area",
          value: "chui",
          label: "Чуй",
        },
        {
          name: "area",
          value: "talas",
          label: "Талас",
        },
        {
          name: "area",
          value: "batken",
          label: "Баткен",
        },
      ],
    },
    {
      id: 2,
      label: t("Region"),
      options: [
        {
          name: "region",
          value: "all",
          label: "Все",
        },
        {
          name: "region",
          value: "chui",
          label: "Чуй",
        },
        {
          name: "region",
          value: "talas",
          label: "Талас",
        },
        {
          name: "region",
          value: "batken",
          label: "Баткен",
        },
      ],
    },
    {
      id: 3,
      label: t("City"),

      options: [
        {
          name: "city",
          value: "all",
          label: "Все",
        },
        {
          name: "city",
          value: "chui",
          label: "Чуй",
        },
        {
          name: "city",
          value: "talas",
          label: "Талас",
        },
        {
          name: "city",
          value: "batken",
          label: "Баткен",
        },
      ],
    },
    {
      id: 4,
      label: t("Type of notary"),
      options: [
        {
          name: "type",
          value: "all",
          label: "Все",
        },
        {
          name: "type",
          value: "chui",
          label: "Чуй",
        },
        {
          name: "type",
          value: "talas",
          label: "Талас",
        },
        {
          name: "type",
          value: "batken",
          label: "Баткен",
        },
      ],
    },
    {
      id: 5,
      label: t("Working days"),
      options: [
        {
          name: "days",
          value: "all",
          label: "Все",
        },
        {
          name: "days",
          value: "chui",
          label: "Чуй",
        },
        {
          name: "days",
          value: "talas",
          label: "Талас",
        },
        {
          name: "days",
          value: "batken",
          label: "Баткен",
        },
      ],
    },
    {
      id: 6,
      label: t("Notary District"),
      options: [
        {
          name: "notary",
          value: "all",
          label: "Все",
        },
        {
          name: "notary",
          value: "chui",
          label: "Чуй",
        },
        {
          name: "notary",
          value: "talas",
          label: "Талас",
        },
        {
          name: "notary",
          value: "batken",
          label: "Баткен",
        },
      ],
    },
  ];

  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const notariesSortOptionsData = [
    { value: 10, label: "В алфавитном порядке" },
    { value: 20, label: "В алфавитном порядке" },
    { value: 30, label: "В алфавитном порядке" },
  ];

  const [filters, setFilters] = useState([]);

  const [notariesSortOptions, setNotariesSortOptions] = useState(notariesSortOptionsData[0].value);

  const handleNotariesSortChange = (event: React.ChangeEvent<{ value: any }>) => {
    const value = event.target.value as any;
    setNotariesSortOptions(value);
  };

  return (
    <Box
      display="flex"
      sx={{
        gap: {
          xs: "25px",
          md: "40px",
        },
      }}
      flexDirection="column"
    >
      <SearchBar />
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{
          gap: "20px",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          alignItems: {
            xs: "start",
            md: "center",
          },
        }}
      >
        <Button
          startIcon={<FilterAltOffOutlinedIcon />}
          onClick={toggleVisibility}
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
          {t("Collapse the filter")}
        </Button>

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            alignItems: {
              xs: "start",
              md: "center",
            },
            gap: "15px",
          }}
        >
          <Typography
            sx={{
              color: "#24334B",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            {t("Sort")}:
          </Typography>
          <Select
            data={notariesSortOptionsData}
            defaultValue={notariesSortOptions}
            onChange={handleNotariesSortChange}
            selectType="secondary"
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: {
            xs: "25px",
            md: "40px",
          },
          maxHeight: isVisible ? "1000px" : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease-out",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gridTemplateRows: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gridColumnGap: {
              xs: "20px",
              md: "40px",
            },
            gridRowGap: {
              xs: "20px",
              md: "30px",
            },
          }}
        >
          <NotariesMultipleSelects option={optionSelectData} setFilters={setFilters} />
        </Box>
        <RadioGroup
          sx={{ display: "flex", flexDirection: "row" }}
          aria-labelledby="filter-radio-buttons-group-label"
          defaultValue="krug"
          name="radio-buttons-group"
        >
          <Radio label={t("Around the clock")} value="krug" />
          <Radio label={t("Visiting")} value="vyesd" />
        </RadioGroup>
        <Box
          display="flex"
          gap="30px"
          sx={{
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          <Button
            startIcon={<FilterAltOutlinedIcon />}
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
    </Box>
  );
};

export default NotariesFiltration;
