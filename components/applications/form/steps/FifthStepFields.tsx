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
import { parse } from "date-fns";
import TimePicker from "@/components/ui/TimePicker";
import DateTimePicker from "@/components/ui/DateTimePicker";

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
        value={field.value}
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
        value={field.value}
        onChange={(...event: any[]) => {
          field.onChange(...event);
          trigger(field.name);
        }}
      />
    ),
    DateTime: (
      <DateTimePicker
        type={errorMessage ? "error" : field.value ? "success" : "secondary"}
        value={field.value}
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
    Float: value,
    Decimal: value,
    Integer: value,
    Boolean: value,
    Selection: value,
    String: value == null ? "" : value,
    Date: value == null ? new Date() : new Date(String(value)),
    Time: value == null ? parse("00:00", "HH:mm", new Date()) : parse(String(value), "HH:mm", new Date()),
    DateTime: value == null ? new Date() : new Date(String(value)),
  };

  return types?.[field] ? types[field] : "";
};

const getDynamicDefaultGroupName = (name: string) => (name === "null" ? "" : name ?? "");

export default function SixthStepFields({ form, dynamicForm, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();
  const { trigger, control } = dynamicForm;
  const productId = form.watch("product.id");

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const { update, data: documentTemplateData } = useFetch("", "GET");

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
    if (onNext != null && validated) onNext();
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
                  {group?.fields?.map((item: Record<string, any>, index: number) => {
                    let name = item?.fieldName ?? "";
                    if (item?.path != null) name = `${item.path}.${item.fieldName}`;

                    return (
                      <Grid item md={12} key={index}>
                        <Controller
                          control={control}
                          name={name}
                          defaultValue={getDynamicDefaultValue(item?.fieldType, item?.defaultValue)}
                          rules={{ required: !!item?.required ? "required" : false }}
                          render={({ field, fieldState }) => {
                            const errorMessage = fieldState.error?.message
                              ? t(fieldState.error?.message)
                              : fieldState.error?.message;

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
                    );
                  })}
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
