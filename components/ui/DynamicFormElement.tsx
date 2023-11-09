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
import Radio from "@/components/ui/Radio";
import { Subscription } from "react-hook-form/dist/utils/createSubject";
import Button from "@/components/ui/Button";
import Autocomplete from "@/components/ui/Autocomplete";

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
  | "Button"
  | "Object";

export type TCondition = Record<string, any>[][] | Record<string, any>[];

export type TConditions = {
  hidden: TCondition;
  disabled: TCondition;
  required: TCondition;
  show: TCondition;
};

export interface IDynamicFormElementProps extends HTMLAttributes<HTMLElement> {
  type: Variant;
  form: UseFormReturn<any>;
  fieldName: string;
  defaultValue: FieldPathValue<any, any>;
  label?: string;
  title?: string;
  required?: boolean;
  disabled?: boolean;
  selectionName?: string;
  objectName?: string;
  path?: string;
  hidden?: boolean;
  conditions?: Partial<TConditions>;
  options?: Record<string, any>[];
  observableForms?: UseFormReturn<any>[];
  loading?: boolean;
  color?: string;
  props?: {
    box?: BoxProps;
  };
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
    Object: isEmptyOrNull(value) ? null : value,
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
    optionsData?: Record<string, any>[];
    disabled?: boolean;
    options?: Record<string, any>[];
    loading?: boolean;
    label?: string;
    color?: string;
  }
) => {
  const { field, optionsData, errorMessage, disabled, form, locale, options, loading, label, color } = props;
  const { trigger } = form;

  const types = {
    String: (
      <Input
        label={label}
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
        label={label}
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
        label={label}
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
        label={label}
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
        label={label}
        fullWidth
        selectType={errorMessage ? "error" : field.value ? "success" : "secondary"}
        data={optionsData && optionsData?.length > 0 ? optionsData : options ?? []}
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
        label={label}
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
    Boolean: <Checkbox label={label} checked={!!field.value} disabled={disabled} {...field} />,
    Time: (
      <TimePicker
        label={label}
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
        label={label}
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
        data={optionsData && optionsData?.length > 0 ? optionsData : options ?? []}
        {...field}
        value={getValue("Radio", field.value)}
      />
    ),
    Object: (
      <Autocomplete
        labelField={locale !== "en" ? "$t:name" : "name"}
        type={errorMessage ? "error" : field.value ? "success" : "secondary"}
        helperText={errorMessage}
        disabled={disabled}
        options={optionsData && optionsData?.length > 0 ? optionsData : options ?? []}
        loading={loading}
        value={
          field.value != null
            ? (optionsData ?? []).find((item: Record<string, any>) => item.id == field.value?.id) ?? null
            : null
        }
        onBlur={field.onBlur}
        onChange={(event, value) => {
          field.onChange(
            value?.id != null
              ? {
                  id: value.id,
                }
              : null
          );
          trigger(field.name);
        }}
      />
    ),
    Button: (
      <Button
        disabled={disabled}
        buttonType={(color as any) ?? "primary"}
        loading={loading}
        sx={{ flex: 0, minWidth: "auto", padding: "8px 16px" }}
      >
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

const getConditionRuleValue = (condition: TCondition, form: UseFormReturn<any>, path?: string) => {
  const getConditionValue = (item: Record<string, any>[] | Record<string, any>): boolean | undefined => {
    if (Array.isArray(item)) {
      return item
        .map((subItem) => {
          const value = form.getValues(getName(subItem?.path == null ? path : subItem?.path, subItem?.fieldName));
          if (value === undefined) return undefined;
          return compare(value, subItem?.value, subItem?.operator);
        })
        .filter((item) => item !== undefined)
        .every((item) => !!item);
    } else {
      const value = form.getValues(getName(item?.path == null ? path : item?.path, item?.fieldName));
      if (value === undefined) return undefined;
      return compare(value, item?.value, item?.operator);
    }
  };

  const res = condition?.map(getConditionValue).filter((item) => item !== undefined);
  return res?.length > 0 ? res.some((item) => !!item) : null;
};

const DynamicFormElement: React.FC<IDynamicFormElementProps> = (props) => {
  const {
    form,
    type,
    selectionName,
    disabled,
    fieldName,
    defaultValue,
    required,
    path,
    hidden,
    conditions,
    observableForms,
    loading,
    title,
    objectName,
    ...rest
  } = props;

  const { update: selectionUpdate } = useFetch("", "POST");

  const { locale } = useRouter();
  const t = useTranslations();

  const [optionsData, setOptionsData] = useState([]);
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
      subs.push(form.watch(() => handleConditions(form, conditions, setRules)));
    });

    return () => subs.map((form) => form.unsubscribe());
  }, [form.watch]);

  useEffectOnce(async () => {
    if (!selectionName && !objectName) return;
    const url = `/api/dictionaries/${selectionName ? `selection/${selectionName}` : `rest/${objectName}`}`;
    const data = await selectionUpdate(url);
    if (data?.data != null) setOptionsData(data?.data);
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
            {!!title ? <Typography>{title}</Typography> : null}
            {getField(type, {
              field,
              errorMessage: fieldState.error?.type !== "disabled" ? errorMessage ?? "" : "",
              optionsData,
              disabled: rules?.disabled || fieldState.error?.type === "disabled",
              form,
              locale,
              loading,
              ...rest,
            })}
          </Box>
        );
      }}
    />
  );
};

export default DynamicFormElement;
