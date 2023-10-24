import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { Box, Grid, Paper } from "@mui/material";
import { useRouter } from "next/router";
import DynamicField, { IDynamicFieldProps, TConditions } from "@/components/ui/DynamicField";

export interface ITundukDynamicFieldsProps {
  form: UseFormReturn<any>;
  paramsForm: UseFormReturn<any>;
  fields?: IDynamicFieldProps[];
  responseFields?: IDynamicFieldProps[];
  path?: string;
  disabled?: boolean;
  required?: boolean;
  hidden?: boolean;
  conditions?: Partial<TConditions>;
  loading?: boolean;
  onPinCheck?: (arg: UseFormReturn<any>) => void;
  onPinReset?: () => void;
}

export default function TundukDynamicFields({
  form,
  paramsForm,
  fields,
  responseFields,
  loading,
  onPinCheck,
  onPinReset,
  ...rest
}: ITundukDynamicFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();

  return (
    <Box display="flex" gap="10px" flexDirection="column" width="100%">
      {fields != null &&
        fields
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
              <DynamicField
                disabled={rest?.disabled || item?.readonly}
                hidden={rest?.hidden || item?.hidden}
                required={!!rest?.required || !!item?.required}
                conditions={Object.values(rest?.conditions ?? {}).length > 0 ? rest?.conditions : item?.conditions}
                path={rest?.path || item?.path}
                type={item?.fieldType}
                form={paramsForm}
                label={item?.fieldTitles?.[locale ?? ""] ?? ""}
                defaultValue={item?.defaultValue}
                fieldName={item?.fieldName}
                selectionName={item?.selection ?? ""}
                options={item?.options}
                observableForms={[form, paramsForm]}
                loading={loading}
                onClick={() => {
                  if (item?.fieldType === "Button" && onPinCheck) onPinCheck(paramsForm);
                }}
              />
            </Grid>
          ))}

      {responseFields != null && (
        <Box>
          {responseFields
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
                gap="0px"
              >
                <DynamicField
                  disabled={rest?.disabled || item?.readonly}
                  hidden={rest?.hidden || item?.hidden}
                  required={!!rest?.required || !!item?.required}
                  conditions={Object.values(rest?.conditions ?? {}).length > 0 ? rest?.conditions : item?.conditions}
                  type={item?.fieldType}
                  form={form}
                  label={item?.fieldTitles?.[locale ?? ""] ?? ""}
                  defaultValue={item?.defaultValue}
                  fieldName={item?.fieldName}
                  path={rest?.path || item?.path}
                  selectionName={item?.selection ?? ""}
                  props={{ box: { mb: "10px" } }}
                />
              </Grid>
            ))}
        </Box>
      )}
    </Box>
  );
}
