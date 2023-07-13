import { forwardRef } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

interface CustomButtonProps extends ButtonProps {}

const CustomButton: React.ForwardRefRenderFunction<HTMLButtonElement, CustomButtonProps> = (props, ref) => {
  const { variant = "contained", ...rest } = props;

  const theme = useTheme();

  const primaryColor = theme.palette.success.main;

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

export default forwardRef<HTMLButtonElement, CustomButtonProps>(CustomButton);
