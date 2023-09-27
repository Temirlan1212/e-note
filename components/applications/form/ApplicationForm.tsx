import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { IApplicationSchema, applicationSchema } from "@/validator-schemas/application";
import { IApplication } from "@/models/application";
import { useProfileStore } from "@/stores/profile";
import { IUserData } from "@/models/user";
import { Box, Step, StepIcon, Stepper, StepConnector, LinearProgress, CircularProgress } from "@mui/material";
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
  const [stepLoading, setStepLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<IUserData | null>(null);
  const stepNextClickMethod = useRef<(target: number) => Promise<void>>();
  const stepProgress = useRef(0);

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
      const application = await update(`/api/applications/${id}`);
      const status = application?.data?.[0]?.statusSelect;
      if (status === 1) router.push("/applications");
    }
    setLoading(false);
  });

  const getDynamicFormAppData = async () => {
    const productId = form.watch("product.id");
    if (!Boolean(productId)) return;
    const { data } = (await getDocumentTemplateData(`/api/dictionaries/document-type/template/${productId}`)) ?? {
      data: null,
    };

    if (Array.isArray(data) && data.length > 0 && id) {
      const fieldsProps = data.map((group: Record<string, any>) => group?.fields).flat();
      let related: Record<string, string[]> = {};
      let fields: string[] = [];
      const regex = /\b(movable|immovable|notaryOtherPerson|notaryAdditionalPerson|relationships)\b/;

      fieldsProps.map((fieldProps: Record<string, any>) => {
        const fieldName = fieldProps?.fieldName ?? "";
        const match = fieldProps?.path?.match(regex);

        if (match) {
          const relatedFields = related?.[match?.[0]] ?? [];
          related[match?.[0] ?? ""] = [...relatedFields, fieldName];
        } else {
          const field = !!fieldProps?.path ? fieldProps?.path + "." + fieldName : fieldName;
          fields.push(String(field));
        }
      });

      updateDynamicFormAppData(`/api/applications/${id}`, { related, fields });
    }
  };

  const handleStepNextClick = async (callback?: (target: number) => Promise<void>) => {
    if (callback) stepNextClickMethod.current = callback;
  };

  const handleStepChangeByStepper = async (target: number) => {
    setStepLoading(true);
    if (stepNextClickMethod.current != null && steps.length - 1 !== step) await stepNextClickMethod.current(target);
    setStepLoading(false);
  };

  useEffectOnce(() => {
    if (step > stepProgress.current) stepProgress.current = step;
  }, [step]);

  const steps =
    userData?.group?.id === 4
      ? [
          <NotaryFirstStepFields
            key={0}
            form={form}
            onNext={({ step }) =>
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              })
            }
            handleStepNextClick={handleStepNextClick}
          />,
          <NotarySecondStepFields
            key={1}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={({ step, isStepByStep }) => {
              if (!isStepByStep) getDynamicFormAppData();
              setStep((prev) => {
                if (step != null) return step;
                if (!isStepByStep) return prev + 2;
                return prev + 1;
              });
            }}
            handleStepNextClick={handleStepNextClick}
          />,
          <NotaryThirdStepFields
            key={2}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={({ step }) => {
              getDynamicFormAppData();
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              });
            }}
            handleStepNextClick={handleStepNextClick}
          />,
          <NotaryFourthStepFields
            key={3}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={({ step }) =>
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              })
            }
            handleStepNextClick={handleStepNextClick}
          />,

          <NotaryFifthStepFields
            key={4}
            dynamicForm={dynamicForm}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={({ step }) =>
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              })
            }
            handleStepNextClick={handleStepNextClick}
          />,
          <NotarySixthStepFields
            key={5}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={({ step }) =>
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              })
            }
            handleStepNextClick={handleStepNextClick}
          />,
          <NotarySuccessStepFields key={7} form={form} onNext={() => setStep(step + 1)} />,
        ]
      : [
          <FirstStepFields
            key={0}
            form={form}
            onNext={({ step }) =>
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              })
            }
            handleStepNextClick={handleStepNextClick}
          />,
          <SecondStepFields
            key={1}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={({ step }) => {
              getDynamicFormAppData();
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              });
            }}
            handleStepNextClick={handleStepNextClick}
          />,
          <ThirdStepFields
            key={2}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={({ step }) =>
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              })
            }
            handleStepNextClick={handleStepNextClick}
          />,
          <FourthStepFields
            key={3}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={({ step }) =>
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              })
            }
            handleStepNextClick={handleStepNextClick}
          />,
          <FifthStepFields
            key={4}
            form={form}
            dynamicForm={dynamicForm}
            onPrev={() => setStep(step - 1)}
            onNext={({ step }) =>
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              })
            }
            handleStepNextClick={handleStepNextClick}
          />,
          <SixthStepFields
            key={5}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={({ step }) =>
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              })
            }
            handleStepNextClick={handleStepNextClick}
          />,
          <SuccessStepFields key={7} form={form} onPrev={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />,
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
                    stepLoading && step === index ? (
                      <CircularProgress sx={{ width: "30px !important", height: "30px !important" }} />
                    ) : step - 1 >= index ? (
                      <CheckCircleIcon
                        color={steps.length - 1 === step ? "disabled" : "success"}
                        sx={{ width: "30px", height: "30px" }}
                        cursor={stepProgress.current >= index && steps.length - 1 !== step ? "pointer" : "initial"}
                        onClick={() =>
                          stepProgress.current >= index && step !== index && handleStepChangeByStepper(index)
                        }
                      />
                    ) : (
                      <RadioButtonCheckedIcon
                        onClick={() =>
                          stepProgress.current >= index && step !== index && handleStepChangeByStepper(index)
                        }
                        color={step === index ? "success" : stepProgress.current >= index ? "secondary" : "disabled"}
                        sx={{
                          width: "30px",
                          height: "30px",
                        }}
                        cursor={stepProgress.current >= index ? "pointer" : "initial"}
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
        {(loading || dynamicFormAppLoading || documentTemplateDataLoading) && <LinearProgress />}
        {!loading &&
          !dynamicFormAppLoading &&
          !documentTemplateDataLoading &&
          steps.map((component, index) => step === index && component)}
      </Box>
    </Box>
  );
}
