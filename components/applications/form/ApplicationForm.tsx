import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { IApplicationSchema, applicationSchema } from "@/validator-schemas/application";
import { IApplication } from "@/models/application";
import { useProfileStore } from "@/stores/profile";
import { IUserData } from "@/models/profile/user";
import { Box, Step, StepIcon, Stepper, StepConnector } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import FirstStepFields from "./steps/FirstStepFields";
import SecondStepFields from "./steps/SecondStepFields";
import ThirdStepFields from "./steps/ThirdStepFields";
import FourthStepFields from "./steps/FourthStepFields";
import FifthStepFields from "./steps/FifthStepFields";
import SixthStepFields from "./steps/SixthStepFields";
import NotaryFirstStepFields from "./notary-steps/FirstStepFields";
import NotarySecondStepFields from "./notary-steps/SecondStepFields";
import NotaryThirdStepFields from "./notary-steps/ThirdStepFields";
import NotaryFourthStepFields from "./notary-steps/FourthStepFields";
import NotaryFifthStepFields from "./notary-steps/FifthStepFields";
import NotarySixthStepFields from "./notary-steps/SixthStepFields";
import { useRouter } from "next/router";

export interface IApplicationFormProps {
  id?: number | null;
}

export default function ApplicationForm({ id }: IApplicationFormProps) {
  const router = useRouter();
  const profile = useProfileStore.getState();

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<IUserData | null>(null);

  const { data, update } = useFetch("", "POST");

  useEffectOnce(async () => {
    setUserData(profile.getUserData());
  }, [profile]);

  useEffectOnce(async () => {
    if (Number.isInteger(id)) {
      await update(`/api/applications/${id}`);
    }
    setLoading(false);
  });

  const form = useForm<IApplicationSchema>({
    mode: "onTouched",
    resolver: yupResolver<IApplicationSchema>(applicationSchema),
    values: data?.status === 0 && data?.data[0]?.id != null ? data.data[0] : undefined,
  });

  const steps =
    userData?.group?.id === 4
      ? [
          <NotaryFirstStepFields form={form} onNext={() => setStep(step + 1)} />,
          <NotarySecondStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <NotaryThirdStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <NotaryFourthStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <NotaryFifthStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <NotarySixthStepFields
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={() => router.push("/applications")}
          />,
        ]
      : [
          <FirstStepFields form={form} onNext={() => setStep(step + 1)} />,
          <SecondStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <ThirdStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <FourthStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <FifthStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <SixthStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => router.push("/applications")} />,
        ];

  const onSubmit = async (data: IApplicationSchema) => {};

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
        {!loading &&
          steps.map(
            (component, index) =>
              step === index && (
                <Box key={index} sx={{ display: step != index ? "none" : "block" }}>
                  {component}
                </Box>
              )
          )}
      </Box>
    </Box>
  );
}
