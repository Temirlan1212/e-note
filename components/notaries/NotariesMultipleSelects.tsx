import { Box, InputLabel } from "@mui/material";
import React from "react";
import Select from "../ui/Select";

interface INotariesMultipleSelectsProps {
  setCharacters: (val: any) => void;
  option: any;
}

const NotariesMultipleSelects = ({ setCharacters, option }: INotariesMultipleSelectsProps) => {
  const selectChange = (selectedOption: { target: any }) => {
    const { name, value } = selectedOption.target;
    setCharacters((prevState: any[]) => {
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
          marginBottom: "5px",
          fontWeight: 500,
        }}
      >
        {data.label}
      </InputLabel>
      <Select selectType="primary" data={data.options} defaultValue={data.options[0]?.value} onChange={selectChange} />
    </div>
  ));
};

export default NotariesMultipleSelects;
