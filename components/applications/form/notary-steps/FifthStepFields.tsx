import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, Grid, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/router";
import StepperContentStep from "@/components/ui/StepperContentStep";
import ControlledDynamicComponent, {
  getControlledDynamicGroupName,
  getControlledDynamicName,
  getControlledDynamicValue,
} from "@/components/ui/ControlledDynamicComponent";
import Vehicle, { IVehicleNames } from "@/components/fields/Vehicle";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  dynamicForm: UseFormReturn<any>;
  onPrev?: Function;
  onNext?: (arg: { step: number | undefined }) => void;
  handleStepNextClick?: Function;
}

export default function FifthStepFields({ form, dynamicForm, onPrev, onNext, handleStepNextClick }: IStepFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();
  const productId = form.watch("product.id");

  const { update: applicationUpdate, loading } = useFetch("", "PUT");
  const { update: tundukVehicleDataFetch, loading: tundukVehicleDataLoading } = useFetch("", "POST");

  const {
    update: getDocumentTemplateData,
    data: documentTemplateData,
    loading: documentTemplateLoading,
  } = useFetch("", "GET");

  const triggerFields = async () => {
    return await dynamicForm.trigger();
  };

  useEffectOnce(async () => {
    if (productId != null) {
      await getDocumentTemplateData("/api/dictionaries/document-type/template/" + productId);
    }
  }, [productId]);

  const handleNextClick = async (targetStep?: number) => {
    const validated = await triggerFields();
    const { setValue, getValues } = form;

    if (validated && onNext) {
      const values = getValues();

      const data: Partial<IApplicationSchema> = {
        ...dynamicForm.getValues(),
        id: values.id,
        version: values.version,
      };

      const result = await applicationUpdate(`/api/applications/update/${values.id}`, data);
      if (result != null && result.data != null && result.data[0]?.id != null) {
        setValue("id", result.data[0].id);
        setValue("version", result.data[0].version);
        onNext({ step: targetStep });
      }
    }
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handlePinCheck = async (names: IVehicleNames, index: number) => {
    const entity = "movable";
    const pin = `${entity}.${index}.${names?.pin}` as any;
    const number = `${entity}.${index}.${names?.number}` as any;
    const validated = await dynamicForm.trigger([pin, number]);
    if (!validated) return;

    const vehicleData = await tundukVehicleDataFetch(
      `/api/tunduk/vehicle-data?pin=${dynamicForm.getValues(pin)}&number=${dynamicForm.getValues(number)}`
    );
    if (vehicleData?.status !== 0 || vehicleData?.data == null) {
      return;
    }

    dynamicForm.setValue(`movable.${index}.tundukVehicleIsSuccess`, true);

    const notaryPartner = vehicleData?.data?.[0]?.notaryPartner?.[0];

    for (let key in names) {
      const name = names?.[key as keyof typeof names];
      const value = vehicleData?.data?.[0]?.[name] ?? notaryPartner?.[name];
      if (value != null && name !== "notaryLicensePlate" && name !== "pin") {
        dynamicForm.setValue(`${entity}.${index}.${name}` as any, value);
      }
    }
  };

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
  });

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <StepperContentStep step={5} title={t("Additional information")} loading={documentTemplateLoading} />

      <Box display="flex" flexDirection="column" gap="30px">
        {form.watch("object") === 1 && (
          <Vehicle
            disableFields={dynamicForm.watch(`movable.${0}.tundukVehicleIsSuccess`)}
            form={dynamicForm}
            onPinCheck={(names) => handlePinCheck(names, 0)}
            loading={tundukVehicleDataLoading}
            names={{
              pin: "pin",
              number: "number",
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
            }}
          />
        )}

        {documentTemplateData?.data &&
          documentTemplateData?.data.map((group: Record<string, any>, index: number) => (
            <Box display="flex" flexDirection="column" gap="20px" key={index}>
              <Typography variant="h4">{getControlledDynamicGroupName(group, locale)}</Typography>

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
                        form={dynamicForm}
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
      </Box>

      {!documentTemplateLoading && (
        <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
          {onPrev != null && (
            <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />} sx={{ width: "auto" }}>
              {t("Prev")}
            </Button>
          )}
          <Button
            loading={loading}
            onClick={() => handleNextClick()}
            endIcon={<ArrowForwardIcon />}
            sx={{ width: "auto" }}
          >
            {t("Next")}
          </Button>
        </Box>
      )}
    </Box>
  );
}
