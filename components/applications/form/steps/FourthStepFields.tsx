import { useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
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

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

export default function FourthStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();

  const { trigger } = form;

  const getPersonalDataNames = (index: number) => ({
    type: `requester.${index}.partnerTypeSelect`,
    foreigner: `requester.${index}.partner.foreigner`,
    lastName: `requester.${index}.lastName`,
    firstName: `requester.${index}.name`,
    middleName: `requester.${index}.middleName`,
    pin: `requester.${index}.personalNumber`,
    birthDate: `requester.${index}.birthDate`,
    citizenship: `requester.${index}.citizenship.id`,
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
    region: `requester.${index}.partnerAddressList.0.address.region.id`,
    district: `requester.${index}.partnerAddressList.0.address.district.id`,
    city: `requester.${index}.partnerAddressList.0.address.city.id`,
    street: `requester.${index}.partnerAddressList.0.address.addressL4`,
    house: `requester.${index}.partnerAddressList.0.address.addressL3`,
    apartment: `requester.${index}.partnerAddressList.0.address.addressL2`,
  });

  const getActualAddressNames = (index: number) => ({
    region: `requester.${index}.partnerAddressList.1.address.region.id`,
    district: `requester.${index}.partnerAddressList.1.address.district.id`,
    city: `requester.${index}.partnerAddressList.1.address.city.id`,
    street: `requester.${index}.partnerAddressList.1.address.addressL4`,
    house: `requester.${index}.partnerAddressList.1.address.addressL3`,
    apartment: `requester.${index}.partnerAddressList.1.address.addressL2`,
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
    if (onNext != null && validated) onNext();
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
          <Button onClick={handleNextClick} endIcon={<ArrowForwardIcon />}>
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
