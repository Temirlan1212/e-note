import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import { InputLabel, Box } from "@mui/material";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import Checkbox from "@/components/ui/Checkbox";
import Radio from "@/components/ui/Radio";
import Autocomplete from "@/components/ui/Autocomplete";
import Button from "@/components/ui/Button";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import { MouseEventHandler } from "react";
import { useRouter } from "next/router";

export interface IPersonalDataProps {
  form: UseFormReturn<any>;
  names: {
    type: string;
    foreigner: string;
    lastName: string;
    firstName: string;
    middleName: string;
    pin: string;
    birthDate: string;
    citizenship: string;
    nameOfCompanyOfficial: string;
    nameOfCompanyGov: string;
    representativesName: string;
    notaryRegistrationNumber: string;
    notaryOKPONumber: string;
    notaryPhysicalParticipantsQty: string;
    notaryLegalParticipantsQty: string;
    notaryTotalParticipantsQty: string;
  };
  defaultValues?: {
    type?: number | null;
    foreigner?: boolean;
    lastName?: string;
    firstName?: string;
    middleName?: string;
    pin?: number;
    birthDate?: Date;
    citizenship?: number | null;
    nameOfCompanyOfficial?: string;
    nameOfCompanyGov?: string;
    representativesName?: string;
    notaryRegistrationNumber?: number;
    notaryOKPONumber?: number;
    notaryPhysicalParticipantsQty?: number;
    notaryLegalParticipantsQty?: number;
    notaryTotalParticipantsQty?: number;
  };
  fields?: {
    type?: boolean;
    foreigner?: boolean;
    lastName?: boolean;
    firstName?: boolean;
    middleName?: boolean;
    pin?: boolean;
    birthDate?: boolean;
    citizenship?: boolean;
    nameOfCompanyOfficial?: boolean;
    nameOfCompanyGov?: boolean;
    representativesName?: boolean;
    notaryRegistrationNumber?: boolean;
    notaryOKPONumber?: boolean;
    notaryPhysicalParticipantsQty?: boolean;
    notaryLegalParticipantsQty?: boolean;
    notaryTotalParticipantsQty?: boolean;
  };
  onPinCheck?: MouseEventHandler<HTMLButtonElement>;
}

export default function PersonalData({ form, names, defaultValues, fields, onPinCheck }: IPersonalDataProps) {
  const t = useTranslations();

  const { locale } = useRouter();

  const { trigger, control, watch, resetField } = form;

  const foreigner = watch(names.foreigner);
  const type = watch(names.type);

  const { data: citizenshipDictionary, loading: citizenshipDictionaryLoading } = useFetch(
    `/api/dictionaries/citizenship`,
    "GET"
  );

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        {(fields?.type == null || !!fields?.type) && (
          <Controller
            control={control}
            name={names.type}
            defaultValue={defaultValues?.type ?? 2}
            render={({ field, fieldState }) => (
              <Radio
                labelField="name"
                valueField="id"
                row
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                data={[
                  { id: 2, name: t("Individual person") },
                  { id: 1, name: t("Juridical person") },
                ]}
                {...field}
                value={field.value != null ? field.value : ""}
              />
            )}
          />
        )}

        {(fields?.foreigner == null || !!fields?.foreigner) && (
          <Controller
            control={control}
            name={names.foreigner}
            defaultValue={defaultValues?.foreigner ?? false}
            render={({ field, fieldState }) => (
              <Checkbox
                label={t("Foreign person")}
                type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                {...field}
                checked={!!field.value}
              />
            )}
          />
        )}
      </Box>

      <Box display="flex" gap="20px" alignItems="center" flexDirection={{ xs: "column", md: "row" }}>
        {(fields?.pin == null || !!fields?.pin) && (
          <>
            <Controller
              control={control}
              name={names.pin}
              defaultValue={defaultValues?.pin ?? ""}
              render={({ field, fieldState }) => (
                <Box display="flex" flexDirection="column" width="100%" height="90px">
                  <InputLabel>{t("PIN")}</InputLabel>
                  <Input
                    inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    helperText={fieldState.error?.message ? t(fieldState.error?.message, { min: 6 }) : ""}
                    {...field}
                    value={field.value != null ? field.value : ""}
                  />
                </Box>
              )}
            />

            {onPinCheck && !foreigner && (
              <Button
                endIcon={<ContentPasteSearchIcon />}
                sx={{ flex: 0, minWidth: "auto", padding: "8px 16px" }}
                onClick={onPinCheck}
              >
                {t("Check")}
              </Button>
            )}
          </>
        )}
      </Box>

      {(type == null || type == 2) && (
        <>
          <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
            {(fields?.lastName == null || !!fields?.lastName) && (
              <Controller
                control={control}
                name={names.lastName}
                defaultValue={defaultValues?.lastName ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Last name")}</InputLabel>
                    <Input
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      {...field}
                    />
                  </Box>
                )}
              />
            )}

            {(fields?.firstName == null || !!fields?.firstName) && (
              <Controller
                control={control}
                name={names.firstName}
                defaultValue={defaultValues?.firstName ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("First name")}</InputLabel>
                    <Input
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      {...field}
                    />
                  </Box>
                )}
              />
            )}

            {(fields?.middleName == null || !!fields?.middleName) && (
              <Controller
                control={control}
                name={names.middleName}
                defaultValue={defaultValues?.middleName ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Middle name")}</InputLabel>
                    <Input
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      {...field}
                    />
                  </Box>
                )}
              />
            )}
          </Box>

          <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
            {(fields?.birthDate == null || !!fields?.birthDate) && (
              <Controller
                control={control}
                name={names.birthDate}
                defaultValue={defaultValues?.birthDate ?? null}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Birth date")}</InputLabel>
                    <DatePicker
                      type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      value={field.value != null ? new Date(field.value) : null}
                      onChange={(...event: any[]) => {
                        field.onChange(...event);
                        trigger(field.name);
                      }}
                    />
                  </Box>
                )}
              />
            )}

            {(fields?.citizenship == null || !!fields?.citizenship) && (
              <Controller
                control={control}
                name={names.citizenship}
                defaultValue={defaultValues?.citizenship ?? null}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Citizenship")}</InputLabel>
                    <Autocomplete
                      labelField={locale === "ru" || locale === "kg" ? "$t:name" : "name"}
                      type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      options={
                        citizenshipDictionary?.status === 0
                          ? (citizenshipDictionary?.data as Record<string, any>[]) ?? []
                          : []
                      }
                      loading={citizenshipDictionaryLoading}
                      value={
                        field.value != null
                          ? (citizenshipDictionary?.data ?? []).find(
                              (item: Record<string, any>) => item.id == field.value.id
                            ) ?? null
                          : null
                      }
                      onBlur={field.onBlur}
                      onChange={(event, value) => {
                        field.onChange(value?.id != null ? { id: value.id } : null);
                        trigger(field.name);
                      }}
                    />
                  </Box>
                )}
              />
            )}
          </Box>
        </>
      )}

      {type == 1 && (
        <>
          {(fields?.nameOfCompanyOfficial == null || !!fields?.nameOfCompanyOfficial) && (
            <Controller
              control={control}
              name={names.nameOfCompanyOfficial}
              defaultValue={defaultValues?.nameOfCompanyOfficial ?? ""}
              render={({ field, fieldState }) => (
                <Box display="flex" flexDirection="column" width="100%">
                  <InputLabel>{t("Full name in the official language")}</InputLabel>
                  <Input
                    inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                    {...field}
                  />
                </Box>
              )}
            />
          )}

          {(fields?.nameOfCompanyGov == null || !!fields?.nameOfCompanyGov) && (
            <Controller
              control={control}
              name={names.nameOfCompanyGov}
              defaultValue={defaultValues?.nameOfCompanyGov ?? ""}
              render={({ field, fieldState }) => (
                <Box display="flex" flexDirection="column" width="100%">
                  <InputLabel>{t("Full name in the state language")}</InputLabel>
                  <Input
                    inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                    {...field}
                  />
                </Box>
              )}
            />
          )}

          {(fields?.representativesName == null || !!fields?.representativesName) && (
            <Controller
              control={control}
              name={names.representativesName}
              defaultValue={defaultValues?.representativesName ?? ""}
              render={({ field, fieldState }) => (
                <Box display="flex" flexDirection="column" width="100%">
                  <InputLabel>{t("Full name of the representative")}</InputLabel>
                  <Input
                    inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                    {...field}
                  />
                </Box>
              )}
            />
          )}

          <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
            {(fields?.notaryRegistrationNumber == null || !!fields?.notaryRegistrationNumber) && (
              <Controller
                control={control}
                name={names.notaryRegistrationNumber}
                defaultValue={defaultValues?.notaryRegistrationNumber ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Registration number")}</InputLabel>
                    <Input
                      type="number"
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      {...field}
                    />
                  </Box>
                )}
              />
            )}

            {(fields?.notaryOKPONumber == null || !!fields?.notaryOKPONumber) && (
              <Controller
                control={control}
                name={names.notaryOKPONumber}
                defaultValue={defaultValues?.notaryOKPONumber ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("OKPO code")}</InputLabel>
                    <Input
                      type="number"
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      {...field}
                    />
                  </Box>
                )}
              />
            )}
          </Box>

          <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
            {(fields?.notaryPhysicalParticipantsQty == null || !!fields?.notaryPhysicalParticipantsQty) && (
              <Controller
                control={control}
                name={names.notaryPhysicalParticipantsQty}
                defaultValue={defaultValues?.notaryPhysicalParticipantsQty ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Number of founders (participants) of individuals")}</InputLabel>
                    <Input
                      type="number"
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      {...field}
                    />
                  </Box>
                )}
              />
            )}

            {(fields?.notaryLegalParticipantsQty == null || !!fields?.notaryLegalParticipantsQty) && (
              <Controller
                control={control}
                name={names.notaryLegalParticipantsQty}
                defaultValue={defaultValues?.notaryLegalParticipantsQty ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Number of founders (participants) of legal entities")}</InputLabel>
                    <Input
                      type="number"
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      {...field}
                    />
                  </Box>
                )}
              />
            )}
          </Box>

          {(fields?.notaryTotalParticipantsQty == null || !!fields?.notaryTotalParticipantsQty) && (
            <Controller
              control={control}
              name={names.notaryTotalParticipantsQty}
              defaultValue={defaultValues?.notaryTotalParticipantsQty ?? ""}
              render={({ field, fieldState }) => (
                <Box display="flex" flexDirection="column" width="100%">
                  <InputLabel>{t("Total number (participants)")}</InputLabel>
                  <Input
                    type="number"
                    inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                    {...field}
                  />
                </Box>
              )}
            />
          )}
        </>
      )}
    </Box>
  );
}
