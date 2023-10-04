import { useTranslations } from "next-intl";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  UseFormReturn,
  UseFormTrigger,
} from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, Grid, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Select from "@/components/ui/Select";
import { useRouter } from "next/router";
import DatePicker from "@/components/ui/DatePicker";
import CheckBox from "@/components/ui/Checkbox";
import TimePicker from "@/components/ui/TimePicker";
import DateTimePicker from "@/components/ui/DateTimePicker";
import { useState } from "react";
import StepperContentStep from "@/components/ui/StepperContentStep";
import Vehicle from "@/components/fields/Vehicle";
import { IVehicleSchema } from "@/validator-schemas/vehicle";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  dynamicForm: UseFormReturn<any>;
  onPrev?: Function;
  onNext?: (arg: { step: number | undefined }) => void;
  handleStepNextClick?: Function;
}

interface IDynamicComponentProps {
  field: ControllerRenderProps<any, any>;
  fieldState?: ControllerFieldState;
  locale: string;
  data?: Record<string, any>[];
  errorMessage?: string;
  trigger: UseFormTrigger<any>;
}

const isEmptyOrNull = (value: string | null) => value === "" || value == null;

const getDynamicComponent = (type: keyof typeof types, props: IDynamicComponentProps) => {
  const { locale, field, data, errorMessage, fieldState, trigger } = props;
  const types = {
    String: (
      <Input
        inputType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        helperText={errorMessage}
        onBlur={field.onBlur}
        value={getDynamicValue("String", field.value)}
        onChange={(e) => field.onChange(String(e.target.value))}
      />
    ),
    Float: (
      <Input
        inputType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        type="number"
        helperText={errorMessage}
        onBlur={field.onBlur}
        value={getDynamicValue("Float", field.value)}
        onChange={(e) => field.onChange(parseInt(e.target.value))}
      />
    ),
    Decimal: (
      <Input
        inputType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        type="number"
        helperText={errorMessage}
        onBlur={field.onBlur}
        value={getDynamicValue("Decimal", field.value)}
        onChange={(e) => field.onChange(parseInt(e.target.value))}
      />
    ),
    Integer: (
      <Input
        inputType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        type="number"
        helperText={errorMessage}
        onBlur={field.onBlur}
        value={getDynamicValue("Integer", field.value)}
        onChange={(e) => field.onChange(parseInt(e.target.value))}
      />
    ),
    Selection: (
      <Select
        fullWidth
        selectType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        data={data ?? []}
        labelField={"title_" + locale}
        valueField="value"
        helperText={errorMessage}
        value={field.value == null ? "" : field.value}
        onBlur={field.onBlur}
        onChange={(...event: any[]) => {
          field.onChange(...event);
          trigger(field.name);
        }}
      />
    ),
    Date: (
      <DatePicker
        type={errorMessage ? "error" : field.value ? "success" : "secondary"}
        value={getDynamicValue("Date", field.value)}
        helperText={errorMessage}
        onChange={(...event: any[]) => {
          field.onChange(...event);
          trigger(field.name);
        }}
      />
    ),
    Boolean: <CheckBox checked={!!field.value} {...field} />,
    Time: (
      <TimePicker
        type={errorMessage ? "error" : field.value ? "success" : "secondary"}
        value={getDynamicValue("Time", field.value)}
        helperText={errorMessage}
        onChange={(...event: any[]) => {
          field.onChange(...event);
          trigger(field.name);
        }}
      />
    ),
    DateTime: (
      <DateTimePicker
        type={errorMessage ? "error" : field.value ? "success" : "secondary"}
        value={getDynamicValue("DateTime", field.value)}
        helperText={errorMessage}
        onChange={(...event: any[]) => {
          field.onChange(...event);
          trigger(field.name);
        }}
      />
    ),
  };

  return types[type];
};

const getDynamicValue = (field: keyof typeof types, value: any) => {
  const isDate = value instanceof Date;
  const isInvalidDate = isNaN(new Date(String(value)).getDate());

  const types = {
    Boolean: value,
    Selection: isEmptyOrNull(value) ? null : value,
    Float: isEmptyOrNull(value) ? "" : parseInt(value),
    Decimal: isEmptyOrNull(value) ? "" : parseInt(value),
    Integer: isEmptyOrNull(value) ? "" : parseInt(value),
    String: isEmptyOrNull(value) ? "" : value,
    Date: isDate ? value : isInvalidDate ? null : new Date(String(value)),
    Time: isDate ? value : isInvalidDate ? null : new Date(Date.parse(value)),
    DateTime: isDate ? value : isInvalidDate ? null : new Date(String(value)),
  };

  return types[field];
};

const getDynamicGroupName = (group: Record<string, any>, locale: string | undefined) => {
  const groupName = group?.groupName === "null" ? "" : group?.groupName ?? "";
  const groupNameLocale = group?.["groupName_" + locale];

  return groupNameLocale ? groupNameLocale : groupName;
};

const getDynamicName = (path: string | null, name: string | null) => {
  if (path != null && name != null) {
    const regex = /\b(movable|immovable|notaryOtherPerson|notaryAdditionalPerson|relationships)(?:\.|$)/;
    if (regex.test(path)) {
      const index = 0;
      return `${path}.${index}.${name}`;
    }

    return `${path}.${name}`;
  }

  return name ?? "";
};

export default function FifthStepFields({ form, dynamicForm, onPrev, onNext, handleStepNextClick }: IStepFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();
  const productId = form.watch("product.id");

  const { trigger, control } = dynamicForm;

  const [selectDatas, setSelectDatas] = useState<Record<string, any[]>>({});

  const { update: applicationUpdate, loading } = useFetch("", "PUT");

  const { loading: selectionLoading, update: selectionUpdate } = useFetch("", "POST");
  const { update: tundukVehicleDataFetch, loading: tundukVehicleDataLoading } = useFetch("", "POST");

  const getSelectData = async (data: any) => {
    if (Array.isArray(data) && data.length > 0) {
      const fieldsProps = data.map((group: Record<string, any>) => group?.fields).flat();
      fieldsProps.map(async (item: Record<string, any>) => {
        const fieldName = getDynamicName(item?.path, item?.fieldName);
        const model = item?.selection;

        if (!isEmptyOrNull(fieldName) && !isEmptyOrNull(model)) {
          const { data } = await selectionUpdate(`/api/dictionaries/selection/${model}`);
          setSelectDatas((prev) => {
            return { ...prev, [fieldName]: data };
          });
        }
      });
    }
  };

  const {
    update: getDocumentTemplateData,
    data: documentTemplateData,
    loading: documentTemplateLoading,
  } = useFetch("", "GET");

  const triggerFields = async () => {
    return await trigger();
  };

  useEffectOnce(async () => {
    if (productId != null) {
      const { data } = await getDocumentTemplateData("/api/dictionaries/document-type/template/" + productId);
      getSelectData(data);
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

  const handlePinCheck = async (names: any) => {
    const pin = form.getValues(names?.pin);
    const vehicleData = await tundukVehicleDataFetch(`/api/tunduk/vehicle-data/${pin}`);
    if (vehicleData?.status !== 0 || vehicleData?.data == null) {
      return;
    }

    form.setValue("tundukVehicleIsSuccess", true);

    const notaryPartner = vehicleData?.data?.[0]?.notaryPartner?.[0];

    for (let key in names) {
      const name = names?.[key];
      const value = vehicleData?.data?.[0]?.[name] ?? notaryPartner?.[name];
      if (value != null && value !== names?.notaryLicensePlate) {
        form.setValue(name, value);
        dynamicForm.setValue(name, value);
      }
    }
  };

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
  });

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <StepperContentStep
        step={5}
        title={t("Additional information")}
        loading={documentTemplateLoading || selectionLoading}
      />

      <Box display="flex" flexDirection="column" gap="30px">
        <Vehicle
          disableFields={form.watch("tundukVehicleIsSuccess")}
          form={form}
          onPinCheck={(names: any) => handlePinCheck(names)}
          loading={tundukVehicleDataLoading}
        />
        {documentTemplateData?.data &&
          documentTemplateData?.data.map((group: Record<string, any>, index: number) => (
            <Box display="flex" flexDirection="column" gap="20px" key={index}>
              <Typography variant="h4">{getDynamicGroupName(group, locale)}</Typography>

              <Grid key={index} container spacing={2}>
                {group?.fields
                  ?.sort((a: any, b: any) => Number(a?.sequence ?? 0) - Number(b?.sequence ?? 0))
                  .map((item: Record<string, any>, index: number) => (
                    <Grid
                      item
                      md={item?.elementWidth ?? 12}
                      key={index}
                      width="100%"
                      display="flex"
                      flexDirection="column"
                      justifyContent="end"
                    >
                      <Controller
                        control={control}
                        name={getDynamicName(item?.path, item?.fieldName)}
                        defaultValue={getDynamicValue(item?.fieldType, item?.defaultValue)}
                        rules={{ required: !!item?.required ? "required" : false }}
                        render={({ field, fieldState }) => {
                          let errorMessage = fieldState.error?.message
                            ? t(fieldState.error.message)
                            : fieldState.error?.message;

                          if (["Date", "DateTime", "Time"].includes(item.fieldType)) {
                            if (typeof field.value === "object" && field.value == "Invalid Date") {
                              errorMessage = t("invalid format");
                            }
                          }
                          const data = Array.isArray(selectDatas[getDynamicName(item?.path, item?.fieldName)])
                            ? selectDatas[getDynamicName(item?.path, item?.fieldName)]
                            : [];

                          return (
                            <Box display="flex" flexDirection="column" gap="10px">
                              <Typography>{item?.fieldTitles?.[locale ?? ""] ?? ""}</Typography>
                              {getDynamicComponent(item.fieldType, {
                                locale: locale ?? "ru",
                                field,
                                fieldState,
                                errorMessage,
                                data,
                                trigger,
                              })}
                            </Box>
                          );
                        }}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          ))}
      </Box>

      {!documentTemplateLoading && !selectionLoading && (
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
