import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { Box, Grid, Paper } from "@mui/material";
import Button from "@/components/ui/Button";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import { useRouter } from "next/router";
import DynamicField, { IDynamicFieldProps } from "@/components/ui/DynamicField";

export interface ITundukDynamicFieldsProps {
  form: UseFormReturn<any>;
  paramsForm: UseFormReturn<any>;
  fields?: IDynamicFieldProps[];
  responseFields?: IDynamicFieldProps[];
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
}: ITundukDynamicFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();

  return (
    <Box display="flex" gap="20px" flexDirection="column" width="100%">
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
                disabled={item?.readonly}
                hidden={item?.hidden}
                required={!!item?.required}
                type={item?.fieldType}
                conditions={item?.conditions}
                form={paramsForm}
                label={item?.fieldTitles?.[locale ?? ""] ?? ""}
                defaultValue={item?.defaultValue}
                fieldName={item?.fieldName}
                path={item?.path}
                selectionName={item?.selection ?? ""}
                options={item?.options}
              />
            </Grid>
          ))}

      <Box display="flex" gap="20px">
        {onPinCheck && fields != null && (
          <Button
            loading={loading}
            endIcon={<ContentPasteSearchIcon />}
            sx={{ flex: 0, minWidth: "auto", padding: "8px 16px" }}
            onClick={() => onPinCheck(paramsForm)}
          >
            {t("Check")}
          </Button>
        )}
        {onPinReset && fields != null && (
          <Button
            loading={loading}
            sx={{ flex: 0, minWidth: "auto", padding: "8px 16px" }}
            onClick={() => onPinReset()}
            buttonType="danger"
          >
            {t("Reset")}
          </Button>
        )}
      </Box>

      {responseFields != null && (
        <Paper sx={{ display: "flex", flexDirection: "column", gap: "20px", p: "20px" }} elevation={4}>
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
              >
                <DynamicField
                  disabled={item?.readonly}
                  hidden={item?.hidden}
                  required={!!item?.required}
                  conditions={item?.conditions}
                  type={item?.fieldType}
                  form={form}
                  label={item?.fieldTitles?.[locale ?? ""] ?? ""}
                  defaultValue={item?.defaultValue}
                  fieldName={item?.fieldName}
                  path={item?.path}
                  selectionName={item?.selection ?? ""}
                />
              </Grid>
            ))}
        </Paper>
      )}
    </Box>
  );
}
