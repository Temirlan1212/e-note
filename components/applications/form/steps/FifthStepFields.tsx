import { useTranslations } from "next-intl";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  UseFormReturn,
  UseFormTrigger,
  useForm,
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
import { parse } from "date-fns";
import TimePicker from "@/components/ui/TimePicker";
import DateTimePicker from "@/components/ui/DateTimePicker";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
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

type DynamicComponentTypes =
  | "String"
  | "Float"
  | "Decimal"
  | "Integer"
  | "Selection"
  | "Time"
  | "Date"
  | "Boolean"
  | "DateTime";

const getDynamicComponent = (type: DynamicComponentTypes, props: IDynamicComponentProps) => {
  const { locale, field, data, errorMessage, trigger } = props;

  const componentTypes = {
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
        value={field.value == "" ? null : field.value}
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
        value={field.value == "" ? null : field.value}
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
        value={field.value == "" ? null : field.value}
        helperText={errorMessage}
        onChange={(...event: any[]) => {
          field.onChange(...event);
          trigger(field.name);
        }}
      />
    ),
  };

  return componentTypes[type];
};

const getDynamicDefaultValue = (field: DynamicComponentTypes, value: any) => {
  const types: Record<DynamicComponentTypes, any> = {
    Float: !value ? null : value,
    Decimal: !value ? null : value,
    Integer: !value ? null : value,
    Boolean: value,
    Selection: !value ? null : value,
    String: !value ? "" : value,
    Date: value ? null : new Date(String(value)),
    Time: value ? null : parse(String(value), "HH:mm", new Date()),
    DateTime: value ? null : new Date(String(value)),
  };

  return types?.[field] ? types[field] : "";
};

const getDynamicDefaultGroupName = (name: string) => (name === "null" ? "" : name ?? "");

export default function FifthStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();
  const productId = form.watch("product.id");

  const dynamicForm = useForm({
    mode: "onTouched",
  });

  const { trigger, control } = dynamicForm;

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const { update, data: documentTemplateData } = useFetch("", "GET");
  const { update: applicationUpdate } = useFetch("", "POST");

  const triggerFields = async () => {
    return await trigger();
  };

  useEffectOnce(async () => {
    if (productId != null) {
      update("/api/dictionaries/document-type/template/" + productId);
    }
  }, [productId]);

  const handleNextClick = async () => {
    const validated = await triggerFields();
    const { setValue, getValues } = form;

    if (validated && onNext) {
      const values = getValues();
      const data: Partial<IApplicationSchema> = {
        id: values.id,
        version: values.version,
        ...dynamicForm.getValues(),
      };

      const result = await applicationUpdate(`/api/applications/update/${values.id}`, data);
      if (result != null && result.data != null && result.data[0]?.id != null) {
        setValue("id", result.data[0].id);
        setValue("version", result.data[0].version);
        onNext();
      }
    }
  };

  return (
    <Box>
      <Box display="flex" gap="30px" flexDirection="column">
        <Box display="flex" flexDirection="column" gap="30px">
          {documentTemplateData?.data &&
            documentTemplateData?.data.map((group: Record<string, any>, index: number) => (
              <Box display="flex" flexDirection="column" gap="20px" key={index}>
                <Typography variant="h4">
                  {group?.["groupName_" + locale]
                    ? group?.["groupName_" + locale]
                    : getDynamicDefaultGroupName(group?.groupName)}
                </Typography>

                <Grid key={index} container spacing={2}>
                  {group?.fields?.map((item: Record<string, any>, index: number) => (
                    <Grid item md={12} key={index}>
                      <Controller
                        control={control}
                        name={item?.path != null ? `${item.path}.${item.fieldName}` : item?.fieldName ?? ""}
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

                          let data: Record<string, any>[] = [];
                          const { data: selectionData } = useFetch(
                            `/api/dictionaries/selection/${item.selection}`,
                            "POST"
                          );

                          if (selectionData?.data != null) {
                            data = selectionData.data;
                          }

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
            <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />}>
              {t("Prev")}
            </Button>
          )}
          <Button onClick={handleNextClick} endIcon={<ArrowForwardIcon />}>
            {t("Next")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
