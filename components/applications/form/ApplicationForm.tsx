import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IApplicationSchema, applicationSchema } from "@/validator-schemas/application";
import FirstStepFields from "./steps/FirstStepFields";
import SecondStepFields from "./steps/SecondStepFields";
import ThirdStepFields from "./steps/ThirdStepFields";
import FourthStepFields from "./steps/FourthStepFields";
import FifthStepFields from "./steps/FifthStepFields";
import SixthStepFields from "./steps/SixthStepFields";
import { Box, Step, StepIcon, Stepper, StepConnector } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import Button from "@/components/ui/Button";

export default function ApplicationForm() {
  const t = useTranslations();

  const form = useForm<IApplicationSchema>({
    mode: "onTouched",
    resolver: yupResolver<IApplicationSchema>(applicationSchema),
    defaultValues: {
      id: 0,
      version: 0,
    },
  });

  const {
    formState: { errors },
    reset,
  } = form;

  const [step, setStep] = useState(0);

  const steps = [
    <FirstStepFields form={form} onNext={() => setStep(step + 1)} />,
    <SecondStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
    <ThirdStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
    <FourthStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
    <FifthStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
    <SixthStepFields form={form} onPrev={() => setStep(step - 1)} />,
  ];

  const onSubmit = async (data: IApplicationSchema) => {
    console.log(data);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="center" my={2}>
        <Stepper
          activeStep={step}
          connector={<StepConnector sx={{ flex: { xs: "0 0 5px", md: "0 0 45px" } }} />}
          sx={{ justifyContent: "center" }}
        >
          {steps.map((component, index) => {
            return (
              <Step key={index} completed={step - 1 === index} sx={{ display: "flex", p: 0 }}>
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
        {steps.map((component, index) => (
          <Box key={index} sx={{ display: step != index ? "none" : "block" }}>
            {component}
          </Box>
        ))}
        {step === steps.length - 1 && <Button type="submit">{t("Submit")}</Button>}
      </Box>
    </Box>
  );
}
