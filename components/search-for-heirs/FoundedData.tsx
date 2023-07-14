import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import SortSelect from "../ui/Select";

const heirCount = 4;
type FoundedDataProps = {};

const FoundedData = (props: FoundedDataProps) => {
  const data = [
    { value: 10, label: "В алфавитном порядке" },
    { value: 20, label: "Option 2" },
    { value: 30, label: "Option 3" },
  ];

  const [state, setState] = useState(data[0].value);

  const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
    const value = event.target.value as any;
    setState(value);
  };

  console.log(state);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "80px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          sx={{
            color: "#24334B",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          По вашему запросу найдено <span style={{ color: "#1BAA75" }}>{heirCount}</span> наследователя
        </Typography>

        <Box sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <Typography
            sx={{
              color: "#24334B",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Сортировка:
          </Typography>
          <SortSelect data={data} defaultValue={state} onChange={handleChange} selectType="secondary" />
        </Box>
      </Box>
      <Box>Список наследников</Box>
    </Box>
  );
};

export default FoundedData;
