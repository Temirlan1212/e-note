import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, Grid, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/router";
import StepperContentStep from "@/components/ui/StepperContentStep";
import TundukDynamicFields from "@/components/fields/TundukDynamicFields";
import DynamicField from "@/components/ui/DynamicField";

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

const getTemplateDocName = (
  path: string | null,
  name: string | null,
  regex: RegExp = /\b(movable|immovable|notaryOtherPerson|notaryAdditionalPerson|relationships)(?:\.|$)/
) => {
  if (path != null && name != null) {
    if (regex.test(path)) {
      const index = 0;
      return `${path}.${index}.${name}`;
    }

    return `${path}.${name}`;
  }

  return name ?? "";
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

  const { update: applicationUpdate, loading } = useFetch("", "PUT");
  const {
    data: tundukVehicleData,
    update: tundukVehicleDataFetch,
    loading: tundukVehicleDataLoading,
  } = useFetch("", "POST");

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

      const data: Partial<IApplicationSchema> = {
        ...dynamicForm.getValues(),
        id: values.id,
        version: values.version,
      };

      const result = await applicationUpdate(`/api/applications/update/${values.id}`, data);
      if (result != null && result.data != null && result.data[0]?.id != null) {
        setValue("id", result.data[0].id);
        setValue("version", result.data[0].version);
        onNext({ step: targetStep });
      }
    }
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handlePinCheck = async (
    url: string | null,
    params: Record<string, any>,
    responsefields: Record<string, any>[]
  ) => {
    if (!url) return;

    const tundukUrl = url.replace(/\${(.*?)}/g, (match, placeholder) => {
      return params[placeholder] || match;
    });

    const vehicleData = await tundukVehicleDataFetch(`/api/tunduk`, { model: tundukUrl });
    if (vehicleData?.status !== 0 || vehicleData?.data == null) {
      return;
    }

    responsefields?.map((field) => {
      const formName = getTemplateDocName(field?.path, field?.fieldName);
      const fieldName = field?.fieldName;
      const value = vehicleData?.data?.[0]?.[fieldName] ?? vehicleData?.data?.[0]?.notaryPartner?.[0]?.[fieldName];

      if (value != null && value !== "") {
        dynamicForm.setValue(formName, value);
        dynamicForm.setError(formName, { type: "disabled" });
      }
    });
  };

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
    let data = { ...documentTemplateData };
    if (data?.data == null) {
      data = await getDocumentTemplateData("/api/dictionaries/document-type/template/" + productId);
    }

    data?.data.map((group: Record<string, any>) => {
      group?.fields.map(async (item: Record<string, any>) => {
        if (String(item?.fieldType).toLocaleLowerCase() === "tunduk") {
          const values: Record<string, any> = tundukParamsFieldsForm.getValues();
          if (Object.values(values).some((item) => !item)) return;

          handlePinCheck(item?.url, tundukParamsFieldsForm.getValues(), item?.responseFields);
        }
      });
    });
  });

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <StepperContentStep step={5} title={t("Additional information")} loading={documentTemplateLoading} />

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
                      {String(item?.fieldType).toLocaleLowerCase() === "tunduk" && form.watch("object") === 1 ? (
                        <TundukDynamicFields
                          loading={tundukVehicleDataLoading}
                          form={dynamicForm}
                          paramsForm={tundukParamsFieldsForm}
                          fields={item?.fields}
                          responseFields={tundukVehicleData?.data != null ? item?.responseFields : null}
                          onPinCheck={async (paramsForm) => {
                            const validated = await paramsForm.trigger();
                            if (validated) handlePinCheck(item?.url, paramsForm.getValues(), item?.responseFields);
                          }}
                        />
                      ) : null}

                      <DynamicField
                        type={item?.fieldType}
                        form={dynamicForm}
                        label={item?.fieldTitles?.[locale ?? ""] ?? ""}
                        defaultValue={item?.defaultValue}
                        required={!!item?.required}
                        name={getTemplateDocName(item?.path, item?.fieldName)}
                        selectionName={item?.selection ?? ""}
                      />
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
