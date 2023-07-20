import { Box, InputLabel } from "@mui/material";
import React from "react";
import Select from "../ui/Select";

interface INotariesMultipleSelectsProps {
  setFilters: (val: any) => void;
  option: any;
}

const NotariesMultipleSelects = ({ setFilters, option }: INotariesMultipleSelectsProps) => {
  const selectChange = (selectedOption: { target: any }) => {
    const { name, value } = selectedOption.target;

    setFilters((prevState: any[]) => {
      const newArr = prevState.find((elem) => elem.name === name);

      if (newArr) {
        return prevState.map((elem) => {
          if (elem.key === name) {
            return selectedOption;
          }
          return elem;
        });
      }

      return [...prevState, { name, value }];
    });
  };

  return option?.map((data: { id: React.Key | null | undefined; options: any; placeholder: any; label: any }) => (
    <div key={data.id}>
      <InputLabel
        sx={{
          fontSize: "14px",
          marginBottom: "5px",
          fontWeight: 500,
          color: "#24334B",
        }}
      >
        {data.label}
      </InputLabel>
      <Select selectType="primary" data={data.options} defaultValue={data.options[0]?.value} onChange={selectChange} />
    </div>
  ));
};

export default NotariesMultipleSelects;
