import { Box, SxProps, Theme } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import Input, { IInputProps } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";

type ISearchBarProps = IInputProps & {
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  boxSx?: SxProps<Theme> | undefined;
};

const SearchBar: React.FC<ISearchBarProps> = (props) => {
  const t = useTranslations();
  const { loading, onClick, boxSx, ...rest } = props;

  return (
    <Box display="flex" sx={boxSx}>
      <Input fullWidth placeholder={t("Search")} {...rest} />
      <Button sx={{ width: "80px" }} type="submit" color="success" loading={loading} onClick={onClick}>
        <SearchOutlined />
      </Button>
    </Box>
  );
};

export default SearchBar;
