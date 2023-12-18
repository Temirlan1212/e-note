import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Address from "@/components/fields/Address";
import IdentityDocument from "@/components/fields/IdentityDocument";
import Contact from "@/components/fields/Contact";
import PersonalData from "@/components/fields/PersonalData";
import StepperContentStep from "@/components/ui/StepperContentStep";
import AttachedFiles, { IAttachedFilesMethodsProps } from "@/components/fields/AttachedFiles";
import useEffectOnce from "@/hooks/useEffectOnce";
import { useProfileStore } from "@/stores/profile";
import ExpandingFields from "@/components/fields/ExpandingFields";

interface IBaseEntityFields {
  id?: number;
  version?: number;
  $version?: number;
}

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: (arg: { step: number | undefined }) => void;
  handleStepNextClick?: Function;
}

export default function ThirdStepFields({ form, onPrev, onNext, handleStepNextClick }: IStepFieldsProps) {
  const t = useTranslations();
  const profile = useProfileStore((state) => state);
  const attachedFilesRef = useRef<IAttachedFilesMethodsProps>(null);

  const {
    trigger,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = form;

  const requesterId = watch("requester.0.id");
  const partnerType = watch("requester.0.partnerTypeSelect");

  const [loading, setLoading] = useState(false);
  const [partnerId, setPartnerId] = useState<number>();

  const { data: requesterData } = useFetch(
    partnerId != null && requesterId == null ? `/api/profile/partner/${partnerId}` : "",
    "POST"
  );
  const { update: applicationUpdate } = useFetch("", "PUT");
  const { update: applicationFetch } = useFetch("", "POST");

  const getPersonalDataNames = (index: number) => ({
    type: `requester.${index}.partnerTypeSelect`,
    foreigner: `requester.${index}.foreigner`,
    lastName: `requester.${index}.lastName`,
    firstName: `requester.${index}.firstName`,
    name: `requester.${index}.name`,
    middleName: `requester.${index}.middleName`,
    pin: `requester.${index}.personalNumber`,
    nameOfCompanyOfficial: `requester.${index}.nameOfCompanyOfficial`,
    nameOfCompanyGov: `requester.${index}.nameOfCompanyGov`,
    representativesName: `requester.${index}.representativesName`,
    notaryRegistrationNumber: `requester.${index}.notaryRegistrationNumber`,
    notaryOKPONumber: `requester.${index}.notaryOKPONumber`,
    notaryPhysicalParticipantsQty: `requester.${index}.notaryPhysicalParticipantsQty`,
    notaryLegalParticipantsQty: `requester.${index}.notaryLegalParticipantsQty`,
    notaryTotalParticipantsQty: `requester.${index}.notaryTotalParticipantsQty`,
    notaryDateOfOrder: `requester.${index}.notaryDateOfOrder`,
  });

  const getIdentityDocumentNames = (index: number) => ({
    documentType: `requester.${index}.identityDocument`,
    documentSeries: `requester.${index}.passportSeries`,
    documentNumber: `requester.${index}.passportNumber`,
    organType: `requester.${index}.authority`,
    organNumber: `requester.${index}.authorityNumber`,
    foreigner: `requester.${index}.foreigner`,
    birthDate: `requester.${index}.birthDate`,
    citizenship: `requester.${index}.citizenship`,
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

  const triggerFields = async () => {
    const index = 0;
    const allFields = [
      ...Object.values(getPersonalDataNames(index)),
      ...Object.values(getIdentityDocumentNames(index)),
      ...Object.values(getAddressNames(index)),
      ...Object.values(getActualAddressNames(index)),
      ...Object.values(getContactNames(index)),
    ];

    return await trigger(allFields as any);
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const focusToFieldOnError = () => {
    const entity = "requester" as const;
    if (errors != null && Array.isArray(errors?.[entity])) {
      for (var i = 0; i < errors[entity].length; i++) {
        const name = Object.keys(errors[entity][i] ?? {})[0];
        if (!!name) {
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
        requester: values.requester,
      };

      const result = await applicationUpdate(`/api/applications/update/${values.id}`, data);
      if (result != null && result.data != null && result.data[0]?.id != null) {
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

      setLoading(false);
    }
  };

  useEffectOnce(async () => {
    if (handleStepNextClick != null) handleStepNextClick(handleNextClick);
  });

  useEffectOnce(() => {
    setPartnerId(profile.userData?.partner?.id);
  }, [profile]);

  useEffectOnce(() => {
    if (requesterData?.data?.[0]?.id == null || requesterId != null) return;

    const index = 0;
    setValue("requester", requesterData.data);
    setValue(`requester.${index}.citizenship`, requesterData.data[index].citizenship);
    setValue(`requester.${index}.mainAddress.region`, requesterData.data[index].mainAddress.region);
    setValue(`requester.${index}.mainAddress.district`, requesterData.data[index].mainAddress.district);
    setValue(`requester.${index}.mainAddress.city`, requesterData.data[index].mainAddress.city);
    setValue(
      `requester.${index}.actualResidenceAddress.region`,
      requesterData.data[index].actualResidenceAddress.region
    );
    setValue(
      `requester.${index}.actualResidenceAddress.district`,
      requesterData.data[index].actualResidenceAddress.district
    );
    setValue(`requester.${index}.actualResidenceAddress.city`, requesterData.data[index].actualResidenceAddress.city);
  }, [requesterData]);

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <StepperContentStep step={3} title={t("fourth-step-title")} />

      <Typography variant="h5">{t("Personal data")}</Typography>
      <PersonalData form={form} names={getPersonalDataNames(0)} />

      <ExpandingFields title="Additional information" permanentExpand={false}>
        <Box display="flex" gap="20px" flexDirection="column">
          {partnerType != 1 && (
            <>
              <Typography variant="h5">{t("Identity document")}</Typography>
              <IdentityDocument form={form} names={getIdentityDocumentNames(0)} />
            </>
          )}

          <Typography variant="h5">{partnerType != 1 ? t("Place of residence") : t("Address")}</Typography>
          <Address form={form} names={getAddressNames(0)} />

          {partnerType != 1 && (
            <>
              <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap="10px">
                <Typography variant="h5">{t("Actual place of residence")}</Typography>
                <Button
                  sx={{ width: "fit-content" }}
                  onClick={() => {
                    Object.entries(getAddressNames(0) ?? {})?.map(([key, name]) => {
                      setValue((getActualAddressNames(0) as any)[key], getValues(name as any));
                    });
                  }}
                >
                  {t("Copy the place of residence")}
                </Button>
              </Box>

              <Address form={form} names={getActualAddressNames(0)} />
            </>
          )}

          <Typography variant="h5">{t("Contacts")}</Typography>
          <Contact form={form} names={getContactNames(0)} />

          <Typography variant="h5">{t("Files to upload")}</Typography>
          <AttachedFiles form={form} ref={attachedFilesRef} name="requester" index={0} />
        </Box>
      </ExpandingFields>

      <Box
        width="fit-content"
        position="sticky"
        bottom="20px"
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
          >
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
