import React, { useState } from "react";

import { Box, FormGroup, Typography } from "@mui/material";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";

import SearchBar from "./SearchBar";
import Button from "../ui/Button";
import Checkbox from "../ui/Checkbox";
import Select from "../ui/Select";

import EraserIcon from "@/public/icons/EraserIcon.svg";

interface INotariesFiltrationProps {}

const NotariesFiltration = (props: INotariesFiltrationProps) => {
  const sortOptionsData = [
    { value: 10, label: "В алфавитном порядке" },
    { value: 20, label: "В алфавитном порядке" },
    { value: 30, label: "В алфавитном порядке" },
  ];

  const [sortOptions, setSortOptions] = useState(sortOptionsData[0].value);

  const handleSortChange = (event: React.ChangeEvent<{ value: any }>) => {
    const value = event.target.value as any;
    setSortOptions(value);
  };

  return (
    <Box
      display="flex"
      sx={{
        gap: {
          sx: "25px",
          md: "40px",
        },
      }}
      flexDirection="column"
    >
      <SearchBar />
      <Box display="flex" justifyContent="space-between">
        <Button
          startIcon={<FilterAltOffOutlinedIcon />}
          color="success"
          sx={{
            width: {
              sx: "100%",
              md: "320px",
            },
            padding: "10px 0",
          }}
        >
          Свернуть фильтр
        </Button>

        <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
          <Checkbox label="Круглосуточно" />
          <Checkbox label="Выездной" />
        </FormGroup>

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
            Сортировка:
          </Typography>
          <Select
            data={sortOptionsData}
            defaultValue={sortOptions}
            onChange={handleSortChange}
            selectType="secondary"
          />
        </Box>
      </Box>
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
        Очистить фильтр
      </Button>
    </Box>
  );
};

export default NotariesFiltration;
