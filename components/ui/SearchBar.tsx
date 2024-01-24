import { Box, IconButton, SxProps, Theme, darken } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import Input, { IInputProps } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import CloseIcon from "@mui/icons-material/Close";

type ISearchBarProps = IInputProps & {
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  boxSx?: SxProps<Theme> | undefined;
  showCloseButton?: boolean;
};

const SearchBar: React.FC<ISearchBarProps> = (props) => {
  const t = useTranslations();
  const { loading, onClick, boxSx, showCloseButton = false, ...rest } = props;

  return (
    <Box display="flex" sx={boxSx} position="relative">
      <Input
        fullWidth
        placeholder={t("Search")}
        {...rest}
        sx={{
          ".MuiInputBase-input": { paddingRight: "100px" },
          ...(rest?.sx || {}),
          ".MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px !important",
            borderRadius: "5px !important",
          },
        }}
      />

      <Box
        sx={{
          height: "37px",
          position: "absolute",
          right: "3px",
          top: "3px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {showCloseButton && (
          <Box>
            <IconButton
              type="reset"
              sx={{
                height: "30px",
                width: "27px",
                background: "white",
                borderRadius: "0px",
                opacity: 0.6,
                "&:hover": { background: "white", opacity: 1 },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        <Button
          sx={{
            width: "70px",
            boxShadow: "none",
            height: "100%",
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px",
            "&:hover": {
              boxShadow: "none",
              backgroundColor: (theme) => darken(theme.palette.success.main, 0.2),
            },
          }}
          type="submit"
          color="success"
          loading={loading}
          onClick={onClick}
        >
          <SearchOutlined />
        </Button>
      </Box>
    </Box>
  );
};

export default SearchBar;
