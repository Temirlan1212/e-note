import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { IApplicationSchema, applicationSchema } from "@/validator-schemas/application";
import { IApplication } from "@/models/application";
import { useProfileStore } from "@/stores/profile";
import { IUserData } from "@/models/profile/user";
import { Box, Step, StepIcon, Stepper, StepConnector, Skeleton } from "@mui/material";
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
import useNavigationConfirmation from "@/hooks/useNavigationConfirmation";

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
  const {
    data: dynamicFormAppData,
    update: getDynamicFormAppData,
    loading: dynamicFormAppLoading,
  } = useFetch("", "POST");

  const { update: getDocumentTemplateData, loading: documentTemplateDataLoading } = useFetch("", "GET");

  const form = useForm<IApplicationSchema>({
    mode: "onTouched",
    resolver: yupResolver<IApplicationSchema>(applicationSchema),
    values: data?.status === 0 && data?.data[0]?.id != null ? data.data[0] : undefined,
  });

  const dynamicForm = useForm({
    mode: "onTouched",
    values:
      dynamicFormAppData?.status === 0 && dynamicFormAppData?.data[0] != null ? dynamicFormAppData.data[0] : undefined,
  });

  useNavigationConfirmation(form.formState.isDirty);

  useEffectOnce(async () => {
    setUserData(profile.getUserData());
  }, [profile]);

  useEffectOnce(async () => {
    if (Number.isInteger(id)) {
      await update(`/api/applications/${id}`);
    }
    setLoading(false);
  });

  const steps =
    userData?.group?.id === 4
      ? [
          <NotaryFirstStepFields form={form} onNext={() => setStep(step + 1)} />,
          // <NotarySecondStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <NotaryThirdStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <NotaryFourthStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <NotaryFifthStepFields
            dynamicForm={dynamicForm}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={() => setStep(step + 1)}
          />,
          <NotarySixthStepFields
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={() => router.push("/applications")}
          />,
        ]
      : [
          <FirstStepFields form={form} onNext={() => setStep(step + 1)} />,
          <SecondStepFields
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={async () => {
              const { data } = await getDocumentTemplateData(
                "/api/dictionaries/document-type/template/" + form.watch("product.id")
              );

              if (Array.isArray(data) && data.length > 0 && id) {
                const fieldsProps = data.map((group: Record<string, any>) => group?.fields).flat();
                const fields = fieldsProps.map((fieldProps: Record<string, any>) => {
                  const fieldName = fieldProps?.fieldName ?? "";
                  return !!fieldProps?.path ? fieldProps?.path + "." + fieldName : fieldName;
                });

                getDynamicFormAppData(`/api/applications/${id}`, { fields: fields });
              }

              setStep(step + 1);
            }}
          />,
          <ThirdStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <FourthStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <FifthStepFields
            form={form}
            dynamicForm={dynamicForm}
            onPrev={() => setStep(step - 1)}
            onNext={() => setStep(step + 1)}
          />,
          <SixthStepFields form={form} onPrev={() => setStep(step - 1)} onNext={() => router.push("/applications")} />,
        ];

  const onSubmit = async (data: IApplicationSchema) => {};

  if (loading || dynamicFormAppLoading || documentTemplateDataLoading) {
    return <></>;
  }

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
        {steps.map((component, index) => step === index && <Box key={index}>{component}</Box>)}
      </Box>
    </Box>
  );
}
