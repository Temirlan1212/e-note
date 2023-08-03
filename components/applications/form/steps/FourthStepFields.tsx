import { useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, InputLabel, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddressFields from "@/components/fields/Address";
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

  const { trigger, control, watch, resetField } = form;

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const triggerFields = async () => {
    return await trigger([
      "requester.0.partnerTypeSelect",
      "requester.0.partner.foreigner",
      "requester.0.lastName",
      "requester.0.name",
      "requester.0.middleName",
      "requester.0.personalNumber",
      "requester.0.birthDate",
      "requester.0.citizenship.id",
      "requester.0.identityDocument",
      "requester.0.passportSeries",
      "requester.0.passportNumber",
      "requester.0.authority",
      "requester.0.authorityNumber",
      "requester.0.dateOfIssue",
      "requester.0.partnerAddressList.0.address.region.id",
      "requester.0.partnerAddressList.0.address.district.id",
      "requester.0.partnerAddressList.0.address.city.id",
      "requester.0.partnerAddressList.0.address.addressL4",
      "requester.0.partnerAddressList.0.address.addressL3",
      "requester.0.partnerAddressList.0.address.addressL2",
      "requester.0.partnerAddressList.1.address.region.id",
      "requester.0.partnerAddressList.1.address.district.id",
      "requester.0.partnerAddressList.1.address.city.id",
      "requester.0.partnerAddressList.1.address.addressL4",
      "requester.0.partnerAddressList.1.address.addressL3",
      "requester.0.partnerAddressList.1.address.addressL2",
      "requester.0.emailAddress.address",
      "requester.0.mobilePhone",
    ]);
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

      <PersonalData
        form={form}
        names={{
          type: "requester.0.partnerTypeSelect",
          foreigner: "requester.0.partner.foreigner",
          lastName: "requester.0.lastName",
          firstName: "requester.0.name",
          middleName: "requester.0.middleName",
          pin: "requester.0.personalNumber",
          birthDate: "requester.0.birthDate",
          citizenship: "requester.0.citizenship.id",
        }}
      />

      <Typography variant="h5">{t("Identity document")}</Typography>

      <IdentityDocument
        form={form}
        names={{
          documentType: "requester.0.identityDocument",
          documentSeries: "requester.0.passportSeries",
          documentNumber: "requester.0.passportNumber",
          organType: "requester.0.authority",
          organNumber: "requester.0.authorityNumber",
          issueDate: "requester.0.dateOfIssue",
        }}
      />

      <Typography variant="h5">{t("Place of residence")}</Typography>

      <AddressFields
        form={form}
        names={{
          region: "requester.0.partnerAddressList.0.address.region.id",
          district: "requester.0.partnerAddressList.0.address.district.id",
          city: "requester.0.partnerAddressList.0.address.city.id",
          street: "requester.0.partnerAddressList.0.address.addressL4",
          house: "requester.0.partnerAddressList.0.address.addressL3",
          apartment: "requester.0.partnerAddressList.0.address.addressL2",
        }}
      />

      <Typography variant="h5">{t("Actual place of residence")}</Typography>

      <AddressFields
        form={form}
        names={{
          region: "requester.0.partnerAddressList.1.address.region.id",
          district: "requester.0.partnerAddressList.1.address.district.id",
          city: "requester.0.partnerAddressList.1.address.city.id",
          street: "requester.0.partnerAddressList.1.address.addressL4",
          house: "requester.0.partnerAddressList.1.address.addressL3",
          apartment: "requester.0.partnerAddressList.1.address.addressL2",
        }}
      />

      <Typography variant="h5">{t("Contacts")}</Typography>

      <Contact
        form={form}
        names={{
          email: "requester.0.emailAddress.address",
          phone: "requester.0.mobilePhone",
        }}
      />

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
