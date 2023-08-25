import React from "react";
import { useTranslations } from "next-intl";
import { Box, Typography } from "@mui/material";

interface IStepperProps {
  currentStep: number;
  stepNext?: number;
  stepNextTitle?: string;
  onlyCurrentStep?: boolean;
}

const VerticalStepper: React.FC<IStepperProps> = (props) => {
  const t = useTranslations();

  const { currentStep, stepNext, stepNextTitle, onlyCurrentStep } = props;

  return (
    <Box sx={{ display: { md: "flex", xs: "none" }, flexDirection: "column" }}>
      <Typography
        fontSize={18}
        fontWeight={600}
        color="primary"
        sx={{
          borderRadius: "50%",
          border: "2px solid",
          borderColor: "primary",
          width: "64px",
          minHeight: "64px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {currentStep}
      </Typography>
      {!onlyCurrentStep && (
        <>
          <Box
            width={"50%"}
            height={"calc(100% - 64px)"}
            sx={{
              borderRight: "2px solid",
              borderColor: "grey.300",
            }}
          ></Box>
          <Box position="relative">
            <Typography
              fontSize={18}
              fontWeight={600}
              color="primary"
              sx={{
                borderRadius: "50%",
                border: "2px solid",
                borderColor: "primary",
                width: "64px",
                minHeight: "64px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {stepNext}
            </Typography>
            <Typography
              fontSize="18px"
              minWidth="max-content"
              fontWeight={600}
              color="grey.300"
              position="absolute"
              top="18px"
              left="84px"
            >
              {t(`${stepNextTitle}`)}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default VerticalStepper;
