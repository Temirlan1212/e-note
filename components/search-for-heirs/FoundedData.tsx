import { Box, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import SortSelect from "../ui/Select";

import HeirAccordion from "./HeirAccordion";
import { useLocale, useTranslations } from "next-intl";

const heirCount = 4;
type FoundedDataProps = {};

const FoundedData = (props: FoundedDataProps) => {
  const t = useTranslations();

  const locale = useLocale();

  const data = [
    { value: 10, label: "В алфавитном порядке" },
    { value: 20, label: "В алфавитном порядке" },
    { value: 30, label: "В алфавитном порядке" },
  ];

  const matches = useMediaQuery("(min-width:900px)");

  const [state, setState] = useState(data[0].value);

  const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
    const value = event.target.value as any;
    setState(value);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "80px" }}>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", gap: "20px" }}
        flexDirection={matches ? "row" : "column"}
        alignItems={matches ? "center" : "start"}
      >
        <Typography
          sx={{
            color: "#24334B",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          {t("According to your query,")} <span style={{ color: "#1BAA75" }}>{heirCount}</span>{" "}
          {/* Условия связаны с тем что в русском языке могут меняться окончания в зависимости от количества */}
          {locale === "ru" && Number(heirCount) === 1 ? t("1 inheritors were found") : t("inheritors were found")}
        </Typography>

        <Box
          sx={{ display: "flex", gap: "15px" }}
          flexDirection={matches ? "row" : "column"}
          alignItems={matches ? "center" : "start"}
        >
          <Typography
            sx={{
              color: "#24334B",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {t("Sort")}:
          </Typography>
          <SortSelect data={data} defaultValue={state} onChange={handleChange} selectType="secondary" />
        </Box>
      </Box>
      <Box>
        <HeirAccordion />
      </Box>
    </Box>
  );
};

export default FoundedData;
