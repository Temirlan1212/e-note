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
  onClick?: () => void;
};

const SearchBar: React.FC<ISearchBarProps> = (props) => {
  const t = useTranslations();

  const { register, name, loading, error, helperText, boxSx, onClick, ...rest } = props;

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
      <Button
        sx={{ width: "80px", boxShadow: "none" }}
        type="submit"
        color="success"
        loading={loading}
        onClick={onClick}
      >
        <SearchOutlined />
      </Button>
    </Box>
  );
};

export default SearchBar;
