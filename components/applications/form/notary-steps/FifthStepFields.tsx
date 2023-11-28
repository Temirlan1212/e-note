import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Alert, Box, Collapse, Grid, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/router";
import StepperContentStep from "@/components/ui/StepperContentStep";
import RequestDynamicField from "@/components/fields/RequestDynamicField";
import DynamicFormElement, { getName as getTemplateDocName } from "@/components/ui/DynamicFormElement";
import { useState } from "react";
import { useProfileStore } from "@/stores/profile";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  dynamicForm: UseFormReturn<any>;
  tundukParamsFieldsForm: UseFormReturn<any>;
  onPrev?: Function;
  onNext?: (arg: { step: number | undefined }) => void;
  handleStepNextClick?: Function;
}

const getTemplateDocGroupName = (group: Record<string, any>, locale: string | undefined) => {
  const groupName = group?.groupName === "null" ? "" : group?.groupName ?? "";
  const groupNameLocale = group?.["groupName_" + locale];

  return groupNameLocale ? groupNameLocale : groupName;
};

export default function FifthStepFields({
  form,
  dynamicForm,
  onPrev,
  onNext,
  tundukParamsFieldsForm,
  handleStepNextClick,
}: IStepFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();
  const productId = form.watch("product.id");
  const isEditableCopy = form.watch("isToPrintLineSubTotal") as boolean;
  const isFieldsOpen = form.watch("openFields") as boolean;

  const [alertOpen, setAlertOpen] = useState(false);
  const activeCompanyId = useProfileStore((state) => state.userData?.activeCompany?.id);

  const { update: applicationUpdate, loading } = useFetch("", "PUT");
  const { update: tundukVehicleDataFetch, loading: tundukVehicleDataLoading } = useFetch("", "POST");

  const {
    update: getDocumentTemplateData,
    data: documentTemplateData,
    loading: documentTemplateLoading,
  } = useFetch("", "GET");

  const triggerFields = async () => {
    return await dynamicForm.trigger();
  };

  useEffectOnce(async () => {
    if (productId != null) {
      await getDocumentTemplateData("/api/dictionaries/document-type/template/" + productId);
    }
  }, [productId]);

  const handleNextClick = async (targetStep?: number) => {
    const validated = await triggerFields();
    const { setValue, getValues } = form;

    if (validated && onNext) {
      const values = getValues();
      const applicationId = values.id;
      const paramsValues = Object.entries(tundukParamsFieldsForm.getValues()).filter(([_, v]) => v != null);

      let versions = { version: null, id: null };

      const updateSaleOrder = async (values: Record<string, any>, id?: number | null, version?: number | null) => {
        const result = await applicationUpdate(`/api/applications/update/${applicationId}`, { ...values, id, version });
        if (result != null && result.data != null && result.data[0]?.id != null) {
          return { version: result.data[0].version, id: result.data[0].id };
        }
        return { version: null, id: null };
      };

      versions = await updateSaleOrder(dynamicForm.getValues(), values?.id, values?.version);
      if (versions.version == null || versions.id == null) return;
      const { version, id } = await updateSaleOrder(Object.fromEntries(paramsValues), versions.id, versions.version);
      if (version != null && id != null) versions = { version, id };
      setValue("id", versions.id);
      setValue("version", versions.version);
      onNext({ step: targetStep });
    }
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handlePinCheck = async (
    url: string | null,
    paramsValue: Record<string, any>,
    responsefields: Record<string, any>[]
  ) => {
    if (!url) return;

    const tundukUrl = url.replace(/\${(.*?)}/g, (match, placeholder) => {
      return paramsValue[placeholder] || match;
    });

    const vehicleData = await tundukVehicleDataFetch(`/api/tunduk`, { model: tundukUrl });
    if (vehicleData?.status !== 0 || vehicleData?.data == null) {
      setAlertOpen(true);
      return;
    }

    responsefields?.map((field) => {
      const formName = getTemplateDocName(field?.path, field?.fieldName);
      const fieldName = field?.fieldName;
      const value = vehicleData?.data?.[0]?.[fieldName] ?? vehicleData?.data?.[0]?.notaryPartner?.[0]?.[fieldName];
      if (value != null && value !== "") dynamicForm.setValue(formName, value);
    });

    setAlertOpen(false);
    handleDisabled(responsefields, true);
  };

  const handlePinReset = async (fields: Record<string, any>[]) => {
    fields?.map((field) => {
      const name = getTemplateDocName(field?.path, field?.fieldName);
      const value = dynamicForm.getValues(name);
      const isBoolean = typeof value === "boolean";
      const isString = typeof value === "string";

      if (isBoolean) {
        dynamicForm.resetField(name as any, { defaultValue: false });
      } else if (!isString) {
        dynamicForm.resetField(name as any, { defaultValue: null });
      } else if (isString) {
        dynamicForm.resetField(name as any, { defaultValue: "" });
      }
    });

    tundukParamsFieldsForm.reset();
    handleDisabled(fields, false);
  };

  const handleDisabled = (fields: Record<string, any>[], value: boolean) => {
    const disabledField = fields?.find((field) => field?.fieldName === "disabled");
    if (disabledField == null) return;
    dynamicForm.setValue(getTemplateDocName(disabledField?.path, disabledField?.fieldName), value);
  };

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
  });

  useEffectOnce(() => {
    dynamicForm.setValue("isActiveCompanyId", !!activeCompanyId);
  }, [activeCompanyId]);

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <StepperContentStep step={5} title={t("Additional information")} loading={documentTemplateLoading} />

      <Collapse in={alertOpen}>
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          {t("Sorry, nothing found")}
        </Alert>
      </Collapse>

      <Box display="flex" flexDirection="column" gap="30px">
        {documentTemplateData?.data &&
          documentTemplateData?.data.map((group: Record<string, any>, index: number) => (
            <Box display="flex" flexDirection="column" gap="20px" key={index}>
              <Typography variant="h4">{getTemplateDocGroupName(group, locale)}</Typography>

              <Grid key={index} container spacing={2}>
                {group?.fields
                  ?.sort((a: any, b: any) => Number(a?.sequence ?? 0) - Number(b?.sequence ?? 0))
                  .map((item: Record<string, any>, index: number) => (
                    <Grid
                      key={index}
                      item
                      md={item?.elementWidth ?? 12}
                      width="100%"
                      display="flex"
                      flexDirection="column"
                      justifyContent="end"
                      gap="50px"
                    >
                      {String(item?.fieldType).toLocaleLowerCase() === "request" ? (
                        <RequestDynamicField
                          disabled={isFieldsOpen || isEditableCopy || item?.readonly}
                          isPermanentDisabled={isFieldsOpen || isEditableCopy}
                          required={item?.required}
                          hidden={item?.hidden}
                          conditions={item?.conditions}
                          loading={tundukVehicleDataLoading}
                          form={dynamicForm}
                          paramsForm={tundukParamsFieldsForm}
                          fields={item?.fields}
                          responseFields={item?.responseFields}
                          onPinReset={() => {
                            handlePinReset(item?.responseFields);
                          }}
                          onPinCheck={async (paramsForm) => {
                            const validated = await paramsForm.trigger();
                            let values = {};
                            item?.fields?.map((field: Record<string, any>) => {
                              values = {
                                ...values,
                                [getTemplateDocName(undefined, field?.fieldName)]: paramsForm.getValues(
                                  getTemplateDocName(item?.path ?? field?.path, field?.fieldName)
                                ),
                              };
                            });

                            if (validated) handlePinCheck(item?.url, values, item?.responseFields);
                          }}
                        />
                      ) : (
                        <DynamicFormElement
                          disabled={isEditableCopy || item?.readonly}
                          hidden={item?.hidden}
                          required={!!item?.required}
                          conditions={item?.conditions}
                          type={item?.fieldType}
                          form={dynamicForm}
                          label={item?.fieldLabels?.[locale ?? ""] ?? ""}
                          title={item?.fieldTitles?.[locale ?? ""] ?? ""}
                          defaultValue={item?.defaultValue}
                          fieldName={item?.fieldName}
                          path={item?.path}
                          selectionName={item?.selection ?? ""}
                          objectName={item?.object ?? ""}
                          options={item?.options}
                        />
                      )}
                    </Grid>
                  ))}
              </Grid>
            </Box>
          ))}
      </Box>

      {!documentTemplateLoading && (
        <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
          {onPrev != null && (
            <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />} sx={{ width: "auto" }}>
              {t("Prev")}
            </Button>
          )}
          <Button
            loading={loading}
            onClick={() => handleNextClick()}
            endIcon={<ArrowForwardIcon />}
            sx={{ width: "auto" }}
          >
            {t("Next")}
          </Button>
        </Box>
      )}
    </Box>
  );
}
