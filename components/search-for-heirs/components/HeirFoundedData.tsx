import React, { FC, useState } from "react";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import SortSelect from "../../ui/Select";
import HeirAccordion from "./HeirAccordion";

type IHeirFoundedDataProps = {
  foundedData: any;
};

const heirCount = 4;

const HeirFoundedData: FC<IHeirFoundedDataProps> = ({ foundedData }) => {
  const t = useTranslations();

  const sortOptionsData = [{ value: 10, label: "В алфавитном порядке" }];

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
          {t("According to your query,")} <span style={{ color: "#1BAA75" }}>{foundedData.length}</span>{" "}
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
            disabled={true}
          />
        </Box>
      </Box>
      <Box>
        <HeirAccordion foundedData={foundedData} />
      </Box>
    </Box>
  );
};

export default HeirFoundedData;
