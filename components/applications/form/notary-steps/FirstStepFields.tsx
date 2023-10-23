import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { format } from "date-fns";
import { IApplicationSchema } from "@/validator-schemas/application";
import { useProfileStore } from "@/stores/profile";
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

export default function FirstStepFields({ form, onPrev, onNext, handleStepNextClick }: IStepFieldsProps) {
  const userData = useProfileStore((state) => state.userData);
  const t = useTranslations();
  const attachedFilesRef = useRef<IAttachedFilesMethodsProps>(null);

  const {
    control,
    trigger,
    getValues,
    setValue,
    watch,
    resetField,
    formState: { errors },
  } = form;

  const { remove } = useFieldArray({
    control,
    name: "requester",
  });

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [tabsErrorsCounts, setTabsErrorsCounts] = useState<Record<number, number>>({});
  const [items, setItems] = useState<ITabListItem[]>([
    {
      getElement(index: number, loading?: boolean) {
        const partnerType = watch(`requester.${index}.partnerTypeSelect`);

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
              disableFields={watch(`requester.${index}.disabled`)}
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
                  disableFields={watch(`requester.${index}.disabled`)}
                  form={form}
                  names={getIdentityDocumentNames(index)}
                />
              </>
            )}

            <Typography variant="h5">{partnerType != 1 ? t("Place of residence") : t("Address")}</Typography>
            <Address form={form} names={getAddressNames(index)} disableFields={watch(`requester.${index}.disabled`)} />

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

            <AttachedFiles form={form} ref={attachedFilesRef} name="requester" index={index} />
          </Box>
        );
      },
    },
  ]);

  const { update: applicationCreate } = useFetch("", "POST");
  const { update: applicationUpdate } = useFetch("", "PUT");
  const { update: applicationFetch } = useFetch("", "POST");
  const { update: tundukPersonalDataFetch, loading: tundukPersonalDataLoading } = useFetch("", "POST");

  const getTundukParamsFields = (index: number) =>
    ({
      tundukDocumentSeries: `requester.${index}.tundukPassportSeries`,
      tundukDocumentNumber: `requester.${index}.tundukPassportNumber`,
      tundukPersonalNumber: `requester.${index}.tundukPersonalNumber`,
    }) as const;

  const getPersonalDataNames = (index: number) => ({
    type: `requester.${index}.partnerTypeSelect`,
    foreigner: `requester.${index}.foreigner`,
    image: `requester.${index}.image`,
    lastName: `requester.${index}.lastName`,
    firstName: `requester.${index}.name`,
    middleName: `requester.${index}.middleName`,
    pin: `requester.${index}.personalNumber`,
    birthDate: `requester.${index}.birthDate`,
    citizenship: `requester.${index}.citizenship`,
    nameOfCompanyOfficial: `requester.${index}.nameOfCompanyOfficial`,
    nameOfCompanyGov: `requester.${index}.nameOfCompanyGov`,
    representativesName: `requester.${index}.representativesName`,
    notaryRegistrationNumber: `requester.${index}.notaryRegistrationNumber`,
    notaryOKPONumber: `requester.${index}.notaryOKPONumber`,
    notaryPhysicalParticipantsQty: `requester.${index}.notaryPhysicalParticipantsQty`,
    notaryLegalParticipantsQty: `requester.${index}.notaryLegalParticipantsQty`,
    notaryTotalParticipantsQty: `requester.${index}.notaryTotalParticipantsQty`,
    notaryDateOfOrder: `requester.${index}.notaryDateOfOrder`,
    nationality: `requester.${index}.nationality`,
    maritalStatus: `requester.${index}.maritalStatus`,
  });

  const getIdentityDocumentNames = (index: number) => ({
    documentType: `requester.${index}.identityDocument`,
    documentSeries: `requester.${index}.passportSeries`,
    documentNumber: `requester.${index}.passportNumber`,
    organType: `requester.${index}.authority`,
    organNumber: `requester.${index}.authorityNumber`,
    issueDate: `requester.${index}.dateOfIssue`,
    familyStatus: `requester.${index}.familyStatus`,
  });

  const getAddressNames = (index: number) => ({
    region: `requester.${index}.mainAddress.region`,
    district: `requester.${index}.mainAddress.district`,
    city: `requester.${index}.mainAddress.city`,
    street: `requester.${index}.mainAddress.addressL4`,
    house: `requester.${index}.mainAddress.addressL3`,
    apartment: `requester.${index}.mainAddress.addressL2`,
  });

  const getActualAddressNames = (index: number) => ({
    region: `requester.${index}.actualResidenceAddress.region`,
    district: `requester.${index}.actualResidenceAddress.district`,
    city: `requester.${index}.actualResidenceAddress.city`,
    street: `requester.${index}.actualResidenceAddress.addressL4`,
    house: `requester.${index}.actualResidenceAddress.addressL3`,
    apartment: `requester.${index}.actualResidenceAddress.addressL2`,
  });

  const getContactNames = (index: number) => ({
    email: `requester.${index}.emailAddress.address`,
    phone: `requester.${index}.mobilePhone`,
  });

  useEffectOnce(() => {
    const values = getValues();
    const itemsLength = values.requester?.length ?? 1;
    if (itemsLength > 1) {
      for (let i = 0; i < itemsLength - 1; i++) {
        handleAddTabClick();
      }
    }
  });

  const triggerFields = async () => {
    const allFields = items.reduce(
      (acc: string[], _, index: number) => [
        ...acc,
        ...Object.values(getPersonalDataNames(index)),
        ...Object.values(getIdentityDocumentNames(index)),
        ...Object.values(getAddressNames(index)),
        ...Object.values(getActualAddressNames(index)),
        ...Object.values(getContactNames(index)),
      ],
      []
    );

    const validated = await trigger(allFields as any);

    if (!validated && errors?.requester != null) {
      const tabsErrorsCounts: Record<number, number> = {};

      for (const [index, item] of Object.entries(errors.requester)) {
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
      const data: Partial<IApplicationSchema> & { creationDate: string } = {
        id: values.id,
        version: values.version,
        creationDate: format(new Date(), "yyyy-MM-dd"),
        company: { id: userData?.activeCompany?.id },
        requester: values.requester,
        statusSelect: 2,
        notarySignatureStatus: 2,
      };

      let result = null;
      if (values.id != null) {
        data.id = values.id;
        data.version = values.version;
        result = await applicationUpdate(`/api/applications/update/${values.id}`, data);
      } else {
        result = await applicationCreate("/api/applications/create", data);
      }

      if (result != null && result.data != null && result.data[0]?.id != null) {
        setValue("id", result.data[0].id);
        setValue("version", result.data[0].version);

        const applicationData = await applicationFetch(`/api/applications/${result.data[0].id}`, {
          fields: ["version"],
          related: {
            requester: ["version", "emailAddress.version", "mainAddress.version", "actualResidenceAddress.version"],
          },
        });

        if (applicationData?.status === 0 && applicationData?.data[0]?.id != null) {
          applicationData.data[0]?.requester?.map(
            (
              item: IBaseEntityFields & {
                mainAddress?: IBaseEntityFields;
                actualResidenceAddress?: IBaseEntityFields;
                emailAddress?: IBaseEntityFields;
              },
              index: number
            ) => {
              setValue(`requester.${index}.id`, item.id);
              setValue(`requester.${index}.version`, item.version ?? item.$version);

              if (item.mainAddress?.id != null) {
                setValue(`requester.${index}.mainAddress.id`, item.mainAddress.id);
                setValue(
                  `requester.${index}.mainAddress.version`,
                  item.mainAddress?.version ?? item?.mainAddress?.$version
                );
              }

              if (item.actualResidenceAddress?.id != null) {
                setValue(`requester.${index}.actualResidenceAddress.id`, item.actualResidenceAddress.id);
                setValue(
                  `requester.${index}.actualResidenceAddress.version`,
                  item.actualResidenceAddress?.version ?? item?.actualResidenceAddress?.$version
                );
              }

              if (item.emailAddress?.id != null) {
                setValue(`requester.${index}.emailAddress.id`, item.emailAddress.id);
                setValue(
                  `requester.${index}.emailAddress.version`,
                  item.emailAddress?.version ?? item?.emailAddress?.$version
                );
              }
            }
          );
        }

        await attachedFilesRef.current?.next();

        if (onNext != null) onNext({ step: targetStep });
      }
    }

    setLoading(false);
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
    setValue(`requester.${index}.disabled`, false);
    resetFields(index, { skip: ["partnerTypeSelect"] });
  };

  const handlePinCheck = async (index: number) => {
    const typeName: any = getPersonalDataNames(index).type;
    const isJuridicalPerson = watch(typeName) == 1;

    const values = getValues();
    const entity = "requester";

    const triggerFields = [getTundukParamsFields(index).tundukDocumentNumber] as const;
    const validated = await trigger(
      isJuridicalPerson
        ? triggerFields
        : [
            ...triggerFields,
            getTundukParamsFields(index).tundukDocumentSeries,
            getTundukParamsFields(index).tundukPersonalNumber,
          ]
    );

    if (!validated) return;

    if (values[entity] != null) {
      const pin = values[entity][index].tundukPersonalNumber;
      const series = values[entity][index].tundukPassportSeries;
      const number = values[entity][index].tundukPassportNumber;

      const url = isJuridicalPerson
        ? `/api/tunduk/company-data/${pin}`
        : `/api/tunduk/personal-data?pin=${pin}&series=${series}&number=${number}`;

      const personalData = await tundukPersonalDataFetch(url);

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
      setValue(`requester.${index}.disabled`, true);

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
      <StepperContentStep step={1} title={t("Choose requester")} />

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
