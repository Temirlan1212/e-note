import { Box, BoxProps, CircularProgress, Typography } from "@mui/material";

interface IStepperProps {
  step: number;
  title: string;
  stepColor?: "primary" | "secondary" | "error" | "warning" | "success";
  titleColor?: "primary" | "secondary" | "error" | "warning" | "success";
  loading?: boolean;
  sx?: BoxProps["sx"];
}

const StepperContentStep: React.FC<IStepperProps> = (props) => {
  const { step, title, stepColor = "primary", titleColor = "secondary", loading = false, sx = {} } = props;

  return (
    <Box display="flex" alignItems="center" gap="15px" sx={sx}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        width={50}
        height={50}
        border={2}
        borderRadius={50}
        borderColor={loading ? "transparent" : stepColor + ".main"}
      >
        <Typography color={stepColor} variant="h4">
          {step}
        </Typography>

        {loading && <CircularProgress size={50} thickness={2} color={stepColor} sx={{ position: "absolute" }} />}
      </Box>

      <Typography variant="h4" color={titleColor}>
        {title}
      </Typography>
    </Box>
  );
};

export default StepperContentStep;
