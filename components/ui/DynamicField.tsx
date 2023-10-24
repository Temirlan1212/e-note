import { Controller, ControllerRenderProps, FieldPathValue, UseFormReturn } from "react-hook-form";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import Checkbox from "@/components/ui/Checkbox";
import DateTimePicker from "@/components/ui/DateTimePicker";
import { Box, BoxProps, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import useFetch from "@/hooks/useFetch";
import { Dispatch, HTMLAttributes, SetStateAction, useState } from "react";
import useEffectOnce from "@/hooks/useEffectOnce";
import Radio from "./Radio";
import { Subscription } from "react-hook-form/dist/utils/createSubject";
import Button from "./Button";

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
  | "Radio"
  | "Button";

export type TCondition = Record<string, any>[] | Record<string, any>;

export type TConditions = {
  hidden: TCondition;
  disabled: TCondition;
  required: TCondition;
  show: TCondition;
};

export interface IDynamicFieldProps extends HTMLAttributes<HTMLElement> {
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
  observableForms?: UseFormReturn<any>[];
  props?: {
    box?: BoxProps;
  };
  loading?: boolean;
}

export const getName = (path: string | undefined, name: string | null, regex: RegExp = /\[([^\]]*)\]/g) => {
  if (!!path && name != null) {
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
    Button: null,
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
    loading?: boolean;
    label?: string;
  }
) => {
  const { field, selectionData, errorMessage, disabled, form, locale, options, loading, label } = props;
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
    Button: (
      <Button loading={loading} sx={{ flex: 0, minWidth: "auto", padding: "8px 16px" }}>
        {label}
      </Button>
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

export const getConditionRuleValue = (condition: TCondition, form: UseFormReturn<any>, path?: string) => {
  if (!condition) return false;
  let isNull = false;
  const value = !!condition?.some((item: Record<string, any>[] | Record<string, any>) => {
    if (Array.isArray(item)) {
      return item.every((subItem) => {
        const conditionValue = form.getValues(
          getName(subItem?.path != null ? subItem?.path : path, subItem?.fieldName)
        );
        if (conditionValue != null) return compare(conditionValue, subItem?.value, subItem?.operator);
        isNull = true;
      });
    } else {
      const conditionValue = form.getValues(getName(item?.path != null ? item?.path : path, item?.fieldName));
      if (conditionValue != null) return compare(conditionValue, item?.value, item?.operator);
      isNull = true;
    }
  });
  if (isNull) return null;
  return value;
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
    observableForms,
    loading,
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

  const handleConditions = (
    form: UseFormReturn<any>,
    conditions: Partial<TConditions>,
    callback: Dispatch<SetStateAction<typeof rules>>
  ) => {
    for (let i in conditions) {
      const key = i as keyof typeof conditions;
      const condition = conditions?.[key];
      if (condition == null) continue;
      const value = getConditionRuleValue(condition, form, path);
      if (value == null) continue;

      callback((prev) => {
        return { ...prev, [key]: value };
      });
    }
  };

  useEffectOnce(() => {
    let subs: Subscription[] = [];

    if (conditions == null) return;

    const observeForm = observableForms == null ? [form] : observableForms;
    observeForm?.map((form) => {
      handleConditions(form, conditions, setRules);

      const subscription = form.watch(() => {
        handleConditions(form, conditions, setRules);
      });

      subs.push(subscription);
    });

    return () => subs.map((form) => form.unsubscribe());
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
          <Box
            display={rules.show ? "flex" : rules.hidden ? "none" : "flex"}
            flexDirection="column"
            gap="10px"
            {...rest?.props?.box}
            {...rest}
          >
            {type !== "Button" ? <Typography>{label}</Typography> : null}
            {getField(type, {
              field,
              errorMessage: fieldState.error?.type !== "disabled" ? errorMessage ?? "" : "",
              selectionData,
              disabled: rules?.disabled || fieldState.error?.type === "disabled",
              form,
              locale,
              loading,
              label,
              ...rest,
            })}
          </Box>
        );
      }}
    />
  );
};

export default DynamicField;
