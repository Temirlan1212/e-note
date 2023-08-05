import { useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn, useFieldArray } from "react-hook-form";
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

export interface ITabListItem {
  getElement: (index: number) => JSX.Element;
}

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

export default function FifthStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();

  const {
    control,
    trigger,
    formState: { errors },
  } = form;

  const { remove } = useFieldArray({
    control,
    name: "members",
  });

  const getPersonalDataNames = (index: number) => ({
    type: `members.${index}.partnerTypeSelect`,
    foreigner: `members.${index}.partner.foreigner`,
    lastName: `members.${index}.lastName`,
    firstName: `members.${index}.name`,
    middleName: `members.${index}.middleName`,
    pin: `members.${index}.personalNumber`,
    birthDate: `members.${index}.birthDate`,
    citizenship: `members.${index}.citizenship.id`,
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
    region: `members.${index}.partnerAddressList.0.address.region.id`,
    district: `members.${index}.partnerAddressList.0.address.district.id`,
    city: `members.${index}.partnerAddressList.0.address.city.id`,
    street: `members.${index}.partnerAddressList.0.address.addressL4`,
    house: `members.${index}.partnerAddressList.0.address.addressL3`,
    apartment: `members.${index}.partnerAddressList.0.address.addressL2`,
  });

  const getActualAddressNames = (index: number) => ({
    region: `members.${index}.partnerAddressList.1.address.region.id`,
    district: `members.${index}.partnerAddressList.1.address.district.id`,
    city: `members.${index}.partnerAddressList.1.address.city.id`,
    street: `members.${index}.partnerAddressList.1.address.addressL4`,
    house: `members.${index}.partnerAddressList.1.address.addressL3`,
    apartment: `members.${index}.partnerAddressList.1.address.addressL2`,
  });

  const getContactNames = (index: number) => ({
    email: `members.${index}.emailAddress.address`,
    phone: `members.${index}.mobilePhone`,
  });

  const [tabsErrorsCounts, setTabsErrorsCounts] = useState<Record<number, number>>({});

  const [members, setMembers] = useState<ITabListItem[]>([
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

  const triggerFields = async () => {
    const allFields = members.reduce((acc: string[], _, index: number) => {
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

      for (const [index, member] of Object.entries(errors.members)) {
        if (member == null) continue;
        const count = Object.keys(member);
        tabsErrorsCounts[parseInt(index)] = count.length;
      }

      setTabsErrorsCounts(tabsErrorsCounts);
    }

    return validated;
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async () => {
    const validated = await triggerFields();
    if (onNext != null && validated) onNext();
  };

  const handleAddTabClick = () => {
    setMembers((prev) => {
      const lastItem = prev[prev.length - 1];

      if (lastItem == null) return [...prev];

      const newItem = { ...lastItem };

      return [...prev, newItem];
    });
  };

  const handleRemoveTabClick = () => {
    setMembers((prev) => {
      if (prev.length <= 1) return [...prev];

      remove(prev.length - 1);

      const next = prev.filter((_, index) => index != prev.length - 1);

      return [...next];
    });
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
          {t("fifth-step-title")}
        </Typography>
      </Box>

      <Tabs
        data={members.map((member, index) => {
          return {
            tabErrorsCount: tabsErrorsCounts[index] ?? 0,
            tabLabel: `${t("Member")} ${index + 1}`,
            tabPanelContent: member.getElement(index) ?? <></>,
          };
        })}
        actionsContent={
          <>
            <Button
              buttonType={"primary"}
              sx={{ flex: 0, minWidth: "auto", padding: "10px" }}
              onClick={handleAddTabClick}
            >
              <AddIcon />
            </Button>
            <Button
              buttonType={"secondary"}
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
