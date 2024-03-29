import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Tabs, { ITabsRef } from "@/components/ui/Tabs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Address from "@/components/fields/Address";
import IdentityDocument from "@/components/fields/IdentityDocument";
import Contact from "@/components/fields/Contact";
import PersonalData from "@/components/fields/PersonalData";
import StepperContentStep from "@/components/ui/StepperContentStep";
import AttachedFiles, { IAttachedFilesMethodsProps } from "@/components/fields/AttachedFiles";
import ExpandingFields from "@/components/fields/ExpandingFields";

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
  onNext?: (arg: { step: number | undefined }) => void;
  handleStepNextClick?: Function;
}

export default function FourthStepFields({ form, onPrev, onNext, handleStepNextClick }: IStepFieldsProps) {
  const t = useTranslations();
  const attachedFilesRef = useRef<IAttachedFilesMethodsProps>(null);
  const tabsRef = useRef<ITabsRef>(null);

  const {
    control,
    trigger,
    watch,
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
        const partnerType = watch(`members.${index}.partnerTypeSelect`);

        return (
          <Box display="flex" gap="20px" flexDirection="column">
            <Typography variant="h5">{t("Personal data")}</Typography>
            <PersonalData
              form={form}
              names={getPersonalDataNames(index)}
              fields={{
                tundukDocumentSeries: index === 0,
                tundukDocumentNumber: index === 0,
              }}
            />

            <ExpandingFields title="Additional information" permanentExpand={false}>
              <Box display="flex" gap="20px" flexDirection="column">
                {partnerType != 1 && (
                  <>
                    <Typography variant="h5">{t("Identity document")}</Typography>
                    <IdentityDocument form={form} names={getIdentityDocumentNames(index)} />
                  </>
                )}

                <Typography variant="h5">{partnerType != 1 ? t("Place of residence") : t("Address")}</Typography>
                <Address
                  form={form}
                  names={getAddressNames(index)}
                  sx={{
                    labelsSx: { fontWeight: 600 },
                    inputSx: { ".MuiInputBase-root": { fontWeight: 500 } },
                  }}
                />

                {partnerType != 1 && (
                  <>
                    <Typography variant="h5">{t("Actual place of residence")}</Typography>
                    <Address
                      form={form}
                      names={getActualAddressNames(index)}
                      sx={{
                        labelsSx: { fontWeight: 600 },
                        inputSx: { ".MuiInputBase-root": { fontWeight: 500 } },
                      }}
                    />
                  </>
                )}

                <Typography variant="h5">{t("Contacts")}</Typography>
                <Contact
                  form={form}
                  names={getContactNames(index)}
                  sx={{
                    labelsSx: { fontWeight: 600 },
                    inputSx: { ".MuiInputBase-root": { fontWeight: 500 } },
                  }}
                />

                <Typography variant="h5">{t("Files to upload")}</Typography>

                <AttachedFiles form={form} ref={attachedFilesRef} name="members" index={index} />
              </Box>
            </ExpandingFields>
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
    firstName: `members.${index}.firstName`,
    name: `members.${index}.name`,
    middleName: `members.${index}.middleName`,
    pin: `members.${index}.personalNumber`,
    nameOfCompanyOfficial: `members.${index}.nameOfCompanyOfficial`,
    nameOfCompanyGov: `members.${index}.nameOfCompanyGov`,
    representativesName: `members.${index}.representativesName`,
    notaryRegistrationNumber: `members.${index}.notaryRegistrationNumber`,
    notaryOKPONumber: `members.${index}.notaryOKPONumber`,
    notaryPhysicalParticipantsQty: `members.${index}.notaryPhysicalParticipantsQty`,
    notaryLegalParticipantsQty: `members.${index}.notaryLegalParticipantsQty`,
    notaryTotalParticipantsQty: `members.${index}.notaryTotalParticipantsQty`,
    notaryDateOfOrder: `members.${index}.notaryDateOfOrder`,
  });

  const getIdentityDocumentNames = (index: number) => ({
    documentType: `members.${index}.identityDocument`,
    documentSeries: `members.${index}.passportSeries`,
    documentNumber: `members.${index}.passportNumber`,
    organType: `members.${index}.authority`,
    organNumber: `members.${index}.authorityNumber`,
    foreigner: `members.${index}.foreigner`,
    birthDate: `members.${index}.birthDate`,
    citizenship: `members.${index}.citizenship`,
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

  const focusToFieldOnError = async () => {
    const entity = "members" as const;
    if (errors != null && Array.isArray(errors?.[entity])) {
      for (var i = 0; i < errors[entity].length; i++) {
        const name = Object.keys(errors[entity][i] ?? {})[0];
        if (!!name) {
          await tabsRef.current?.handleTabChange(i);
          form.setFocus(`${entity}.${i}.${name}` as any);
          break;
        }
      }
    }
  };

  const handleNextClick = async (targetStep?: number) => {
    const validated = await triggerFields();

    if (!validated) focusToFieldOnError();

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

        await attachedFilesRef.current?.next();

        if (onNext != null) onNext({ step: targetStep });
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

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
  });

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
        onTabChange={(index) => attachedFilesRef.current?.tabChange(index)}
        ref={tabsRef}
      />

      <Box
        width="fit-content"
        position="sticky"
        bottom="30px"
        display="flex"
        gap="20px"
        flexDirection={{ xs: "column", md: "row" }}
      >
        {onPrev != null && (
          <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />} sx={{ width: "auto" }}>
            {t("Prev")}
          </Button>
        )}
        {onNext != null && (
          <Button
            loading={loading}
            onClick={() => handleNextClick()}
            endIcon={<ArrowForwardIcon />}
            sx={{ width: "auto" }}
            disabled={!!errors?.members?.length}
          >
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
