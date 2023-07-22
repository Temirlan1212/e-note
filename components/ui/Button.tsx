import { forwardRef } from "react";

import { Button as MUIButton, ButtonProps, CircularProgress } from "@mui/material";

interface IButtonProps extends ButtonProps {
  buttonType?: "primary" | "secondary" | "danger";
  loading?: boolean;
  progressStyles?: any;
}

const Button: React.ForwardRefRenderFunction<HTMLButtonElement, IButtonProps> = (props, ref) => {
  const {
    variant = "contained",
    buttonType = "primary",
    sx,
    loading = false,
    disabled = false,
    progressStyles,
    children,
    ...rest
  } = props;

  const renderSwitch = (param: string) => {
    switch (param) {
      case "primary":
        return "#1BAA75";
      case "secondary":
        return "#3F5984";
      case "danger":
        return "#687C9B";
      default:
        return "#1BAA75";
    }
  };

  const buttonDefaultStyles = {
    borderRadius: 0,
    fontSize: "16px",
    fontWeight: "600",
    ":hover": {
      bgcolor: "#1BAA75",
    },
  };

  const buttonStyles =
    variant === "contained"
      ? {
          backgroundColor: renderSwitch(buttonType),
          color: "#fff",
        }
      : {
          borderColor: renderSwitch(buttonType),
          color: renderSwitch(buttonType),
        };

  const mergedStyles = { ...buttonDefaultStyles, ...buttonStyles, ...sx };

  return (
    <MUIButton {...rest} ref={ref} sx={mergedStyles} disabled={loading || disabled} fullWidth variant={variant}>
      {loading ? (
        <CircularProgress color="inherit" style={{ width: "28px", height: "28px", ...progressStyles }} />
      ) : (
        children
      )}
    </MUIButton>
  );
};

export default forwardRef<HTMLButtonElement, IButtonProps>(Button);
