import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { IApplicationSchema } from "@/validator-schemas/application";
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

const fieldsSchema = [
  {
    groupName_ru: "Данные об объекте документа",
    groupName_en: "Data about the document object",
    groupName_kg: "Документтин объектиси жөнүндө маалыматтар",
    fields: [
      {
        fieldName: defaultNames.notaryVehicleRegistrationCertificateNumber,
        fieldTitles: {
          ru: "Свидетельство регистрации транспортного средства",
          en: "Vehicle registration certificate",
          kg: "Транспорт каражатын каттоо күбөлүгү",
        },
        ...fieldsSchemaParams,
      },
      {
        fieldName: defaultNames.notaryTypeOfSteeringWheel,
        fieldTitles: {
          ru: "Тип руля",
          en: "Steering wheel type",
          kg: "Рулдун түрү",
        },
        ...fieldsSchemaParams,
      },
      {
        fieldName: defaultNames.notaryEngineCapacity,
        fieldTitles: {
          ru: "Объем",
          en: "Volume",
          kg: "Көлөм",
        },
        ...fieldsSchemaParams,
      },
      {
        fieldName: defaultNames.notaryVehicleType,
        fieldTitles: {
          ru: "Тип ТС",
          en: "Vehicle type",
          kg: "Транспорттун түрү",
        },
        ...fieldsSchemaParams,
      },
      {
        fieldName: defaultNames.notaryVehicleColor,
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
        fieldName: defaultNames.firstName,
        fieldTitles: {
          ru: "Имя",
          en: "Firstname",
          kg: "Аты",
        },
        ...fieldsSchemaParams,
      },
      {
        fieldName: defaultNames.lastName,
        fieldTitles: {
          ru: "Фамилия",
          en: "Lastname",
          kg: "Фамилиясы",
        },
        ...fieldsSchemaParams,
      },
      {
        fieldName: defaultNames.middleName,
        fieldTitles: {
          ru: "Отчество",
          en: "Middle name",
          kg: "Атасынын аты",
        },
        ...fieldsSchemaParams,
      },
      {
        fieldName: defaultNames.personalNumber,
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

export default function Vehicle({ form, names = defaultNames, disableFields, loading, onPinCheck }: IVehicleProps) {
  const t = useTranslations();
  const { locale } = useRouter();

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

      {names?.notaryLicensePlate && (
        <Controller
          control={form.control}
          name={`${entity}.${index}.${names?.notaryLicensePlate}`}
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
