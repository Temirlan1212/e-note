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
import { useTranslations } from "next-intl";

interface INotariesFiltrationProps {}

const NotariesFiltration = (props: INotariesFiltrationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const t = useTranslations();

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
            {t("Sorting")}:
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
