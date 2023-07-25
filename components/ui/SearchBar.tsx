import { UseFormRegister } from "react-hook-form";
import { Box, TextFieldProps } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";

import Input from "./Input";
import Button from "./Button";
import { useTranslations } from "next-intl";

type ISearchBarProps = TextFieldProps & {
  register?: UseFormRegister<any>;
  name?: string;
  sx?: any;
  loading?: boolean;
  error?: any;
  helperText?: any;
  boxSx?: any;
};

const SearchBar: React.FC<ISearchBarProps> = (props) => {
  const t = useTranslations();

  const { register, name, loading, error, helperText, boxSx, ...rest } = props;

  return (
    <Box display="flex" sx={boxSx}>
      <Input
        {...rest}
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
