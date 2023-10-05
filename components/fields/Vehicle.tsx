import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { Box, Grid, InputLabel, Typography } from "@mui/material";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import { useRouter } from "next/router";
import ControlledDynamicComponent, {
  getControlledDynamicGroupName,
  getControlledDynamicName,
  getControlledDynamicValue,
} from "@/components/ui/ControlledDynamicComponent";

export interface IVehicleNames {
  pin: string;
  number: string;
  notaryLicensePlate: string;
  notaryVehicleRegistrationCertificateNumber: string;
  notaryTypeOfSteeringWheel: string;
  notaryEngineCapacity: string;
  notaryVehicleType: string;
  firstName: string;
  middleName: string;
  lastName: string;
  personalNumber: string;
  notaryVehicleColor: string;
}

export interface IVehicleProps {
  form: UseFormReturn<any>;
  names: IVehicleNames;
  disableFields?: boolean;
  loading?: boolean;
  onPinCheck?: (arg: IVehicleNames) => void;
}

const entity = "movable";
const index = 0;

const fieldsSchemaParams = {
  selection: null,
  defaultValue: null,
  required: false,
  hidden: false,
  readonly: false,
  fieldType: "String",
  path: "movable",
  sequence: 0,
  elementWidth: 0,
};

export default function Vehicle({ form, names, disableFields, loading, onPinCheck }: IVehicleProps) {
  const t = useTranslations();
  const { locale } = useRouter();

  const fieldsSchema = [
    {
      groupName_ru: "Данные об объекте документа",
      groupName_en: "Data about the document object",
      groupName_kg: "Документтин объектиси жөнүндө маалыматтар",
      fields: [
        {
          fieldName: names.notaryLicensePlate,
          fieldTitles: {
            ru: "Государственный номерной знак",
            en: "State license plate",
            kg: "Мамлекеттик номер белгиси",
          },
          ...fieldsSchemaParams,
        },
        {
          fieldName: names.notaryVehicleRegistrationCertificateNumber,
          fieldTitles: {
            ru: "Свидетельство регистрации транспортного средства",
            en: "Vehicle registration certificate",
            kg: "Транспорт каражатын каттоо күбөлүгү",
          },
          ...fieldsSchemaParams,
        },
        {
          fieldName: names.notaryTypeOfSteeringWheel,
          fieldTitles: {
            ru: "Тип руля",
            en: "Steering wheel type",
            kg: "Рулдун түрү",
          },
          ...fieldsSchemaParams,
        },
        {
          fieldName: names.notaryEngineCapacity,
          fieldTitles: {
            ru: "Объем",
            en: "Volume",
            kg: "Көлөм",
          },
          ...fieldsSchemaParams,
        },
        {
          fieldName: names.notaryVehicleType,
          fieldTitles: {
            ru: "Тип ТС",
            en: "Vehicle type",
            kg: "Транспорттун түрү",
          },
          ...fieldsSchemaParams,
        },
        {
          fieldName: names.notaryVehicleColor,
          fieldTitles: {
            ru: "Цвет",
            en: "Color",
            kg: "Түс",
          },
          ...fieldsSchemaParams,
        },
      ],
    },
    {
      groupName_ru: "Данные владельца",
      groupName_en: "Owner's details",
      groupName_kg: "Ээсинин маалыматтары",
      fields: [
        {
          fieldName: names.firstName,
          fieldTitles: {
            ru: "Имя",
            en: "Firstname",
            kg: "Аты",
          },
          ...fieldsSchemaParams,
        },
        {
          fieldName: names.lastName,
          fieldTitles: {
            ru: "Фамилия",
            en: "Lastname",
            kg: "Фамилиясы",
          },
          ...fieldsSchemaParams,
        },
        {
          fieldName: names.middleName,
          fieldTitles: {
            ru: "Отчество",
            en: "Middle name",
            kg: "Атасынын аты",
          },
          ...fieldsSchemaParams,
        },
        {
          fieldName: names.personalNumber,
          fieldTitles: {
            ru: "Персональный номер",
            en: "Personal number",
            kg: "Жеке номери",
          },
          ...fieldsSchemaParams,
        },
      ],
    },
  ];

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      {names?.pin && (
        <Controller
          control={form.control}
          name={`${entity}.${index}.${names?.pin}`}
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

      {names?.number && (
        <Controller
          control={form.control}
          name={`${entity}.${index}.${names?.number}`}
          defaultValue={""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%" mb="10px">
              <InputLabel>{t("State license plate")}</InputLabel>
              <Input
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                {...field}
              />
            </Box>
          )}
        />
      )}

      {fieldsSchema &&
        disableFields &&
        fieldsSchema.map((group: Record<string, any>, index: number) => (
          <Box display="flex" flexDirection="column" gap="20px" key={index}>
            <Typography variant="h5">{getControlledDynamicGroupName(group, locale)}</Typography>

            <Grid key={index} container spacing={2}>
              {group?.fields
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
                    <ControlledDynamicComponent
                      type={item.fieldType}
                      form={form}
                      label={item?.fieldTitles?.[locale ?? ""] ?? ""}
                      defaultValue={getControlledDynamicValue(item?.fieldType, item?.defaultValue)}
                      required={!!item?.required}
                      name={getControlledDynamicName(item?.path, item?.fieldName)}
                      selectionName={item?.selection ?? ""}
                      disabled={disableFields}
                    />
                  </Grid>
                ))}
            </Grid>
          </Box>
        ))}

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
