import { Dispatch, SetStateAction, useState } from "react";
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
import UploadFiles from "@/components/fields/UploadFiles";

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
  onNext?: Function;
}

export default function FourthStepFields({ form, stepState, onPrev, onNext }: IStepFieldsProps) {
  const userData = useProfileStore((state) => state.userData);
  const t = useTranslations();

  const {
    control,
    trigger,
    getValues,
    setValue,
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
            <UploadFiles />
          </Box>
        );
      },
    },
  ]);

  const { update: applicationCreate } = useFetch("", "POST");
  const { update: applicationFetch } = useFetch("", "POST");
  const { update: tundukPersonalDataFetch } = useFetch("", "POST");

  const getPersonalDataNames = (index: number) => ({
    type: `requester.${index}.partnerTypeSelect`,
    foreigner: `requester.${index}.foreigner`,
    lastName: `requester.${index}.lastName`,
    firstName: `requester.${index}.name`,
    middleName: `requester.${index}.middleName`,
    pin: `requester.${index}.personalNumber`,
    birthDate: `requester.${index}.birthDate`,
    citizenship: `requester.${index}.citizenship`,
    knowledgeLanguage: `requester.${index}.knowledgeLanguage`,
    nameOfCompanyOfficial: `requester.${index}.nameOfCompanyOfficial`,
    nameOfCompanyGov: `requester.${index}.nameOfCompanyGov`,
    representativesName: `requester.${index}.representativesName`,
    notaryForeignParticipation: `requester.${index}.notaryForeignParticipation`,
    notaryRegistrationNumber: `requester.${index}.notaryRegistrationNumber`,
    notaryOKPONumber: `requester.${index}.notaryOKPONumber`,
    notaryPhysicalParticipantsQty: `requester.${index}.notaryPhysicalParticipantsQty`,
    notaryLegalParticipantsQty: `requester.${index}.notaryLegalParticipantsQty`,
    notaryTotalParticipantsQty: `requester.${index}.notaryTotalParticipantsQty`,
  });

  const getIdentityDocumentNames = (index: number) => ({
    documentType: `requester.${index}.identityDocument`,
    documentSeries: `requester.${index}.passportSeries`,
    documentNumber: `requester.${index}.passportNumber`,
    organType: `requester.${index}.authority`,
    organNumber: `requester.${index}.authorityNumber`,
    issueDate: `requester.${index}.dateOfIssue`,
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

  const handleNextClick = async () => {
    const validated = await triggerFields();

    if (validated) {
      setLoading(true);

      const values = getValues();
      const data: Partial<IApplicationSchema> & { creationDate: string } = {
        id: values.id,
        version: values.version,
        creationDate: format(new Date(), "yyyy-MM-dd"),
        company: { id: userData?.id },
        requester: values.requester,
      };

      let url = "/api/applications/create";
      if (values.id != null) {
        url = `/api/applications/update/${values.id}`;
        data.id = values.id;
        data.version = values.version;
      }

      const result = await applicationCreate(url, data);
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

  const handlePinCheck = async (index: number) => {
    const values = getValues();

    setValue(`requester.${index}.id`, null);
    setValue(`requester.${index}.version`, null);

    if (values.requester != null && values.requester[index].personalNumber) {
      const pin = values.requester[index].personalNumber;
      const personalData = await tundukPersonalDataFetch(`/api/tunduk/personal-data/${pin}`);

      if (personalData?.status !== 0 || personalData?.data == null) {
        setAlertOpen(true);
        return;
      }

      setAlertOpen(false);
      setValue(`requester.${index}.id`, personalData.data["id"]);
      setValue(`requester.${index}.version`, personalData.data["version"]);

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

      allFields.map((field: any) => {
        const fieldPath = field.split(".");
        const fieldLastItem = fieldPath[fieldPath.length - 1];
        const tundukField = tundukFieldNames[fieldLastItem as keyof typeof tundukFieldNames];
        if (personalData.data[tundukField ?? fieldLastItem] != null && fieldLastItem !== "personalNumber") {
          setValue(field, personalData.data[tundukField ?? fieldLastItem]);
        }
      });
    }
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
          {t("Choose requester")}
        </Typography>
      </Box>

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
