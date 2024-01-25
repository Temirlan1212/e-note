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
import NotaryFirstStepFields from "./notary-steps/FirstStepFields";
import NotarySecondStepFields from "./notary-steps/SecondStepFields";
import NotaryThirdStepFields from "./notary-steps/ThirdStepFields";
import NotaryFourthStepFields from "./notary-steps/FourthStepFields";
import NotaryFifthStepFields from "./notary-steps/FifthStepFields";
import NotarySixthStepFields from "./notary-steps/SixthStepFields";
import { useRouter } from "next/router";
import useNavigationConfirmation from "@/hooks/useNavigationConfirmation";
import SelectTemplateSelectionType from "./common-steps/SelectTemplateSelectionType";
import SecondStepFieldsSystemDocument from "./steps/SecondStepFieldsSystemDocument";
import { useTranslations } from "next-intl";

export interface IApplicationFormProps {
  id?: number | null;
}

export default function ApplicationForm({ id }: IApplicationFormProps) {
  const router = useRouter();
  const profile = useProfileStore.getState();
  const t = useTranslations();

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
  const { update: getNotaryApp } = useFetch("", "POST");

  const form = useForm<IApplicationSchema>({
    mode: "all",
    resolver: yupResolver<IApplicationSchema>(applicationSchema),
    values: data?.status === 0 && data?.data[0]?.id != null ? data.data[0] : undefined,
  });

  const handleRemoveFormField = (field: keyof IApplicationSchema) => {
    form.unregister(field);
  };

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

    const res = await getNotaryApp("/api/app-notary");
    if (Array.isArray(res?.data) && res?.data.length > 0) {
      const item = res.data[0];
      form.setValue("openFields", !!item?.openFields);
    }
  });

  const getDynamicFormAppData = async () => {
    const productId = form.watch("product.id");
    if (!Boolean(productId)) return;
    const { data } = (await getDocumentTemplateData(`/api/dictionaries/document-type/template/${productId}`)) ?? {
      data: null,
    };

    if (Array.isArray(data) && data.length > 0 && id) {
      const fieldsProps = data.map((group: Record<string, any>) => group?.fields).flat();
      const responseFieldsProps = fieldsProps
        .filter((item: Record<string, any>) => item?.responseFields?.length > 0)
        .map((item) => item?.responseFields);
      const paramsFieldsProps = fieldsProps
        .filter((item: Record<string, any>) => item?.fields?.length > 0)
        .map((item) => item?.fields);

      let related: Record<string, string[]> = {};
      let fields: string[] = [];
      const regex = /\[(.*?)\]/;

      fieldsProps.concat(...responseFieldsProps, ...paramsFieldsProps).map((fieldProps: Record<string, any>) => {
        const fieldName = fieldProps?.fieldName ?? "";
        const match = regex.exec(fieldProps?.path)?.[1];

        if (match) {
          const relatedFields = related?.[match] ?? [];
          related[match ?? ""] = [...relatedFields, fieldName];
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
    if (stepNextClickMethod.current != null) await stepNextClickMethod.current(target);
    setStepLoading(false);
  };

  useEffectOnce(() => {
    if (step > stepProgress.current) stepProgress.current = step;
  }, [step]);

  useEffectOnce(() => {
    const step = router.query?.step;
    if (!!step) setStep(Number(step));
  }, []);

  const selectTemplateFromMade = form.watch("selectTemplateFromMade");
  const oneSideAction = form.watch("product.oneSideAction");

  useEffectOnce(() => {
    !!oneSideAction && handleRemoveFormField("members");
  }, [oneSideAction]);

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
          <SelectTemplateSelectionType
            key={1}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={({ step }) => {
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              });
            }}
            handleStepNextClick={handleStepNextClick}
          />,
          selectTemplateFromMade ? (
            <NotarySecondStepFields
              key={2}
              form={form}
              onPrev={() => setStep(step - 1)}
              onNext={({ step, isStepByStep }) => {
                if (!isStepByStep) getDynamicFormAppData();
                setStep((prev) => {
                  if (step != null) return step;
                  if (oneSideAction && !isStepByStep) return prev + 2;
                  return prev + 1;
                });
              }}
              handleStepNextClick={handleStepNextClick}
            />
          ) : (
            <NotaryThirdStepFields
              key={2}
              form={form}
              onPrev={() => setStep(step - 1)}
              onNext={({ step }) => {
                getDynamicFormAppData();
                setStep((prev) => {
                  if (step != null) return step;
                  if (oneSideAction) return prev + 2;
                  return prev + 1;
                });
              }}
              handleStepNextClick={handleStepNextClick}
            />
          ),
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
            onPrev={() => {
              oneSideAction ? setStep(step - 2) : setStep(step - 1);
            }}
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
            onNext={({ step }) => {
              setStep((prev) => {
                if (step != null) return step;
                if (router.query?.redirectUrl) {
                  router.push({ query: { ...router.query, isRedirect: true } });
                } else {
                  router.push("/applications");
                }
                return prev;
              });
            }}
            handleStepNextClick={handleStepNextClick}
          />,
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
          <SelectTemplateSelectionType
            key={1}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={({ step }) => {
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              });
            }}
            handleStepNextClick={handleStepNextClick}
          />,
          selectTemplateFromMade ? (
            <SecondStepFieldsSystemDocument
              key={2}
              form={form}
              onPrev={() => setStep(step - 1)}
              onNext={({ step, isStepByStep }) => {
                if (!isStepByStep) getDynamicFormAppData();
                setStep((prev) => {
                  if (step != null) return step;
                  return prev + 1;
                });
              }}
              handleStepNextClick={handleStepNextClick}
            />
          ) : (
            <SecondStepFields
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
            />
          ),
          <ThirdStepFields
            key={3}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={({ step }) => {
              getDynamicFormAppData();
              setStep((prev) => {
                if (oneSideAction) return prev + 2;
                if (step != null) return step;
                return prev + 1;
              });
            }}
            handleStepNextClick={handleStepNextClick}
          />,
          <FourthStepFields
            key={4}
            form={form}
            onPrev={() => {
              oneSideAction ? setStep(step - 2) : setStep(step - 1);
            }}
            onNext={({ step }) =>
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              })
            }
            handleStepNextClick={handleStepNextClick}
          />,
          <FifthStepFields
            key={5}
            dynamicForm={dynamicForm}
            form={form}
            onPrev={() => setStep(step - 2)}
            onNext={({ step }) =>
              setStep((prev) => {
                if (step != null) return step;
                return prev + 1;
              })
            }
            handleStepNextClick={handleStepNextClick}
          />,
          <SixthStepFields
            key={6}
            form={form}
            onPrev={() => setStep(step - 1)}
            onNext={({ step }) => {
              setStep((prev) => {
                if (step != null) return step;
                if (router.query?.redirectUrl) {
                  router.push({ query: { ...router.query, isRedirect: true } });
                } else {
                  router.push("/applications");
                }
                return prev;
              });
            }}
            handleStepNextClick={handleStepNextClick}
          />,
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
            const isCurrentStep = step === index;
            const isPassedStep = stepProgress.current >= index;

            return (
              <Step key={index} completed={step - 1 === index} sx={{ display: "flex", p: 0 }}>
                <StepIcon
                  icon={
                    stepLoading && step === index ? (
                      <CircularProgress sx={{ width: "30px !important", height: "30px !important" }} />
                    ) : step - 1 >= index ? (
                      <CheckCircleIcon
                        color={isPassedStep ? "success" : "disabled"}
                        sx={{ width: "30px", height: "30px" }}
                        cursor={isPassedStep ? "pointer" : "initial"}
                        onClick={() => isPassedStep && !isCurrentStep && handleStepChangeByStepper(index)}
                      />
                    ) : (
                      <RadioButtonCheckedIcon
                        onClick={() => isPassedStep && !isCurrentStep && handleStepChangeByStepper(index)}
                        color={step === index ? "success" : isPassedStep ? "secondary" : "disabled"}
                        sx={{
                          width: "30px",
                          height: "30px",
                        }}
                        cursor={isPassedStep ? "pointer" : "initial"}
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
        position="relative"
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
