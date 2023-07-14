import { forwardRef } from "react";

import { Button as MUIButton, ButtonProps } from "@mui/material";

interface MUIButtonProps extends ButtonProps {
  buttonType?: string;
}

const Button: React.ForwardRefRenderFunction<HTMLButtonElement, MUIButtonProps> = (props, ref) => {
  const { variant = "contained", buttonType = "primary", ...rest } = props;

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

  const buttonStyles =
    variant === "contained"
      ? { backgroundColor: renderSwitch(buttonType), color: "#fff" }
      : { borderColor: renderSwitch(buttonType), color: renderSwitch(buttonType) };

  return (
    <MUIButton
      {...rest}
      ref={ref}
      sx={{ borderRadius: 0, fontSize: "16px", fontWeight: "600", padding: "10px 0" }}
      style={buttonStyles}
      fullWidth
      variant={variant}
    />
  );
};

export default forwardRef<HTMLButtonElement, MUIButtonProps>(Button);
