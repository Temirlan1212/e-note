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
import SuccessStepFields from "./steps/SuccessStepFields";
import NotaryFirstStepFields from "./notary-steps/FirstStepFields";
import NotarySecondStepFields from "./notary-steps/SecondStepFields";
import NotaryThirdStepFields from "./notary-steps/ThirdStepFields";
import NotaryFourthStepFields from "./notary-steps/FourthStepFields";
import NotaryFifthStepFields from "./notary-steps/FifthStepFields";
import NotarySixthStepFields from "./notary-steps/SixthStepFields";
import NotarySuccessStepFields from "./notary-steps/SuccessStepFields";
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
    update: updateDynamicFormAppData,
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

  const getDynamicFormAppData = async () => {
    const productId = form.watch("product.id");
    const { data } = await getDocumentTemplateData(`/api/dictionaries/document-type/template/${productId}`);

    if (Array.isArray(data) && data.length > 0 && id) {
      const fieldsProps = data.map((group: Record<string, any>) => group?.fields).flat();
      let related: Record<string, string[]> = {};
      let fields: Record<string, string> = {};
      const regex = /\b(movable|immovable|notaryOtherPerson|notaryAdditionalPerson|relationships)\b/;

      fieldsProps.map((fieldProps: Record<string, any>) => {
        const fieldName = fieldProps?.fieldName ?? "";
        const match = fieldProps?.path?.match(regex);

        if (match) {
          const relatedFields = related?.[match?.[0]] ?? [];
          related[match?.[0] ?? ""] = [...relatedFields, fieldName];
        } else {
          const field = !!fieldProps?.path ? fieldProps?.path + "." + fieldName : fieldName;
          fields[String(field)] = "";
        }
      });

      updateDynamicFormAppData(`/api/applications/${id}`, { related, fields: Object.keys(fields) });
    }
  };

  const steps =
    userData?.group?.id === 4
      ? [
          <NotaryFirstStepFields key={0} form={form} stepState={[step, setStep]} onNext={() => setStep(step + 1)} />,
          <NotarySecondStepFields
            key={1}
            form={form}
            stepState={[step, setStep]}
            onPrev={() => setStep(step - 1)}
            onNext={getDynamicFormAppData}
          />,
          <NotaryThirdStepFields
            key={2}
            form={form}
            stepState={[step, setStep]}
            onPrev={() => setStep(step - 1)}
            onNext={() => {
              getDynamicFormAppData();
              setStep(step + 1);
            }}
          />,
          <NotaryFourthStepFields
            key={3}
            form={form}
            stepState={[step, setStep]}
            onPrev={() => setStep(step - 1)}
            onNext={() => setStep(step + 1)}
          />,

          <NotaryFifthStepFields
            key={4}
            dynamicForm={dynamicForm}
            form={form}
            stepState={[step, setStep]}
            onPrev={() => setStep(step - 1)}
            onNext={() => setStep(step + 1)}
          />,
          <NotarySixthStepFields
            key={5}
            form={form}
            stepState={[step, setStep]}
            onPrev={() => setStep(step - 1)}
            onNext={() => setStep(step + 1)}
          />,
          <NotarySuccessStepFields key={7} form={form} stepState={[step, setStep]} onNext={() => setStep(step + 1)} />,
        ]
      : [
          <FirstStepFields key={0} form={form} onNext={() => setStep(step + 1)} />,
          <SecondStepFields
            key={1}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={async () => {
              getDynamicFormAppData();
              setStep(step + 1);
            }}
          />,
          <ThirdStepFields key={2} form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <FourthStepFields key={3} form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <FifthStepFields
            key={4}
            form={form}
            dynamicForm={dynamicForm}
            onPrev={() => setStep(step - 1)}
            onNext={() => setStep(step + 1)}
          />,
          <SixthStepFields key={5} form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
          <SuccessStepFields key={7} form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
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
        mb={3}
        p={2}
        boxShadow={4}
        borderRadius={1}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {steps.map((component, index) => step === index && component)}
      </Box>
    </Box>
  );
}
