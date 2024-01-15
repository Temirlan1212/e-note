import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Alert, Box, Collapse, Typography } from "@mui/material";
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
import { IPersonSchema } from "@/validator-schemas/person";
import ExpandingFields from "@/components/fields/ExpandingFields";

enum tundukFieldNames {
  name = "firstName",
}

interface IBaseEntityFields {
  id?: number;
  version?: number;
  $version?: number;
}

export interface ITabListItem {
  getElement: (index: number, loading?: boolean, isTundukFieldsOpen?: boolean, expand?: boolean) => JSX.Element;
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
  const tabsRef = useRef<ITabsRef>(null);

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
  const [expandAdditionalFields, setExpandAdditionalFields] = useState(false);
  const [tabsErrorsCounts, setTabsErrorsCounts] = useState<Record<number, number>>({});
  const [items, setItems] = useState<ITabListItem[]>([
    {
      getElement(index: number, loading?: boolean, isTundukFieldsOpen?: boolean, expand?: boolean) {
        const partnerType = watch(`members.${index}.partnerTypeSelect`);
        const isForeigner = watch(`members.${index}.foreigner`);

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
              disableFields={isTundukFieldsOpen}
              fields={{
                subjectRole: true,
              }}
              onPinCheck={() => handlePinCheck(index)}
              onPinReset={() => handlePinReset(index)}
            />

            <ExpandingFields title="Additional information" permanentExpand={expand}>
              <Box display="flex" gap="20px" flexDirection="column">
                {partnerType != 1 && (
                  <>
                    <Typography variant="h5">{t("Identity document")}</Typography>
                    <IdentityDocument
                      disableFields={isTundukFieldsOpen}
                      form={form}
                      fields={{
                        nationality: true,
                        maritalStatus: true,
                      }}
                      names={getIdentityDocumentNames(index)}
                    />
                  </>
                )}

                <Typography variant="h5">
                  {partnerType == 1 || isForeigner ? t("Address") : t("Place of residence")}
                </Typography>
                <Address
                  form={form}
                  isForeigner={isForeigner}
                  names={getAddressNames(index)}
                  disableFields={
                    isTundukFieldsOpen &&
                    !!watch(`members.${index}.passportSeries`) &&
                    !!watch(`members.${index}.passportNumber`)
                  }
                  sx={{
                    labelsSx: { fontWeight: 600 },
                    inputSx: { ".MuiInputBase-root": { fontWeight: 500 } },
                  }}
                />

                {partnerType != 1 && !isForeigner && (
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

  const { update: partnerUpdate } = useFetch("", "PUT");
  const { update: applicationUpdate } = useFetch("", "PUT");
  const { update: applicationFetch } = useFetch("", "POST");
  const {
    data: tundukData,
    update: tundukPersonalDataFetch,
    loading: tundukPersonalDataLoading,
  } = useFetch("", "POST");

  const isEditableCopy = watch("isToPrintLineSubTotal") as boolean;
  const isFieldsOpen = watch("openFields") as boolean;

  useEffectOnce(async () => {
    const members = getValues("members");

    const updateSubjectRole = (memberIndex: number) => {
      const subjectRole = getValues(`members.${memberIndex}.subjectRole`);
      if (subjectRole === "") {
        setValue(`members.${memberIndex}.subjectRole`, "member");
      }
    };

    for (let i = 0; i < (members?.length as number) ?? 0; i++) {
      updateSubjectRole(i);
    }

    const lastIndex = (members?.length as number) - 1;
    if (lastIndex >= 0) {
      await tabsRef.current?.handleTabChange(lastIndex);
    }
  }, [items]);

  const getTundukParamsFields = (index: number) =>
    ({
      tundukDocumentSeries: `members.${index}.passportSeries`,
      tundukDocumentNumber: `members.${index}.passportNumber`,
    }) as const;

  const getPersonalDataNames = (index: number) => ({
    type: `members.${index}.partnerTypeSelect`,
    foreigner: `members.${index}.foreigner`,
    picture: `members.${index}.picture`,
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
    subjectRole: `members.${index}.subjectRole`,
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
    nationality: `members.${index}.nationality`,
    maritalStatus: `members.${index}.maritalStatus`,
    issueDate: `members.${index}.dateOfIssue`,
    subjectRole: `members.${index}.subjectRole`,
    familyStatus: `members.${index}.familyStatus`,
    passportStatus: `members.${index}.passportStatus`,
  });

  const getAddressNames = (index: number) => ({
    region: `members.${index}.mainAddress.region`,
    district: `members.${index}.mainAddress.district`,
    city: `members.${index}.mainAddress.city`,
    street: `members.${index}.mainAddress.addressL4`,
    house: `members.${index}.mainAddress.addressL3`,
    apartment: `members.${index}.mainAddress.addressL2`,
    foreignAddress: `members.${index}.foreignAddress`,
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
      let newMembers: IPersonSchema[] = [];
      if (isEditableCopy && values.members) {
        newMembers = await Promise.all(
          values.members.map(async (value) => {
            const { id, version, emailAddress, ...rest } = value;
            return await partnerUpdate("/api/user/partners/create", rest).then((res) => res.data[0]);
          })
        );
      }
      const data: Partial<IApplicationSchema> = {
        id: values.id,
        version: values.version,
        members: newMembers.length > 0 ? newMembers : values.members,
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
    resetFields(index, { skip: ["partnerTypeSelect", "subjectRole"] });
  };

  const handlePinCheck = async (index: number) => {
    const typeName: any = getPersonalDataNames(index).type;
    const isJuridicalPerson = watch(typeName) == 1;

    const values = getValues();
    const entity = "members";

    const triggerFields = [getPersonalDataNames(index).pin as any];
    const validated = await trigger(triggerFields);

    if (!validated) return;

    if (values[entity] != null) {
      const pin = values[entity][index].personalNumber;
      const series = values[entity][index].passportSeries;
      const number = values[entity][index].passportNumber;

      let url = `person/${pin}`;
      if (!!series && !!number) url = `individual?pin=${pin}&series=${series}&number=${number}`;
      if (isJuridicalPerson) url = `company/${pin}`;

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
        skip: [
          "partnerTypeSelect",
          "passportNumber",
          "passportSeries",
          "personalNumber",
          "subjectRole",
          "firstName",
          "lastName",
          "middleName",
        ],
      });
      setValue(`members.${index}.disabled`, true);
      setExpandAdditionalFields(false);

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
        if (fieldLastItem === "passportStatus" && partner?.voidStatus != null) {
          setValue(field, partner.voidStatus);
          return;
        }
        if (value != null && fieldLastItem !== "partnerTypeSelect") {
          setValue(field, value);
        }
      });
    }
  };

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
  });

  const translatedError = tundukData?.data?.message?.replace(/[.:]/g, "");

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <StepperContentStep step={4} title={t("fifth-step-title")} />

      <Collapse in={alertOpen}>
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          {t(translatedError || "Something went wrong")}
        </Alert>
      </Collapse>

      <Tabs
        data={items.map(({ getElement }, index) => {
          return {
            tabErrorsCount: tabsErrorsCounts[index] ?? 0,
            tabLabel: `${t("Member")} ${index + 1}`,
            tabPanelContent: getElement(
              index,
              tundukPersonalDataLoading,
              isFieldsOpen,
              expandAdditionalFields
              // || watch(`requester.${index}.disabled`)
            ) ?? <></>,
          };
        })}
        actionsContent={
          !isEditableCopy && (
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
          )
        }
        onTabChange={(index) => attachedFilesRef.current?.tabChange(index)}
        ref={tabsRef}
      />

      <Box width="fit-content" position="sticky" bottom="20px" display="flex" gap="20px" flexDirection="row">
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
