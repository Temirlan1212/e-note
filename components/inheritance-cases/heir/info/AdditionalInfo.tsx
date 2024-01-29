import { FC } from "react";
import { useTranslations } from "next-intl";
import { FetchResponseBody } from "@/hooks/useFetch";
import { Box, Typography } from "@mui/material";
import IdentityDocument from "@/components/fields/IdentityDocument";
import Address from "@/components/fields/Address";
import Contact from "@/components/fields/Contact";
import { IPersonSchema, personSchema } from "@/validator-schemas/person";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

interface IAdditionalInfoProps {
  additionalInfo: FetchResponseBody | null;
}

const AdditionalInfo: FC<IAdditionalInfoProps> = ({ additionalInfo }) => {
  const t = useTranslations();

  const form = useForm<IPersonSchema>({
    mode: "all",
    resolver: yupResolver<IPersonSchema>(personSchema),
    values: additionalInfo?.status === 0 && additionalInfo?.data[0]?.id != null ? additionalInfo.data[0] : undefined,
  });

  const isForeigner = form.watch(`foreigner`);

  const identityDocumentNames = {
    documentType: `identityDocument`,
    documentSeries: `passportSeries`,
    documentNumber: `.passportNumber`,
    organType: `authority`,
    organNumber: `authorityNumber`,
    birthDate: `birthDate`,
    citizenship: `citizenship`,
    foreigner: `foreigner`,
    nationality: `nationality`,
    maritalStatus: `maritalStatus`,
    issueDate: `dateOfIssue`,
    familyStatus: `familyStatus`,
  };

  const addressNames = {
    region: `mainAddress.region`,
    district: `mainAddress.district`,
    city: `mainAddress.city`,
    street: `mainAddress.addressL4`,
    house: `mainAddress.addressL3`,
    apartment: `mainAddress.addressL2`,
    foreignAddress: `foreignAddress`,
  };

  const actualAddressNames = {
    region: `actualResidenceAddress.region`,
    district: `actualResidenceAddress.district`,
    city: `actualResidenceAddress.city`,
    street: `actualResidenceAddress.addressL4`,
    house: `actualResidenceAddress.addressL3`,
    apartment: `actualResidenceAddress.addressL2`,
  };

  const contactNames = {
    email: `emailAddress.address`,
    phone: `mobilePhone`,
  };

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <>
        <Typography variant="h5">{t("Identity document")}</Typography>
        <IdentityDocument
          disableFields={true}
          form={form}
          fields={{
            maritalStatus: true,
            nationality: true,
          }}
          names={identityDocumentNames}
        />
      </>

      <Typography variant="h5">{isForeigner ? t("Address") : t("Place of residence")}</Typography>
      <Address
        disableFields={true}
        form={form}
        isForeigner={isForeigner}
        names={addressNames}
        sx={{
          labelsSx: { fontWeight: 600 },
          inputSx: { ".MuiInputBase-root": { fontWeight: 500 } },
        }}
      />

      {!isForeigner && (
        <>
          <Typography variant="h5">{t("Actual place of residence")}</Typography>
          <Address
            disableFields={true}
            form={form}
            names={actualAddressNames}
            sx={{
              labelsSx: { fontWeight: 600 },
              inputSx: { ".MuiInputBase-root": { fontWeight: 500 } },
            }}
          />
        </>
      )}

      <Typography variant="h5">{t("Contacts")}</Typography>
      <Contact
        disableFields={true}
        form={form}
        names={contactNames}
        sx={{
          labelsSx: { fontWeight: 600 },
          inputSx: { ".MuiInputBase-root": { fontWeight: 500 } },
        }}
      />
    </Box>
  );
};

export default AdditionalInfo;
