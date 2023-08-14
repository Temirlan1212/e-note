import { useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Address from "@/components/fields/Address";
import IdentityDocument from "@/components/fields/IdentityDocument";
import Contact from "@/components/fields/Contact";
import PersonalData from "@/components/fields/PersonalData";
import UploadFiles from "@/components/fields/UploadFiles";

interface IVersionFields {
  version?: number;
  $version?: number;
}

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

export default function ThirdStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();

  const { trigger, resetField, getValues, setValue } = form;

  const [loading, setLoading] = useState(false);

  const { update: applicationUpdate } = useFetch("", "PUT");
  const { update: applicationFetch } = useFetch("", "POST");

  const getPersonalDataNames = (index: number) => ({
    type: `requester.${index}.partnerTypeSelect`,
    foreigner: `requester.${index}.foreigner`,
    lastName: `requester.${index}.lastName`,
    firstName: `requester.${index}.name`,
    middleName: `requester.${index}.middleName`,
    pin: `requester.${index}.personalNumber`,
    birthDate: `requester.${index}.birthDate`,
    citizenship: `requester.${index}.citizenship`,
  });

  const getIdentityDocumentNames = (index: number) => ({
    documentType: `requester.${index}.identityDocument`,
    documentSeries: `requester.${index}.passportSeries`,
    documentNumber: `requester.${index}.passportNumber`,
    organType: `requester.${index}.authority`,
    organNumber: `requester.${index}.authorityNumber`,
    issueDate: `requester.${index}.dateOfIssue`,
  });

  const getAddressNames = (index: number) => ({
    region: `requester.${index}.mainAddress.region`,
    district: `requester.${index}.mainAddress.district`,
    city: `requester.${index}.mainAddress.city`,
    street: `requester.${index}.mainAddress.addressL4`,
    house: `requester.${index}.mainAddress.addressL3`,
    apartment: `requester.${index}.mainAddress.addressL2`,
  });

  const getActualAddressNames = (index: number) => ({
    region: `requester.${index}.actualResidenceAddress.region`,
    district: `requester.${index}.actualResidenceAddress.district`,
    city: `requester.${index}.actualResidenceAddress.city`,
    street: `requester.${index}.actualResidenceAddress.addressL4`,
    house: `requester.${index}.actualResidenceAddress.addressL3`,
    apartment: `requester.${index}.actualResidenceAddress.addressL2`,
  });

  const getContactNames = (index: number) => ({
    email: `requester.${index}.emailAddress.address`,
    phone: `requester.${index}.mobilePhone`,
  });

  const triggerFields = async () => {
    const index = 0;
    const allFields = [
      ...Object.values(getPersonalDataNames(index)),
      ...Object.values(getIdentityDocumentNames(index)),
      ...Object.values(getAddressNames(index)),
      ...Object.values(getActualAddressNames(index)),
      ...Object.values(getContactNames(index)),
    ];

    return await trigger(allFields as any);
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async () => {
    const validated = await triggerFields();

    if (validated) {
      setLoading(true);

      const values = getValues();
      const data: Partial<IApplicationSchema> = {
        id: values.id,
        version: values.version,
        requester: values.requester,
      };

      const result = await applicationUpdate(`/api/applications/update/${values.id}`, data);
      if (result != null && result.data != null && result.data[0]?.id != null) {
        setValue("version", result.data[0].version);

        const applicationData = await applicationFetch(`/api/applications/${values.id}`, {
          fields: ["version"],
          related: {
            requester: ["version", "emailAddress.version", "mainAddress.version", "actualResidenceAddress.version"],
          },
        });

        if (applicationData?.status === 0 && applicationData?.data[0]?.id != null) {
          applicationData.data[0]?.requester?.map(
            (
              item: IVersionFields & {
                mainAddress?: IVersionFields;
                actualResidenceAddress?: IVersionFields;
                emailAddress?: IVersionFields;
              },
              index: number
            ) => {
              setValue(`requester.${index}.version`, item.version ?? item.$version);
              setValue(
                `requester.${index}.mainAddress.version`,
                item.mainAddress?.version ?? item?.mainAddress?.$version
              );
              setValue(
                `requester.${index}.actualResidenceAddress.version`,
                item?.actualResidenceAddress?.version ?? item?.actualResidenceAddress?.$version
              );
              setValue(
                `requester.${index}.emailAddress.version`,
                item?.emailAddress?.version ?? item?.emailAddress?.$version
              );
            }
          );
        }

        if (onNext != null) onNext();
      }

      setLoading(false);
    }
  };

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box
        display="flex"
        justifyContent="space-between"
        gap={{ xs: "20px", md: "200px" }}
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Typography variant="h4" whiteSpace="nowrap">
          {t("fourth-step-title")}
        </Typography>
      </Box>

      <Typography variant="h5">{t("Personal data")}</Typography>
      <PersonalData form={form} names={getPersonalDataNames(0)} />

      <Typography variant="h5">{t("Identity document")}</Typography>
      <IdentityDocument form={form} names={getIdentityDocumentNames(0)} />

      <Typography variant="h5">{t("Place of residence")}</Typography>
      <Address form={form} names={getAddressNames(0)} />

      <Typography variant="h5">{t("Actual place of residence")}</Typography>
      <Address form={form} names={getActualAddressNames(0)} />

      <Typography variant="h5">{t("Contacts")}</Typography>
      <Contact form={form} names={getContactNames(0)} />

      <Typography variant="h5">{t("Files to upload")}</Typography>
      <UploadFiles />

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        {onPrev != null && (
          <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />}>
            {t("Prev")}
          </Button>
        )}
        {onNext != null && (
          <Button loading={loading} onClick={handleNextClick} endIcon={<ArrowForwardIcon />}>
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
