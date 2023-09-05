import { useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Address from "@/components/fields/Address";
import IdentityDocument from "@/components/fields/IdentityDocument";
import Contact from "@/components/fields/Contact";
import PersonalData from "@/components/fields/PersonalData";
import UploadFiles from "@/components/fields/UploadFiles";
import StepperContentStep from "@/components/ui/StepperContentStep";

interface IBaseEntityFields {
  id?: number;
  version?: number;
  $version?: number;
}

export interface ITabListItem {
  getElement: (index: number) => JSX.Element;
}

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

export default function FourthStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();

  const {
    control,
    trigger,
    resetField,
    getValues,
    setValue,
    formState: { errors },
  } = form;

  const { remove } = useFieldArray({
    control,
    name: "members",
  });

  const [loading, setLoading] = useState(false);
  const [tabsErrorsCounts, setTabsErrorsCounts] = useState<Record<number, number>>({});
  const [items, setItems] = useState<ITabListItem[]>([
    {
      getElement(index: number) {
        return (
          <Box display="flex" gap="20px" flexDirection="column">
            <Typography variant="h5">{t("Personal data")}</Typography>
            <PersonalData form={form} names={getPersonalDataNames(index)} />

            <Typography variant="h5">{t("Identity document")}</Typography>
            <IdentityDocument form={form} names={getIdentityDocumentNames(index)} />

            <Typography variant="h5">{t("Place of residence")}</Typography>
            <Address form={form} names={getAddressNames(index)} />

            <Typography variant="h5">{t("Actual place of residence")}</Typography>
            <Address form={form} names={getActualAddressNames(index)} />

            <Typography variant="h5">{t("Contacts")}</Typography>
            <Contact form={form} names={getContactNames(index)} />

            <Typography variant="h5">{t("Files to upload")}</Typography>
            <UploadFiles />
          </Box>
        );
      },
    },
  ]);

  const { update: applicationUpdate } = useFetch("", "PUT");
  const { update: applicationFetch } = useFetch("", "POST");

  const getPersonalDataNames = (index: number) => ({
    type: `members.${index}.partnerTypeSelect`,
    foreigner: `members.${index}.foreigner`,
    lastName: `members.${index}.lastName`,
    firstName: `members.${index}.name`,
    middleName: `members.${index}.middleName`,
    pin: `members.${index}.personalNumber`,
    birthDate: `members.${index}.birthDate`,
    citizenship: `members.${index}.citizenship`,
    nameOfCompanyOfficial: `requester.${index}.nameOfCompanyOfficial`,
    nameOfCompanyGov: `requester.${index}.nameOfCompanyGov`,
    representativesName: `requester.${index}.representativesName`,
    notaryRegistrationNumber: `requester.${index}.notaryRegistrationNumber`,
    notaryOKPONumber: `requester.${index}.notaryOKPONumber`,
    notaryPhysicalParticipantsQty: `requester.${index}.notaryPhysicalParticipantsQty`,
    notaryLegalParticipantsQty: `requester.${index}.notaryLegalParticipantsQty`,
    notaryTotalParticipantsQty: `requester.${index}.notaryTotalParticipantsQty`,
  });

  const getIdentityDocumentNames = (index: number) => ({
    documentType: `members.${index}.identityDocument`,
    documentSeries: `members.${index}.passportSeries`,
    documentNumber: `members.${index}.passportNumber`,
    organType: `members.${index}.authority`,
    organNumber: `members.${index}.authorityNumber`,
    issueDate: `members.${index}.dateOfIssue`,
  });

  const getAddressNames = (index: number) => ({
    region: `members.${index}.mainAddress.region`,
    district: `members.${index}.mainAddress.district`,
    city: `members.${index}.mainAddress.city`,
    street: `members.${index}.mainAddress.addressL4`,
    house: `members.${index}.mainAddress.addressL3`,
    apartment: `members.${index}.mainAddress.addressL2`,
  });

  const getActualAddressNames = (index: number) => ({
    region: `members.${index}.actualResidenceAddress.region`,
    district: `members.${index}.actualResidenceAddress.district`,
    city: `members.${index}.actualResidenceAddress.city`,
    street: `members.${index}.actualResidenceAddress.addressL4`,
    house: `members.${index}.actualResidenceAddress.addressL3`,
    apartment: `members.${index}.actualResidenceAddress.addressL2`,
  });

  const getContactNames = (index: number) => ({
    email: `members.${index}.emailAddress.address`,
    phone: `members.${index}.mobilePhone`,
  });

  useEffectOnce(() => {
    const values = getValues();
    const itemsLength = values.members?.length ?? 1;
    if (itemsLength > 1) {
      for (let i = 0; i < itemsLength - 1; i++) {
        handleAddTabClick();
      }
    }
  });

  const triggerFields = async () => {
    const allFields = items.reduce((acc: string[], _, index: number) => {
      return [
        ...acc,
        ...Object.values(getPersonalDataNames(index)),
        ...Object.values(getIdentityDocumentNames(index)),
        ...Object.values(getAddressNames(index)),
        ...Object.values(getActualAddressNames(index)),
        ...Object.values(getContactNames(index)),
      ];
    }, []);

    const validated = await trigger(allFields as any);

    if (!validated && errors?.members != null) {
      const tabsErrorsCounts: Record<number, number> = {};

      for (const [index, item] of Object.entries(errors.members)) {
        if (item == null) continue;
        const count = Object.keys(item);
        tabsErrorsCounts[parseInt(index)] = count.length;
      }

      setTabsErrorsCounts(tabsErrorsCounts);
    } else {
      setTabsErrorsCounts({});
    }

    return validated;
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
        members: values.members,
      };

      const result = await applicationUpdate(`/api/applications/update/${values.id}`, data);
      if (result != null && result.data != null && result.data[0]?.id != null) {
        setValue("version", result.data[0].version);

        const applicationData = await applicationFetch(`/api/applications/${result.data[0].id}`, {
          fields: ["version"],
          related: {
            members: ["version", "emailAddress.version", "mainAddress.version", "actualResidenceAddress.version"],
          },
        });

        if (applicationData?.status === 0 && applicationData?.data[0]?.id != null) {
          applicationData.data[0]?.members?.map(
            (
              item: IBaseEntityFields & {
                mainAddress?: IBaseEntityFields;
                actualResidenceAddress?: IBaseEntityFields;
                emailAddress?: IBaseEntityFields;
              },
              index: number
            ) => {
              setValue(`members.${index}.id`, item.id);
              setValue(`members.${index}.version`, item.version ?? item.$version);

              if (item.mainAddress?.id != null) {
                setValue(`members.${index}.mainAddress.id`, item.mainAddress.id);
                setValue(
                  `members.${index}.mainAddress.version`,
                  item.mainAddress?.version ?? item?.mainAddress?.$version
                );
              }

              if (item.actualResidenceAddress?.id != null) {
                setValue(`members.${index}.actualResidenceAddress.id`, item.actualResidenceAddress.id);
                setValue(
                  `members.${index}.actualResidenceAddress.version`,
                  item.actualResidenceAddress?.version ?? item?.actualResidenceAddress?.$version
                );
              }

              if (item.emailAddress?.id != null) {
                setValue(`members.${index}.emailAddress.id`, item.emailAddress.id);
                setValue(
                  `members.${index}.emailAddress.version`,
                  item.emailAddress?.version ?? item?.emailAddress?.$version
                );
              }
            }
          );
        }

        if (onNext != null) onNext();
      }

      setLoading(false);
    }
  };

  const handleAddTabClick = () => {
    setItems((prev) => {
      const lastItem = prev[prev.length - 1];

      if (lastItem == null) return [...prev];

      const newItem = { ...lastItem };

      return [...prev, newItem];
    });
  };

  const handleRemoveTabClick = () => {
    setItems((prev) => {
      if (prev.length <= 1) return [...prev];

      remove(prev.length - 1);

      const next = prev.filter((_, index) => index != prev.length - 1);

      return [...next];
    });
  };

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <StepperContentStep step={4} title={t("fifth-step-title")} />

      <Tabs
        data={items.map(({ getElement }, index) => {
          return {
            tabErrorsCount: tabsErrorsCounts[index] ?? 0,
            tabLabel: `${t("Member")} ${index + 1}`,
            tabPanelContent: getElement(index) ?? <></>,
          };
        })}
        actionsContent={
          <>
            <Button
              buttonType="primary"
              sx={{ flex: 0, minWidth: "auto", padding: "10px" }}
              onClick={handleAddTabClick}
            >
              <AddIcon />
            </Button>
            <Button
              buttonType="secondary"
              sx={{ flex: 0, minWidth: "auto", padding: "10px" }}
              onClick={handleRemoveTabClick}
            >
              <RemoveIcon />
            </Button>
          </>
        }
      />

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        {onPrev != null && (
          <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />} sx={{ width: "auto" }}>
            {t("Prev")}
          </Button>
        )}
        {onNext != null && (
          <Button loading={loading} onClick={handleNextClick} endIcon={<ArrowForwardIcon />} sx={{ width: "auto" }}>
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
