import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, InputLabel, Typography } from "@mui/material";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";

const defaultNames = {
  pin: "pin",
  notaryLicensePlate: "notaryLicensePlate",
  notaryVehicleRegistrationCertificateNumber: "notaryVehicleRegistrationCertificateNumber",
  notaryTypeOfSteeringWheel: "notaryTypeOfSteeringWheel",
  notaryEngineCapacity: "notaryEngineCapacity",
  notaryVehicleType: "notaryVehicleType",
  firstName: "firstName",
  middleName: "middleName",
  lastName: "lastName",
  personalNumber: "personalNumber",
  notaryVehicleColor: "notaryVehicleColor",
} as const;

export interface IVehicleProps {
  form: UseFormReturn<IApplicationSchema>;
  names?: typeof defaultNames;
  disableFields?: boolean;
  loading?: boolean;
  onPinCheck?: (arg: typeof defaultNames) => void;
}

export default function Vehicle({ form, names = defaultNames, disableFields, loading, onPinCheck }: IVehicleProps) {
  const t = useTranslations();

  const { trigger, control, watch, setValue } = form;

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Typography variant="h5">Данные об объекте документа</Typography>

      {names?.pin && (
        <Controller
          control={control}
          name={names?.pin}
          defaultValue={""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%" mb="10px">
              <InputLabel>{t("PIN")}</InputLabel>
              <Input
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                {...field}
              />
            </Box>
          )}
        />
      )}

      {watch(names?.pin) && disableFields && (
        <>
          {names?.notaryLicensePlate && (
            <Controller
              control={control}
              name={names?.notaryLicensePlate}
              defaultValue={""}
              render={({ field, fieldState }) => {
                if (!Boolean(field.value)) return <></>;
                return (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("State license plate")}</InputLabel>
                    <Input
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      disabled={disableFields}
                      {...field}
                    />
                  </Box>
                );
              }}
            />
          )}
          {names?.notaryVehicleRegistrationCertificateNumber && (
            <Controller
              control={control}
              name={names?.notaryVehicleRegistrationCertificateNumber}
              defaultValue={""}
              render={({ field, fieldState }) => {
                if (!Boolean(field.value)) return <></>;
                return (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Vehicle registration certificate")}</InputLabel>
                    <Input
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      disabled={disableFields}
                      {...field}
                    />
                  </Box>
                );
              }}
            />
          )}
          {names?.notaryTypeOfSteeringWheel && (
            <Controller
              control={control}
              name={names?.notaryTypeOfSteeringWheel}
              defaultValue={""}
              render={({ field, fieldState }) => {
                if (!Boolean(field.value)) return <></>;
                return (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Steering wheel type")}</InputLabel>
                    <Input
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      disabled={disableFields}
                      {...field}
                    />
                  </Box>
                );
              }}
            />
          )}
          {names?.notaryEngineCapacity && (
            <Controller
              control={control}
              name={names?.notaryEngineCapacity}
              defaultValue={""}
              render={({ field, fieldState }) => {
                if (!Boolean(field.value)) return <></>;
                return (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Volume")}</InputLabel>
                    <Input
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      disabled={disableFields}
                      {...field}
                    />
                  </Box>
                );
              }}
            />
          )}
          {names?.notaryVehicleType && (
            <Controller
              control={control}
              name={names?.notaryVehicleType}
              defaultValue={""}
              render={({ field, fieldState }) => {
                if (!Boolean(field.value)) return <></>;
                return (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Vehicle type")}</InputLabel>
                    <Input
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      disabled={disableFields}
                      {...field}
                    />
                  </Box>
                );
              }}
            />
          )}

          {names?.notaryVehicleColor && (
            <Controller
              control={control}
              name={names?.notaryVehicleColor}
              defaultValue={""}
              render={({ field, fieldState }) => {
                if (!Boolean(field.value)) return <></>;
                return (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Color")}</InputLabel>
                    <Input
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      disabled={disableFields}
                      {...field}
                    />
                  </Box>
                );
              }}
            />
          )}
        </>
      )}

      {watch(names?.pin) && disableFields && (
        <>
          <Typography variant="h5">Данные владельца</Typography>

          {names?.firstName && (
            <Controller
              control={control}
              name={names?.firstName}
              defaultValue={""}
              render={({ field, fieldState }) => {
                if (!Boolean(field.value)) return <></>;
                return (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Firstname")}</InputLabel>
                    <Input
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      disabled={disableFields}
                      {...field}
                    />
                  </Box>
                );
              }}
            />
          )}

          {names?.lastName && (
            <Controller
              control={control}
              name={names?.lastName}
              defaultValue={""}
              render={({ field, fieldState }) => {
                if (!Boolean(field.value)) return <></>;
                return (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Lastname")}</InputLabel>
                    <Input
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      disabled={disableFields}
                      {...field}
                    />
                  </Box>
                );
              }}
            />
          )}

          {names?.middleName && (
            <Controller
              control={control}
              name={names?.middleName}
              defaultValue={""}
              render={({ field, fieldState }) => {
                if (!Boolean(field.value)) return <></>;
                return (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Middlename")}</InputLabel>
                    <Input
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      disabled={disableFields}
                      {...field}
                    />
                  </Box>
                );
              }}
            />
          )}

          {names?.personalNumber && (
            <Controller
              control={control}
              name={names?.personalNumber}
              defaultValue={""}
              render={({ field, fieldState }) => {
                if (!Boolean(field.value)) return <></>;
                return (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Personal number")}</InputLabel>
                    <Input
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      disabled={disableFields}
                      {...field}
                    />
                  </Box>
                );
              }}
            />
          )}
        </>
      )}

      {onPinCheck && names != null && (
        <Button
          loading={loading}
          endIcon={<ContentPasteSearchIcon />}
          sx={{ flex: 0, minWidth: "auto", padding: "8px 16px" }}
          onClick={() => onPinCheck(names)}
        >
          {t("Check")}
        </Button>
      )}
    </Box>
  );
}
