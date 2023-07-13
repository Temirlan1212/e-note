import { forwardRef } from "react";

import Button, { ButtonProps } from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

export enum BackgroundColor {
  Primary,
  Secondary,
}

interface PrimaryButtonProps extends ButtonProps {
  bgColor?: BackgroundColor;
}

const PrimaryButton: React.ForwardRefRenderFunction<HTMLButtonElement, PrimaryButtonProps> = (props, ref) => {
  const { variant = "contained", bgColor = BackgroundColor.Primary, ...rest } = props;

  const theme = useTheme();

  const primaryColor = bgColor === BackgroundColor.Primary ? theme.palette.success.main : theme.palette.info.light;

  const buttonStyles =
    variant === "contained"
      ? { backgroundColor: primaryColor, color: theme.palette.text.secondary }
      : { borderColor: primaryColor, color: primaryColor };

  return (
    <Button
      {...rest}
      ref={ref}
      sx={{ borderRadius: 0, fontSize: "16px", fontWeight: "600", padding: "10px 0" }}
      style={buttonStyles}
      fullWidth
      variant={variant}
    />
  );
};

export default forwardRef<HTMLButtonElement, PrimaryButtonProps>(PrimaryButton);
