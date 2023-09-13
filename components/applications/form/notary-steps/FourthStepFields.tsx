import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Alert, Box, Collapse, Typography } from "@mui/material";
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
import StepperContentStep from "@/components/ui/StepperContentStep";
import AttachedFiles, { IAttachedFilesMethodsProps } from "@/components/fields/AttachedFiles";

enum tundukFieldNames {
  name = "firstName",
}

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
  stepState: [number, Dispatch<SetStateAction<number>>];
  onPrev?: Function;
  onNext?: (arg: { step: number | undefined }) => void;
  handleStepNextClick?: Function;
}

export default function FourthStepFields({ form, stepState, onPrev, onNext, handleStepNextClick }: IStepFieldsProps) {
  const t = useTranslations();
  const attachedFilesRef = useRef<IAttachedFilesMethodsProps>(null);

  const {
    control,
    trigger,
    resetField,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const [step, setStep] = stepState;

  const { remove } = useFieldArray({
    control,
    name: "members",
  });

  const object = watch("object");

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [tabsErrorsCounts, setTabsErrorsCounts] = useState<Record<number, number>>({});
  const [items, setItems] = useState<ITabListItem[]>([
    {
      getElement(index: number) {
        return (
          <Box display="flex" gap="20px" flexDirection="column">
            <Typography variant="h5">{t("Personal data")}</Typography>
            <PersonalData form={form} names={getPersonalDataNames(index)} onPinCheck={() => handlePinCheck(index)} />

            <Typography variant="h5">{t("Identity document")}</Typography>
            <IdentityDocument form={form} names={getIdentityDocumentNames(index)} />

            <Typography variant="h5">{t("Place of residence")}</Typography>
            <Address form={form} names={getAddressNames(index)} />

            <Typography variant="h5">{t("Actual place of residence")}</Typography>
            <Address form={form} names={getActualAddressNames(index)} />

            <Typography variant="h5">{t("Contacts")}</Typography>
            <Contact form={form} names={getContactNames(index)} />

            <Typography variant="h5">{t("Files to upload")}</Typography>

            <AttachedFiles form={form} ref={attachedFilesRef} name="members" index={index} />
          </Box>
        );
      },
    },
  ]);

  const { update: applicationUpdate } = useFetch("", "PUT");
  const { update: applicationFetch } = useFetch("", "POST");
  const { update: tundukPersonalDataFetch } = useFetch("", "GET");

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
    if (onPrev != null) object == null || !object ? setStep(step - 2) : onPrev();
  };

  const handleNextClick = async (targetStep?: number) => {
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

  const handlePinCheck = async (index: number) => {
    const values = getValues();
    const entity = "members";

    setValue(`${entity}.${index}.id`, null);
    setValue(`${entity}.${index}.version`, null);
    setValue(`${entity}.${index}.mainAddress.id`, null);
    setValue(`${entity}.${index}.mainAddress.version`, null);
    setValue(`${entity}.${index}.actualResidenceAddress.id`, null);
    setValue(`${entity}.${index}.actualResidenceAddress.version`, null);
    setValue(`${entity}.${index}.emailAddress.id`, null);
    setValue(`${entity}.${index}.emailAddress.version`, null);

    if (values[entity] != null && values[entity][index].personalNumber) {
      const pin = values[entity][index].personalNumber;
      const personalData = await tundukPersonalDataFetch(`/api/tunduk/personal-data/${pin}`);

      if (personalData?.status !== 0 || personalData?.data == null) {
        setAlertOpen(true);
        return;
      }

      const partner = personalData.data.partner;
      const mainAddress = personalData.data.mainAddress;
      const actualAddress = personalData.data.actualAddress;
      const emailAddress = personalData.data?.emailAddress;

      if (partner == null || partner.id == null) {
        setAlertOpen(true);
        return;
      }

      setAlertOpen(false);
      setValue(`${entity}.${index}.id`, partner?.id);
      setValue(`${entity}.${index}.version`, partner?.version);
      setValue(`${entity}.${index}.mainAddress.id`, mainAddress?.id);
      setValue(`${entity}.${index}.mainAddress.version`, mainAddress?.version);
      setValue(`${entity}.${index}.actualResidenceAddress.id`, actualAddress?.id);
      setValue(`${entity}.${index}.actualResidenceAddress.version`, actualAddress?.version);
      setValue(`${entity}.${index}.emailAddress.id`, emailAddress?.id);
      setValue(`${entity}.${index}.emailAddress.version`, emailAddress?.version);
      setValue(`${entity}.${index}.emailAddress.address`, emailAddress?.address);

      const baseFields = [
        ...Object.values(getPersonalDataNames(index)),
        ...Object.values(getIdentityDocumentNames(index)),
        ...Object.values(getContactNames(index)),
      ];
      baseFields.map((field: any) => {
        const fieldPath = field.split(".");
        const fieldLastItem = fieldPath[fieldPath.length - 1];
        const tundukField = tundukFieldNames[fieldLastItem as keyof typeof tundukFieldNames];
        if (partner[tundukField ?? fieldLastItem] != null && fieldLastItem !== "personalNumber") {
          setValue(field, partner[tundukField ?? fieldLastItem]);
        }
      });

      const mainAddressFields = [...Object.values(getAddressNames(index))];
      mainAddressFields.map((field: any) => {
        const fieldPath = field.split(".");
        const fieldLastItem = fieldPath[fieldPath.length - 1];
        if (mainAddress[fieldLastItem] != null) {
          setValue(field, mainAddress[fieldLastItem]);
        }
      });

      const actualAddressFields = [...Object.values(getActualAddressNames(index))];
      actualAddressFields.map((field: any) => {
        const fieldPath = field.split(".");
        const fieldLastItem = fieldPath[fieldPath.length - 1];
        if (actualAddress[fieldLastItem] != null) {
          setValue(field, actualAddress[fieldLastItem]);
        }
      });
    }
  };

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
  });

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <StepperContentStep step={4} title={t("fifth-step-title")} />

      <Collapse in={alertOpen}>
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          {t("Sorry, such pin not found")}
        </Alert>
      </Collapse>

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
        onTabChange={(index) => attachedFilesRef.current?.tabChange(index)}
      />

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
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
          >
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
