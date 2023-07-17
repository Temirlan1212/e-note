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
import { optionSelectData } from "../../data";

interface INotariesFiltrationProps {}

const NotariesFiltration = (props: INotariesFiltrationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const notariesSortOptionsData = [
    { value: 10, label: "В алфавитном порядке" },
    { value: 20, label: "В алфавитном порядке" },
    { value: 30, label: "В алфавитном порядке" },
  ];

  const [characters, setCharacters] = useState([]);

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
          onClick={toggleVisibility}
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
          gap: "40px",
          maxHeight: isVisible ? "1000px" : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease-out",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gridColumnGap: "40px",
            gridRowGap: "30px",
          }}
        >
          <NotariesMultipleSelects option={optionSelectData} setCharacters={setCharacters} />
        </Box>
        <RadioGroup
          sx={{ display: "flex", flexDirection: "row" }}
          aria-labelledby="filter-radio-buttons-group-label"
          defaultValue="krug"
          name="radio-buttons-group"
        >
          <Radio label="Круглосуточно" value="krug" />
          <Radio label="Выездной" value="vyesd" />
        </RadioGroup>
        <Box display="flex" gap="30px">
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
            Применить фильтр
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NotariesFiltration;
