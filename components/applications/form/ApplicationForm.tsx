import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { applicationSchema } from "@/validator-schemas/application";
import { IApplication } from "@/models/applications/application";
import FirstStepFields from "./steps/FirstStepFields";
import SecondStepFields from "./steps/SecondStepFields";
import ThirdStepFields from "./steps/ThirdStepFields";
import FourthStepFields from "./steps/FourthStepFields";
import FifthStepFields from "./steps/FifthStepFields";
import SixthStepFields from "./steps/SixthStepFields";
import Box from "@mui/material/Box";
import { Step, StepIcon, Stepper, StepConnector } from "@mui/material";
import Button from "../../ui/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

export default function ApplicationForm() {
  const t = useTranslations();

  const form = useForm<IApplication>({
    resolver: yupResolver<IApplication>(applicationSchema),
    defaultValues: {
      id: 0,
      version: 0,
      name: "t",
    },
  });

  const {
    formState: { errors },
    setError,
    reset,
  } = form;

  const steps = [
    <FirstStepFields form={form} />,
    <SecondStepFields form={form} />,
    <ThirdStepFields form={form} />,
    <FourthStepFields form={form} />,
    <FifthStepFields form={form} />,
    <SixthStepFields form={form} />,
  ];

  const [step, setStep] = useState(0);

  const handleStepClick = (index: number) => {
    setStep(index);
  };

  const onSubmit = async (data: IApplication) => {
    console.log(data);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="center" my={2}>
        <Stepper activeStep={step} connector={<StepConnector sx={{ flex: "0 0 45px" }} />} sx={{ flex: "1 1 auto" }}>
          {steps.map((component, index) => {
            return (
              <Step
                key={index}
                completed={step - 1 === index}
                onClick={() => handleStepClick(index)}
                sx={{ display: "flex", p: 0, cursor: "pointer" }}
              >
                <StepIcon
                  icon={
                    step - 1 >= index ? (
                      <CheckCircleIcon color="success" sx={{ width: "30px", height: "30px" }} />
                    ) : (
                      <RadioButtonCheckedIcon
                        color={step === index ? "success" : "secondary"}
                        sx={{ width: "30px", height: "30px" }}
                      />
                    )
                  }
                />
              </Step>
            );
          })}
        </Stepper>
      </Box>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        gap="30px"
        p={2}
        boxShadow={4}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {steps.map((component, index) => (step === index ? component : <></>))}
      </Box>
    </Box>
  );
}
