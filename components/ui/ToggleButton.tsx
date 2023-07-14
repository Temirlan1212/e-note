import { ToggleButton as MuiToggleButton, ToggleButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const ToggleButton = styled((props: ToggleButtonProps) => <MuiToggleButton {...props} />)(({ theme }) => ({
  border: "none",
  fontSize: "16px",
  width: "100%",
  borderRadius: "0",

  "&:hover": {
    backgroundColor: theme.palette.text.secondary,
  },

  "&.Mui-selected": {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.text.secondary,
    boxShadow: "0px 10px 20px 0px #99DBAF",
  },
  "&.Mui-selected:hover": {
    backgroundColor: theme.palette.success.main,
  },
}));

export default ToggleButton;
