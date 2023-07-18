import React, { useState } from "react";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import SortSelect from "../ui/Select";
import HeirAccordion from "./HeirAccordion";

type IHeirFoundedDataProps = {};

const heirCount = 4;

const HeirFoundedData = (props: IHeirFoundedDataProps) => {
  const t = useTranslations();

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

  const boxAdaptiveStyles = {
    display: "flex",
    flexDirection: {
      xs: "column",
      md: "row",
    },
    alignItems: {
      xs: "start",
      md: "center",
    },
  };

  const typographyStyles = {
    color: "#24334B",
    fontWeight: 600,
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "80px" }}>
      <Box
        sx={{
          justifyContent: "space-between",
          gap: "20px",
          ...boxAdaptiveStyles,
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            ...typographyStyles,
          }}
        >
          {t("According to your query,")} <span style={{ color: "#1BAA75" }}>{heirCount}</span>{" "}
          {t("inheritors", { count: heirCount })}
        </Typography>

        <Box
          sx={{
            ...boxAdaptiveStyles,
            gap: "15px",
          }}
        >
          <Typography
            sx={{
              ...typographyStyles,
              fontSize: 16,
            }}
          >
            {t("Sort")}:
          </Typography>
          <SortSelect
            data={sortOptionsData}
            defaultValue={sortOptions}
            onChange={handleSortChange}
            selectType="secondary"
          />
        </Box>
      </Box>
      <Box>
        <HeirAccordion />
      </Box>
    </Box>
  );
};

export default HeirFoundedData;
