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
import { useState } from "react";
import useEffectOnce from "@/hooks/useEffectOnce";

type FieldType = "Boolean" | "Selection" | "Float" | "Decimal" | "Integer" | "String" | "Time" | "DateTime" | "Date";

interface IControlledDynamicComponent {
  type: FieldType;
  form: UseFormReturn<any>;
  name: string;
  defaultValue: FieldPathValue<any, any>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  selectionName?: string;
}

interface IComponentProps {
  form: UseFormReturn<any>;
  field: ControllerRenderProps<any, string>;
  locale: string | undefined;
  errorMessage?: string;
  selectionData?: Record<string, any>[];
  disabled?: boolean;
}

export const getControlledDynamicValue = (field: FieldType, value: any) => {
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

export const getControlledDynamicGroupName = (group: Record<string, any>, locale: string | undefined) => {
  const groupName = group?.groupName === "null" ? "" : group?.groupName ?? "";
  const groupNameLocale = group?.["groupName_" + locale];

  return groupNameLocale ? groupNameLocale : groupName;
};

export const getControlledDynamicName = (
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

export const getValue = (field: FieldType, value: any) => {
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

export const getComponent = (type: FieldType, props: IComponentProps) => {
  const { field, selectionData, errorMessage, disabled, form, locale } = props;
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
        data={selectionData ?? []}
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
  };

  return types[type];
};

export const isEmptyOrNull = (value: string | null) => value === "" || value == null;

const ControlledDynamicComponent: React.FC<IControlledDynamicComponent> = (props) => {
  const { form, type, selectionName, disabled, name, label, defaultValue, required } = props;
  const { locale } = useRouter();
  const t = useTranslations();
  const [selectionData, setSelectionData] = useState([]);
  const { update: selectionUpdate } = useFetch("", "POST");

  useEffectOnce(async () => {
    if (!selectionName) return;
    const data = await selectionUpdate(`/api/dictionaries/selection/${selectionName}`);
    if (data?.data != null) setSelectionData(data?.data);
  }, []);

  return (
    <Controller
      control={form.control}
      name={name}
      defaultValue={defaultValue}
      rules={{ required: required ? "required" : false }}
      render={({ field, fieldState }) => {
        let errorMessage = fieldState.error?.message ? t(fieldState.error.message) : fieldState.error?.message;

        if (["Date", "DateTime", "Time"].includes(type)) {
          if (typeof field.value === "object" && field.value == "Invalid Date") {
            errorMessage = t("invalid format");
          }
        }

        return (
          <Box display="flex" flexDirection="column" gap="10px">
            <Typography>{label}</Typography>
            {getComponent(type, {
              field,
              errorMessage: errorMessage ?? "",
              selectionData,
              disabled,
              form,
              locale,
            })}
          </Box>
        );
      }}
    />
  );
};

export default ControlledDynamicComponent;
