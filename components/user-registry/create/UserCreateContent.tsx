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
import { IUserRegistrySchema, userRegistrySchema } from "@/validator-schemas/user-registry";
import UserData from "@/components/fields/UserData";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

enum tundukFieldNames {
  name = "firstName",
}

const UserCreateContent: FC = () => {
  const form = useForm<IUserRegistrySchema>({
    mode: "onTouched",
    resolver: yupResolver<IUserRegistrySchema>(userRegistrySchema),
  });

  const t = useTranslations();

  const { control, trigger, getValues, setValue } = form;

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: rolesData } = useFetch("/api/user-registry/dictionaries/roles", "POST");

  const { data: userData, update: userCreate } = useFetch("", "POST");
  const { update: tundukPersonalDataFetch } = useFetch("", "GET");

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

      await userCreate("/api/user-registry/create", data);
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

    setValue("mainAddress.id", null);
    setValue("mainAddress.version", null);
    setValue("actualResidenceAddress.id", null);
    setValue("actualResidenceAddress.version", null);
    setValue("emailAddress.id", null);
    setValue("emailAddress.version", null);

    if (values != null && values?.personalNumber) {
      const pin = values?.personalNumber;
      const personalData = await tundukPersonalDataFetch(`/api/tunduk/personal-data/${pin}`);
      if (personalData?.status !== 0 || personalData?.data == null) {
        setAlertOpen(true);
        return;
      }

      const partner = personalData.data?.partner;
      const mainAddress = personalData.data?.mainAddress;
      const actualAddress = personalData.data?.actualAddress;
      const emailAddress = personalData.data?.emailAddress;

      if (partner == null || partner.id == null) {
        setAlertOpen(true);
        return;
      }

      setAlertOpen(false);
      setValue("mainAddress.id", mainAddress?.id);
      setValue("mainAddress.version", mainAddress?.version);
      setValue("actualResidenceAddress.id", actualAddress?.id);
      setValue("actualResidenceAddress.version", actualAddress?.version);
      setValue("emailAddress.id", emailAddress?.id);
      setValue("emailAddress.version", emailAddress?.version);
      setValue("emailAddress.address", emailAddress?.address);

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
        if (partner[tundukField ?? fieldLastItem] != null && fieldLastItem !== "personalNumber") {
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
        if (actualAddress[fieldLastItem] != null) {
          setValue(field, actualAddress[fieldLastItem]);
        }
      });
    }
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
      <UserData form={form} names={getPersonalDataNames} onPinCheck={handlePinCheck} />

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
          button: () => <Button>{t("Close")}</Button>,
        }}
      />
      <Button loading={loading} onClick={handleCreate}>
        {t("Register")}
      </Button>
    </Box>
  );
};

export default UserCreateContent;
