import { useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { format } from "date-fns";
import { IApplicationSchema } from "@/validator-schemas/application";
import { useProfileStore } from "@/stores/profile";
import { IUserData } from "@/models/profile/user";
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

let timer: ReturnType<typeof setTimeout> | null = null;

interface IVersionFields {
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
  const profile = useProfileStore.getState();
  const t = useTranslations();

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
    name: "requester",
  });

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [userData, setUserData] = useState<IUserData | null>(null);
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
    setUserData(profile.getUserData());
  }, [profile]);

  useEffectOnce(() => {
    const subscription = watch(({ requester }, { name }) => {
      const path = name?.split(".");

      if (!path || (path && (path[0] !== "requester" || path[path.length - 1] !== "personalNumber"))) return;

      if (timer != null) clearTimeout(timer);

      timer = setTimeout(async () => {
        let pin: any = requester;

        path.slice(1).map((item: string) => {
          pin = pin[item];
        });

        if (!pin) {
          setAlertOpen(true);
          return;
        }

        const personalData = await tundukPersonalDataFetch(`/api/tunduk/personal-data/${pin}`);

        if (personalData?.status !== 0 || personalData?.data == null) {
          setAlertOpen(true);
          return;
        }

        setAlertOpen(false);
        setTundukValues(personalData.data);
      }, 1111);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffectOnce(() => {
    const values = getValues();
    const itemsLength = values.requester?.length ?? 1;
    if (itemsLength > 1) {
      for (let i = 0; i < itemsLength - 1; i++) {
        handleAddTabClick();
      }
    }
  });

  const setTundukValues = (values: Record<string, any>) => {
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

    allFields.map((field: any) => {
      const fieldPath = field.split(".");
      const fieldLastItem = fieldPath[fieldPath.length - 1];
      const tundukField = tundukFieldNames[fieldLastItem as keyof typeof tundukFieldNames];
      if (values[tundukField ?? fieldLastItem] != null && fieldLastItem !== "personalNumber") {
        setValue(field, values[tundukField ?? fieldLastItem]);
      }
    });
  };

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

        const applicationData = await applicationFetch(`/api/applications/${values.id}`, {
          fields: ["version"],
          related: {
            requester: ["version", "emailAddress.version", "mainAddress.version", "actualResidenceAddress.version"],
          },
        });

        if (applicationData?.status === 0 && applicationData?.data[0]?.id != null) {
          applicationData.data[0]?.requester?.map(
            (
              item: IVersionFields & {
                mainAddress?: IVersionFields;
                actualResidenceAddress?: IVersionFields;
                emailAddress?: IVersionFields;
              },
              index: number
            ) => {
              setValue(`requester.${index}.version`, item.version ?? item.$version);
              setValue(
                `requester.${index}.mainAddress.version`,
                item.mainAddress?.version ?? item?.mainAddress?.$version
              );
              setValue(
                `requester.${index}.actualResidenceAddress.version`,
                item?.actualResidenceAddress?.version ?? item?.actualResidenceAddress?.$version
              );
              setValue(
                `requester.${index}.emailAddress.version`,
                item?.emailAddress?.version ?? item?.emailAddress?.$version
              );
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
          <Button loading={loading} onClick={handleNextClick} endIcon={<ArrowForwardIcon />}>
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}