import React from "react";

import { UseFormRegister } from "react-hook-form";
import { Box } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";

import Input from "./Input";
import Button from "./Button";
import { useTranslations } from "next-intl";

interface ISearchBarProps {
  register?: UseFormRegister<any>;
  name?: string;
  sxBox?: any;
  loading?: boolean;
  error?: any;
  helperText?: any;
}

const SearchBar: React.FC<ISearchBarProps> = (props) => {
  const t = useTranslations();

  const { register, name, loading, error, helperText, ...rest } = props;

  return (
    <Box display="flex" {...rest}>
      <Input
        fullWidth
        name={name}
        placeholder={t("Search")}
        {...(register && name && register(name))}
        error={error}
        helperText={helperText}
      />
      <Button sx={{ width: "80px" }} type="submit" color="success" loading={loading}>
        <SearchOutlined />
      </Button>
    </Box>
  );
};

export default SearchBar;
