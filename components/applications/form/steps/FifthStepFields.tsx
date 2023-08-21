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
import { Box, Grid, InputLabel, Typography } from "@mui/material";
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

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  dynamicForm: UseFormReturn<any>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

interface IDynamicComponentProps {
  field: ControllerRenderProps<any, any>;
  fieldState?: ControllerFieldState;
  locale: string;
  data?: Record<string, any>[];
  errorMessage?: string;
  trigger: UseFormTrigger<any>;
}

const getDynamicComponent = (type: keyof typeof types, props: IDynamicComponentProps) => {
  const { locale, field, data, errorMessage, fieldState, trigger } = props;
  const types = {
    String: (
      <Input
        inputType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        helperText={errorMessage}
        {...field}
      />
    ),
    Float: (
      <Input
        inputType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        type="number"
        helperText={errorMessage}
        {...field}
      />
    ),
    Decimal: (
      <Input
        inputType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        type="number"
        helperText={errorMessage}
        {...field}
      />
    ),
    Integer: (
      <Input
        inputType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        type="number"
        helperText={errorMessage}
        {...field}
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
        value={getDateDynamicValue("Date", field.value)}
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
        value={getDateDynamicValue("Time", field.value)}
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
        value={getDateDynamicValue("DateTime", field.value)}
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

const getDynamicDefaultValue = (field: keyof typeof types, value: any) => {
  const isInvalidDate = isNaN(new Date(String(value)).getDate());

  const types = {
    Float: !value ? null : value,
    Decimal: !value ? null : value,
    Integer: !value ? null : value,
    Boolean: value,
    Selection: !value ? null : value,
    String: !value ? "" : value,
    Date: isInvalidDate ? null : new Date(String(value)),
    Time: isInvalidDate ? null : new Date(Date.parse(value)),
    DateTime: isInvalidDate ? null : new Date(String(value)),
  };

  return types[field];
};

const getDateDynamicValue = (field: keyof typeof types, value: any) => {
  const isDate = value instanceof Date;
  const isInvalidDate = isNaN(new Date(String(value)).getDate());

  const types = {
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
    const regex = /\b(movable|immovable|notaryOtherPerson|notaryAdditionalPerson)(?:\.|$)/;
    if (regex.test(path)) {
      const index = 0;
      return `${path}.${index}.${name}`;
    }

    return `${path}.${name}`;
  }

  return name ?? "";
};

export default function FifthStepFields({ form, dynamicForm, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();
  const productId = form.watch("product.id");

  const { trigger, control } = dynamicForm;

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const [selectDatas, setSelectDatas] = useState<Record<string, any[]>>({});

  const { update: applicationUpdate, loading } = useFetch("", "PUT");

  const { loading: selectionLoading, update: selectionUpdate } = useFetch("", "POST");

  const getSelectData = async (data: any) => {
    if (Array.isArray(data) && data.length > 0) {
      const fieldsProps = data.map((group: Record<string, any>) => group?.fields).flat();
      fieldsProps.map(async (item: Record<string, any>) => {
        const fieldName = getDynamicName(item?.path, item?.fieldName);
        const model = item?.selection;

        if (!!fieldName && !!model) {
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

  const handleNextClick = async () => {
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
        onNext();
      }
    }
  };

  if (documentTemplateLoading && selectionLoading) return <></>;

  return (
    <Box>
      <Box display="flex" gap="30px" flexDirection="column">
        <Box display="flex" flexDirection="column" gap="30px">
          {documentTemplateData?.data &&
            documentTemplateData?.data.map((group: Record<string, any>, index: number) => (
              <Box display="flex" flexDirection="column" gap="20px" key={index}>
                <Typography variant="h4">{getDynamicGroupName(group, locale)}</Typography>

                <Grid key={index} container spacing={2}>
                  {group?.fields?.map((item: Record<string, any>, index: number) => (
                    <Grid item md={12} key={index}>
                      <Controller
                        control={control}
                        name={getDynamicName(item?.path, item?.fieldName)}
                        defaultValue={getDynamicDefaultValue(item?.fieldType, item?.defaultValue)}
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
                              <InputLabel>{item?.fieldTitles?.[locale ?? ""] ?? ""}</InputLabel>
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

        <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
          {onPrev != null && (
            <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />} sx={{ width: "auto" }}>
              {t("Prev")}
            </Button>
          )}
          <Button loading={loading} onClick={handleNextClick} endIcon={<ArrowForwardIcon />} sx={{ width: "auto" }}>
            {t("Next")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
