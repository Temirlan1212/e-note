import { useRef, useState } from "react";
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
import { IPersonSchema } from "@/validator-schemas/person";

enum tundukFieldNames {
  name = "firstName",
}

interface IBaseEntityFields {
  id?: number;
  version?: number;
  $version?: number;
}

export interface ITabListItem {
  getElement: (index: number, loading?: boolean) => JSX.Element;
}

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function;
  onNext?: (arg: { step: number | undefined }) => void;
  handleStepNextClick?: Function;
}

export default function FourthStepFields({ form, onPrev, onNext, handleStepNextClick }: IStepFieldsProps) {
  const t = useTranslations();
  const attachedFilesRef = useRef<IAttachedFilesMethodsProps>(null);

  const {
    control,
    trigger,
    watch,
    getValues,
    setValue,
    resetField,
    formState: { errors },
  } = form;

  const { remove } = useFieldArray({
    control,
    name: "members",
  });

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [tabsErrorsCounts, setTabsErrorsCounts] = useState<Record<number, number>>({});
  const [items, setItems] = useState<ITabListItem[]>([
    {
      getElement(index: number, loading?: boolean) {
        const partnerType = watch(`members.${index}.partnerTypeSelect`);

        return (
          <Box display="flex" gap="20px" flexDirection="column">
            <Typography variant="h5">{t("Personal data")}</Typography>
            <PersonalData
              form={form}
              loading={loading}
              names={{
                ...getPersonalDataNames(index),
                ...getTundukParamsFields(index),
              }}
              disableFields={watch(`members.${index}.disabled`)}
              fields={{
                nationality: true,
                maritalStatus: true,
              }}
              onPinCheck={() => handlePinCheck(index)}
              onPinReset={() => handlePinReset(index)}
            />

            {partnerType != 1 && (
              <>
                <Typography variant="h5">{t("Identity document")}</Typography>
                <IdentityDocument
                  disableFields={watch(`members.${index}.disabled`)}
                  form={form}
                  names={getIdentityDocumentNames(index)}
                />
              </>
            )}

            <Typography variant="h5">{partnerType != 1 ? t("Place of residence") : t("Address")}</Typography>
            <Address
              form={form}
              names={getAddressNames(index)}
              disableFields={
                watch(`members.${index}.disabled`) &&
                !!watch(`members.${index}.tundukPassportSeries`) &&
                !!watch(`members.${index}.tundukPassportNumber`)
              }
            />

            {partnerType != 1 && (
              <>
                <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap="10px">
                  <Typography variant="h5">{t("Actual place of residence")}</Typography>
                  <Button
                    sx={{ width: "fit-content" }}
                    onClick={() => {
                      Object.entries(getAddressNames(index) ?? {})?.map(([key, name]) => {
                        setValue((getActualAddressNames(index) as any)[key], getValues(name as any));
                      });
                    }}
                  >
                    {t("Copy the place of residence")}
                  </Button>
                </Box>

                <Address form={form} names={getActualAddressNames(index)} />
              </>
            )}

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
  const { update: tundukPersonalDataFetch, loading: tundukPersonalDataLoading } = useFetch("", "POST");

  const getTundukParamsFields = (index: number) =>
    ({
      tundukDocumentSeries: `members.${index}.tundukPassportSeries`,
      tundukDocumentNumber: `members.${index}.tundukPassportNumber`,
      tundukPersonalNumber: `members.${index}.tundukPersonalNumber`,
    }) as const;

  const getPersonalDataNames = (index: number) => ({
    type: `members.${index}.partnerTypeSelect`,
    foreigner: `members.${index}.foreigner`,
    lastName: `members.${index}.lastName`,
    firstName: `members.${index}.name`,
    middleName: `members.${index}.middleName`,
    pin: `members.${index}.personalNumber`,
    birthDate: `members.${index}.birthDate`,
    citizenship: `members.${index}.citizenship`,
    nameOfCompanyOfficial: `members.${index}.nameOfCompanyOfficial`,
    nameOfCompanyGov: `members.${index}.nameOfCompanyGov`,
    representativesName: `members.${index}.representativesName`,
    notaryRegistrationNumber: `members.${index}.notaryRegistrationNumber`,
    notaryOKPONumber: `members.${index}.notaryOKPONumber`,
    notaryPhysicalParticipantsQty: `members.${index}.notaryPhysicalParticipantsQty`,
    notaryLegalParticipantsQty: `members.${index}.notaryLegalParticipantsQty`,
    notaryTotalParticipantsQty: `members.${index}.notaryTotalParticipantsQty`,
    notaryDateOfOrder: `members.${index}.notaryDateOfOrder`,
    nationality: `members.${index}.nationality`,
    maritalStatus: `members.${index}.maritalStatus`,
  });

  const getIdentityDocumentNames = (index: number) => ({
    documentType: `members.${index}.identityDocument`,
    documentSeries: `members.${index}.passportSeries`,
    documentNumber: `members.${index}.passportNumber`,
    organType: `members.${index}.authority`,
    organNumber: `members.${index}.authorityNumber`,
    issueDate: `members.${index}.dateOfIssue`,
    familyStatus: `members.${index}.familyStatus`,
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

  const resetFields = (index: number, options?: { skip?: (keyof IPersonSchema)[] }) => {
    const allFields = {
      ...getPersonalDataNames(index),
      ...getIdentityDocumentNames(index),
      ...getAddressNames(index),
      ...getTundukParamsFields(index),
    };

    for (const key in allFields) {
      const name = (allFields as Record<string, any>)?.[key];
      const value = getValues(name as any);
      const isBoolean = typeof value === "boolean";
      const isString = typeof value === "string";
      const fieldPath = name.split(".");
      const fieldLastItem = fieldPath[fieldPath.length - 1];

      if (options?.skip?.includes(fieldLastItem)) continue;

      if (isBoolean) {
        resetField(name as any, { defaultValue: false });
      } else if (
        fieldLastItem === "notaryDateOfOrder" ||
        fieldLastItem === "dateOfIssue" ||
        fieldLastItem === "birthDate" ||
        fieldLastItem === "notaryOKPONumber" ||
        !isString
      ) {
        resetField(name as any, { defaultValue: null });
      } else if (isString) {
        resetField(name as any, { defaultValue: "" });
      }
    }
  };

  const handlePinReset = async (index: number) => {
    setValue(`members.${index}.disabled`, false);
    resetFields(index, { skip: ["partnerTypeSelect"] });
  };

  const handlePinCheck = async (index: number) => {
    const typeName: any = getPersonalDataNames(index).type;
    const isJuridicalPerson = watch(typeName) == 1;

    const values = getValues();
    const entity = "members";

    const triggerFields = [getTundukParamsFields(index).tundukDocumentNumber] as const;
    const validated = await trigger(triggerFields);

    if (!validated) return;

    if (values[entity] != null) {
      const pin = values[entity][index].tundukPersonalNumber;
      const series = values[entity][index].tundukPassportSeries;
      const number = values[entity][index].tundukPassportNumber;

      let url = isJuridicalPerson ? `company/${pin}` : `person/${pin}`;
      if (!!series && !!number) url = `individual?pin=${pin}&series=${series}&number=${number}`;

      const personalData: Record<string, any> = await tundukPersonalDataFetch(`/api/tunduk`, {
        model: `/ws/tunduk/${url}`,
      });

      if (personalData?.status !== 0 || personalData?.data == null) {
        setAlertOpen(true);
        return;
      }

      const partner = personalData.data;

      if (partner == null) {
        setAlertOpen(true);
        return;
      }
      setAlertOpen(false);

      resetFields(index, {
        skip: ["partnerTypeSelect", "tundukPassportNumber", "tundukPassportSeries", "tundukPersonalNumber"],
      });
      setValue(`members.${index}.disabled`, true);

      const emailAddressName = isJuridicalPerson ? partner?.emailAddress?.name : partner?.emailAddress;
      setValue(`${entity}.${index}.emailAddress.address`, emailAddressName ?? "");

      const baseFields = [
        ...Object.values(getPersonalDataNames(index)),
        ...Object.values(getIdentityDocumentNames(index)),
        ...Object.values(getAddressNames(index)),
      ];

      baseFields.map((field: any) => {
        const fieldPath = field.split(".");
        const fieldLastItem = fieldPath[fieldPath.length - 1];
        const tundukField = tundukFieldNames[fieldLastItem as keyof typeof tundukFieldNames];
        const value = partner[tundukField ?? fieldLastItem] ?? partner?.mainAddress?.[tundukField ?? fieldLastItem];
        if (value != null && fieldLastItem !== "partnerTypeSelect") {
          setValue(field, value);
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
            tabPanelContent: getElement(index, tundukPersonalDataLoading) ?? <></>,
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
