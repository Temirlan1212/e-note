import { Controller, ControllerRenderProps, FieldPathValue, UseFormReturn } from "react-hook-form";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import Checkbox from "@/components/ui/Checkbox";
import DateTimePicker from "@/components/ui/DateTimePicker";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import useFetch from "@/hooks/useFetch";
import { Dispatch, SetStateAction, useState } from "react";
import useEffectOnce from "@/hooks/useEffectOnce";
import Radio from "./Radio";

export type Variant =
  | "Boolean"
  | "Selection"
  | "Float"
  | "Decimal"
  | "Integer"
  | "String"
  | "Time"
  | "DateTime"
  | "Date"
  | "Radio";

export type TCondition = Record<string, any>[] | Record<string, any>;

export type TConditions = {
  hidden: TCondition;
  disabled: TCondition;
  required: TCondition;
  show: TCondition;
};

export interface IDynamicFieldProps {
  type: Variant;
  form: UseFormReturn<any>;
  fieldName: string;
  defaultValue: FieldPathValue<any, any>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  selectionName?: string;
  path?: string;
  hidden?: boolean;
  conditions?: Partial<TConditions>;
  options?: Record<string, any>[];
}

export const getName = (path: string | undefined, name: string | null, regex: RegExp = /\[([^\]]*)\]/g) => {
  if (path != null && name != null) {
    if (regex.test(path)) {
      const index = 0;
      return path.replace(regex, (_, capture) => `${capture}.${index}.${name}`);
    }

    return `${path}.${name}`;
  }

  return name ?? "";
};

const getValue = (field: Variant, value: any) => {
  const isDate = value instanceof Date;
  const isInvalidDate = isNaN(new Date(String(value)).getDate());

  const types = {
    Boolean: value,
    Selection: isEmptyOrNull(value) ? null : value,
    Float: isEmptyOrNull(value) ? "" : parseInt(value),
    Decimal: isEmptyOrNull(value) ? "" : parseInt(value),
    Integer: isEmptyOrNull(value) ? "" : parseInt(value),
    String: isEmptyOrNull(value) ? "" : value,
    Radio: isEmptyOrNull(value) ? "" : value,
    Date: isDate ? value : isInvalidDate ? null : new Date(String(value)),
    Time: isDate ? value : isInvalidDate ? null : new Date(Date.parse(value)),
    DateTime: isDate ? value : isInvalidDate ? null : new Date(String(value)),
  };

  return types[field];
};

const getField = (
  type: Variant,
  props: {
    form: UseFormReturn<any>;
    field: ControllerRenderProps<any, string>;
    locale: string | undefined;
    errorMessage?: string;
    selectionData?: Record<string, any>[];
    disabled?: boolean;
    options?: Record<string, any>[];
  }
) => {
  const { field, selectionData, errorMessage, disabled, form, locale, options } = props;
  const { trigger } = form;

  const types = {
    String: (
      <Input
        inputType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        helperText={errorMessage}
        onBlur={field.onBlur}
        value={getValue("String", field.value)}
        onChange={(e) => field.onChange(String(e.target.value))}
        disabled={disabled}
      />
    ),
    Float: (
      <Input
        inputType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        type="number"
        helperText={errorMessage}
        onBlur={field.onBlur}
        value={getValue("Float", field.value)}
        onChange={(e) => field.onChange(parseInt(e.target.value))}
        disabled={disabled}
      />
    ),
    Decimal: (
      <Input
        inputType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        type="number"
        helperText={errorMessage}
        onBlur={field.onBlur}
        value={getValue("Decimal", field.value)}
        onChange={(e) => field.onChange(parseInt(e.target.value))}
        disabled={disabled}
      />
    ),
    Integer: (
      <Input
        inputType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        type="number"
        helperText={errorMessage}
        onBlur={field.onBlur}
        value={getValue("Integer", field.value)}
        onChange={(e) => field.onChange(parseInt(e.target.value))}
        disabled={disabled}
      />
    ),
    Selection: (
      <Select
        fullWidth
        selectType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        data={selectionData && selectionData?.length > 0 ? selectionData : options ?? []}
        labelField={"title_" + locale}
        valueField="value"
        helperText={errorMessage}
        value={field.value == null ? "" : field.value}
        onBlur={field.onBlur}
        onChange={(...event: any[]) => {
          field.onChange(...event);
          trigger(field.name);
        }}
        disabled={disabled}
      />
    ),
    Date: (
      <DatePicker
        type={errorMessage ? "error" : field.value ? "success" : "secondary"}
        value={getValue("Date", field.value)}
        helperText={errorMessage}
        onChange={(...event: any[]) => {
          field.onChange(...event);
          trigger(field.name);
        }}
        disabled={disabled}
      />
    ),
    Boolean: <Checkbox checked={!!field.value} {...field} />,
    Time: (
      <TimePicker
        type={errorMessage ? "error" : field.value ? "success" : "secondary"}
        value={getValue("Time", field.value)}
        helperText={errorMessage}
        onChange={(...event: any[]) => {
          field.onChange(...event);
          trigger(field.name);
        }}
        disabled={disabled}
      />
    ),
    DateTime: (
      <DateTimePicker
        type={errorMessage ? "error" : field.value ? "success" : "secondary"}
        value={getValue("DateTime", field.value)}
        helperText={errorMessage}
        onChange={(...event: any[]) => {
          field.onChange(...event);
          trigger(field.name);
        }}
        disabled={disabled}
      />
    ),
    Radio: (
      <Radio
        labelField={"title_" + locale}
        valueField="value"
        row
        type={errorMessage ? "error" : field.value ? "success" : "secondary"}
        helperText={errorMessage}
        data={selectionData && selectionData?.length > 0 ? selectionData : options ?? []}
        {...field}
        value={getValue("Radio", field.value)}
      />
    ),
  };

  return types[type];
};

const isEmptyOrNull = (value: string | null) => value === "" || value == null;

const compare = (a: any, b: any, operator: keyof typeof operators) => {
  const operators = {
    "==": a == b,
    "!=": a != b,
    "===": a === b,
    "!==": a !== b,
    "<": a < b,
    ">": a > b,
    "<=": a <= b,
    ">=": a >= b,
  };

  return operators?.[operator] ? operators[operator] : false;
};

const getConditionRuleValue = (condition: TCondition, form: UseFormReturn<any>, path?: string) => {
  if (!condition) return false;
  return !!condition?.some((item: Record<string, any>[] | Record<string, any>) =>
    Array.isArray(item)
      ? item.every((subItem) => form.getValues(getName(subItem?.path ?? path, subItem?.fieldName)))
      : compare(form.getValues(getName(item?.path ?? path, item?.fieldName)), item?.value, item?.operator)
  );
};

const DynamicField: React.FC<IDynamicFieldProps> = (props) => {
  const {
    form,
    type,
    selectionName,
    disabled,
    fieldName,
    label,
    defaultValue,
    required,
    path,
    hidden,
    conditions,
    ...rest
  } = props;

  const { update: selectionUpdate } = useFetch("", "POST");

  const { locale } = useRouter();
  const t = useTranslations();

  const [selectionData, setSelectionData] = useState([]);
  const [rules, setRules] = useState({
    hidden: Boolean(hidden),
    disabled: Boolean(disabled),
    required: Boolean(required),
    show: Boolean(false),
  });

  const handleConditions = (conditions: Partial<TConditions>, callback: Dispatch<SetStateAction<typeof rules>>) => {
    for (let i in conditions) {
      const key = i as keyof typeof conditions;
      const condition = conditions?.[key];
      if (condition == null) continue;

      callback((prev) => {
        return { ...prev, [key]: getConditionRuleValue(condition, form, path) };
      });
    }
  };

  useEffectOnce(() => {
    if (conditions == null) return;
    handleConditions(conditions, setRules);

    const subscription = form.watch(() => {
      handleConditions(conditions, setRules);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  useEffectOnce(async () => {
    if (!selectionName) return;
    const data = await selectionUpdate(`/api/dictionaries/selection/${selectionName}`);
    if (data?.data != null) setSelectionData(data?.data);
  }, []);

  return (
    <Controller
      control={form.control}
      name={getName(path, fieldName)}
      defaultValue={getValue(type, defaultValue)}
      rules={{ required: rules.required ? "required" : false }}
      render={({ field, fieldState }) => {
        let errorMessage = fieldState.error?.message ? t(fieldState.error.message) : fieldState.error?.message ?? "";

        if (["Date", "DateTime", "Time"].includes(type)) {
          if (typeof field.value === "object" && field.value == "Invalid Date") {
            errorMessage = t("invalid format");
          }
        }

        return (
          <Box display={rules.show ? "flex" : rules.hidden ? "none" : "flex"} flexDirection="column" gap="10px">
            <Typography>{label}</Typography>
            {getField(type, {
              field,
              errorMessage: fieldState.error?.type !== "disabled" ? errorMessage ?? "" : "",
              selectionData,
              disabled: rules?.disabled || fieldState.error?.type === "disabled",
              form,
              locale,
              ...rest,
            })}
          </Box>
        );
      }}
    />
  );
};

export default DynamicField;
