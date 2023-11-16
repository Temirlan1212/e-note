import { UseFormReturn } from "react-hook-form";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import DynamicFormElement, { IDynamicFormElementProps, TConditions } from "@/components/ui/DynamicFormElement";

export interface IRequestDynamicFieldProps {
  form: UseFormReturn<any>;
  paramsForm: UseFormReturn<any>;
  fields?: IDynamicFormElementProps[];
  responseFields?: IDynamicFormElementProps[];
  path?: string;
  disabled?: boolean;
  isPermanentDisabled?: boolean;
  required?: boolean;
  hidden?: boolean;
  conditions?: Partial<TConditions>;
  loading?: boolean;
  onPinCheck?: (arg: UseFormReturn<any>) => void;
  onPinReset?: () => void;
}

export default function RequestDynamicField({
  form,
  paramsForm,
  fields,
  responseFields,
  loading,
  isPermanentDisabled,
  onPinCheck,
  onPinReset,
  ...rest
}: IRequestDynamicFieldProps) {
  const { locale } = useRouter();

  return (
    <Grid container spacing={2} mb="40px">
      {fields != null &&
        fields
          ?.sort((a: any, b: any) => Number(a?.sequence ?? 0) - Number(b?.sequence ?? 0))
          .map((item: Record<string, any>, index: number) => (
            <Grid item md={item?.elementWidth ?? 12} key={index} width="100%">
              <DynamicFormElement
                disabled={
                  isPermanentDisabled
                    ? isPermanentDisabled
                    : item?.readonly != null
                    ? !!item?.readonly
                    : !!rest?.disabled
                }
                hidden={item?.hidden != null ? !!item?.hidden : !!rest?.hidden}
                required={item?.required != null ? !!item?.required : !!rest?.required}
                conditions={Object.values(item?.conditions ?? {}).length > 0 ? item?.conditions : rest?.conditions}
                path={rest?.path || item?.path}
                type={item?.fieldType}
                form={paramsForm}
                label={item?.fieldLabels?.[locale ?? ""] ?? ""}
                title={item?.fieldTitles?.[locale ?? ""] ?? ""}
                defaultValue={item?.defaultValue}
                fieldName={item?.fieldName}
                selectionName={item?.selection ?? ""}
                objectName={item?.object ?? ""}
                options={item?.options}
                observableForms={[form, paramsForm]}
                loading={item?.actionType?.toLowerCase() === "reset" ? false : loading}
                color={item?.color}
                onClick={() => {
                  if (item?.actionType?.toLowerCase() === "confirm" && onPinCheck) onPinCheck(paramsForm);
                  if (item?.actionType?.toLowerCase() === "reset" && onPinReset) onPinReset();
                }}
                props={{ box: { mb: "10px" } }}
              />
            </Grid>
          ))}

      {responseFields != null &&
        responseFields
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
              paddingTop="0px !important"
            >
              <DynamicFormElement
                disabled={
                  isPermanentDisabled
                    ? isPermanentDisabled
                    : item?.readonly != null
                    ? !!item?.readonly
                    : !!rest?.disabled
                }
                hidden={item?.hidden != null ? !!item?.hidden : !!rest?.hidden}
                required={item?.required != null ? !!item?.required : !!rest?.required}
                conditions={Object.values(item?.conditions ?? {}).length > 0 ? item?.conditions : rest?.conditions}
                type={item?.fieldType}
                form={form}
                label={item?.fieldLabels?.[locale ?? ""] ?? ""}
                title={item?.fieldTitles?.[locale ?? ""] ?? ""}
                defaultValue={item?.defaultValue}
                fieldName={item?.fieldName}
                path={rest?.path || item?.path}
                selectionName={item?.selection ?? ""}
                objectName={item?.object ?? ""}
                props={{ box: { mb: "10px" } }}
              />
            </Grid>
          ))}
    </Grid>
  );
}
