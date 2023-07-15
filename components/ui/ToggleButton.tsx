import { ToggleButton as MuiToggleButton, ToggleButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const ToggleButton = styled((props: ToggleButtonProps) => <MuiToggleButton {...props} />)(({ theme }) => ({
  border: "none",
  fontSize: "16px",
  width: "100%",
  borderRadius: "0",
  transition: "0.5s",

  "&:hover": {
    backgroundColor: "white",
    boxShadow: "0px 5px 10px 0px #99DBAF",
  },

  "&.Mui-selected": {
    backgroundColor: theme.palette.success.main,
    color: "white",
    boxShadow: "0px 10px 20px 0px #99DBAF",
  },
  "&.Mui-selected:hover": {
    backgroundColor: theme.palette.success.main,
  },
}));

export default ToggleButton;
