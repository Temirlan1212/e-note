import { FC, useEffect, useState } from "react";

import { Alert, Box, Collapse, Typography } from "@mui/material";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/ui/Button";
import IdentityDocument from "@/components/fields/IdentityDocument";
import Address from "@/components/fields/Address";
import Contact from "@/components/fields/Contact";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/ui/Select";
import { Search } from "@mui/icons-material";
import { IUserRegistrySchema, userRegistrySchema } from "@/validator-schemas/user";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useRouter } from "next/router";
import PersonalData from "@/components/fields/PersonalData";

enum tundukFieldNames {
  name = "firstName",
}

const UserCreateContent: FC = () => {
  const router = useRouter();
  const form = useForm<IUserRegistrySchema>({
    mode: "onTouched",
    resolver: yupResolver<IUserRegistrySchema>(userRegistrySchema),
  });

  const t = useTranslations();

  const { control, trigger, getValues, setValue, resetField, watch } = form;

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: rolesData } = useFetch("/api/user/roles", "POST");

  const { data: userData, update: userCreate } = useFetch("", "POST");
  const { update: tundukPersonalDataFetch, loading: tundukPersonalDataLoading } = useFetch("", "POST");

  const getRoleName = {
    role: "role.id",
  };

  const getPersonalDataNames = {
    type: "partnerTypeSelect",
    foreigner: "foreigner",
    lastName: "lastName",
    firstName: "firstName",
    middleName: "middleName",
    pin: "personalNumber",
    birthDate: "birthDate",
    citizenship: "citizenship",
    nameOfCompanyOfficial: "nameOfCompanyOfficial",
    nameOfCompanyGov: "nameOfCompanyGov",
    representativesName: "representativesName",
    notaryRegistrationNumber: "notaryRegistrationNumber",
    notaryOKPONumber: "notaryOKPONumber",
    notaryPhysicalParticipantsQty: "notaryPhysicalParticipantsQty",
    notaryLegalParticipantsQty: "notaryLegalParticipantsQty",
    notaryTotalParticipantsQty: "notaryTotalParticipantsQty",
    notaryDateOfOrder: "notaryDateOfOrder",
  };

  const getIdentityDocumentNames = {
    documentType: "identityDocument",
    documentSeries: "passportSeries",
    documentNumber: "passportNumber",
    organType: "authority",
    organNumber: "authorityNumber",
    issueDate: "dateOfIssue",
  };

  const getAddressNames = {
    region: "mainAddress.region",
    district: "mainAddress.district",
    city: "mainAddress.city",
    street: "mainAddress.addressL4",
    house: "mainAddress.addressL3",
    apartment: "mainAddress.addressL2",
  };

  const getActualAddressNames = {
    region: "actualResidenceAddress.region",
    district: "actualResidenceAddress.district",
    city: "actualResidenceAddress.city",
    street: "actualResidenceAddress.addressL4",
    house: "actualResidenceAddress.addressL3",
    apartment: "actualResidenceAddress.addressL2",
  };

  const getContactNames = {
    email: "emailAddress.address",
    phone: "mobilePhone",
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const triggerFields = async () => {
    const allFields = items.reduce(
      (acc: string[], _) => [
        ...acc,
        ...Object.values(getRoleName),
        ...Object.values(getPersonalDataNames),
        ...Object.values(getIdentityDocumentNames),
        ...Object.values(getAddressNames),
        ...Object.values(getActualAddressNames),
        ...Object.values(getContactNames),
      ],
      []
    );

    return await trigger(allFields as any);
  };

  const handleCreate = async () => {
    setValue("partnerTypeSelect", 2);

    const validated = await triggerFields();

    if (validated) {
      setLoading(true);

      const data: Partial<IUserRegistrySchema> = getValues();

      await userCreate("/api/user/create", data);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (userData?.status === 0 && userData?.data) {
      handleOpenModal();
    }
  }, [userData?.status]);

  const handlePinCheck = async () => {
    const values = getValues();

    const validated = await trigger([`personalNumber`, `tundukPassportSeries`, `tundukPassportNumber`]);
    if (!validated) return;

    if (values != null && values?.personalNumber) {
      const pin = values?.personalNumber;
      const series = values?.tundukPassportSeries;
      const number = values?.tundukPassportNumber;

      let url = `individual?pin=${pin}&series=${series}&number=${number}`;
      const personalData: Record<string, any> = await tundukPersonalDataFetch(`/api/tunduk`, {
        model: `/ws/tunduk/${url}`,
      });

      if (personalData?.status !== 0 || personalData?.data == null) {
        setAlertOpen(true);
        return;
      }

      const partner = personalData.data;
      const mainAddress = personalData.data?.mainAddress;

      if (partner == null) {
        setAlertOpen(true);
        return;
      }

      setAlertOpen(false);
      setValue("emailAddress.address", partner?.address);

      const baseFields = [
        ...Object.values(getRoleName),
        ...Object.values(getPersonalDataNames),
        ...Object.values(getIdentityDocumentNames),
        ...Object.values(getContactNames),
      ];

      baseFields.map((field: any) => {
        const fieldPath = field.split(".");
        const fieldLastItem = fieldPath[fieldPath.length - 1];
        const tundukField = tundukFieldNames[fieldLastItem as keyof typeof tundukFieldNames];
        if (
          partner[tundukField ?? fieldLastItem] != null &&
          fieldLastItem !== "personalNumber" &&
          fieldLastItem !== "partnerTypeSelect"
        ) {
          setValue(field, partner[tundukField ?? fieldLastItem]);
        }
      });

      const mainAddressFields = [...Object.values(getAddressNames)];
      mainAddressFields.map((field: any) => {
        const fieldPath = field.split(".");
        const fieldLastItem = fieldPath[fieldPath.length - 1];
        if (mainAddress[fieldLastItem] != null) {
          setValue(field, mainAddress[fieldLastItem]);
        }
      });

      const actualAddressFields = [...Object.values(getActualAddressNames)];
      actualAddressFields.map((field: any) => {
        const fieldPath = field.split(".");
        const fieldLastItem = fieldPath[fieldPath.length - 1];
        if (partner[field] != null) {
          setValue(field, partner[fieldLastItem]);
        }
      });
    }
  };

  const handleRedirect = () => {
    router.push("/user-registry");
  };

  const items: JSX.Element[] = [
    <Box key={1} display="flex" gap="20px" flexDirection="column">
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Typography variant="h5">{t("User role")}</Typography>
        <Controller
          name="role.id"
          control={control}
          defaultValue={null}
          render={({ field, fieldState }) => (
            <Select
              data={rolesData?.data}
              valueField="id"
              labelField="name"
              {...field}
              startAdornment={<Search />}
              error={!!fieldState?.error}
              helperText={t(fieldState?.error?.message)}
              value={field.value != null ? field.value : ""}
              onChange={(...event: any[]) => {
                field.onChange(...event);
              }}
              selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
            />
          )}
        />
      </Box>

      <Typography variant="h5">{t("DataFromTundukPortal")}</Typography>
      <PersonalData
        form={form}
        loading={tundukPersonalDataLoading}
        names={{
          ...getPersonalDataNames,
          tundukDocumentSeries: "tundukPassportSeries",
          tundukDocumentNumber: "tundukPassportNumber",
        }}
        fields={{ birthDate: false, citizenship: false, type: false, notaryDateOfOrder: false }}
        onPinCheck={handlePinCheck}
      />

      <Typography variant="h5">{t("Identity document")}</Typography>
      <IdentityDocument form={form} names={getIdentityDocumentNames} />

      <Typography variant="h5">{t("Place of residence")}</Typography>
      <Address form={form} names={getAddressNames} />

      <Typography variant="h5">{t("Actual place of residence")}</Typography>
      <Address form={form} names={getActualAddressNames} />

      <Typography variant="h5">{t("Contacts")}</Typography>
      <Contact form={form} names={getContactNames} />
    </Box>,
  ];

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Collapse in={alertOpen}>
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          {t("Sorry, such pin not found")}
        </Alert>
      </Collapse>

      {items.map((element) => element)}
      <ConfirmationModal
        open={isModalOpen}
        onToggle={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        type="hint"
        hintTitle="Registration successfully completed"
        hintText="Login and password have been sent to the specified E-mail"
        title="Create user"
        slots={{
          button: () => <Button onClick={handleRedirect}>{t("Go to user registry")}</Button>,
        }}
      />
      <Button loading={loading} onClick={handleCreate}>
        {t("Register")}
      </Button>
    </Box>
  );
};

export default UserCreateContent;
