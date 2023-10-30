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
import { MouseEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useEffectOnce from "@/hooks/useEffectOnce";

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
    notaryDateOfOrder: string;
    subjectRole?: string;
    picture?: string;
    tundukDocumentSeries?: string;
    tundukDocumentNumber?: string;
    nationality?: string;
    maritalStatus?: string;
  };
  defaultValues?: {
    type?: number | null;
    foreigner?: boolean;
    subjectRole?: string | null;
    picture?: string;
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
    notaryDateOfOrder?: Date;
    tundukDocumentSeries?: number | null;
    tundukDocumentNumber?: number | null;
    nationality?: string | null;
    maritalStatus?: string;
  };
  fields?: {
    type?: boolean;
    foreigner?: boolean;
    subjectRole?: boolean;
    picture?: boolean;
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
    notaryDateOfOrder?: boolean;
    nationality?: boolean;
    maritalStatus?: boolean;
    tundukDocumentSeries?: boolean;
    tundukDocumentNumber?: boolean;
  };
  onPinCheck?: MouseEventHandler<HTMLButtonElement>;
  onPinReset?: MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  disableFields?: boolean;
}

export default function PersonalData({
  form,
  names,
  defaultValues,
  fields,
  onPinCheck,
  onPinReset,
  loading,
  disableFields,
}: IPersonalDataProps) {
  const t = useTranslations();

  const [imageURL, setImageURL] = useState<string | null>(null);
  const { locale } = useRouter();

  const { trigger, control, watch, resetField } = form;

  const foreigner = watch(names.foreigner);
  const type = watch(names.type);
  const picture = watch(names?.picture!);

  const { data: imageData, update } = useFetch<Response>("", "GET", {
    returnResponse: true,
  });

  useEffectOnce(async () => {
    if (imageData == null || imageData.body == null || imageData.blob == null) return;

    const blob = await imageData.blob();

    const imageLink = URL.createObjectURL(blob);
    setImageURL(imageLink);
    return () => {
      URL.revokeObjectURL(imageLink);
    };
  }, [imageData]);

  const { data: citizenshipDictionary, loading: citizenshipDictionaryLoading } = useFetch(
    `/api/dictionaries/citizenship`,
    "GET"
  );

  const { data: identityDocumentSeriesDictionary, loading: identityDocumentSeriesDictionaryLoading } = useFetch(
    `/api/dictionaries/identity-document/series`,
    "GET"
  );

  const { data: subjectRoleDictionary, loading: subjectRoleDictionaryLoading } = useFetch(
    "/api/dictionaries/selection/notary.sale-order.person.role.select",
    "POST"
  );

  useEffect(() => {
    if (names?.picture! && picture?.id) {
      update(`/api/user/image/` + picture?.id);
    }
  }, [picture?.id]);

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box>
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

        {!!fields?.subjectRole && !!names?.subjectRole && (
          <Controller
            control={control}
            name={names.subjectRole}
            defaultValue={defaultValues?.subjectRole ?? ""}
            render={({ field, fieldState }) => (
              <Box display="flex" flexDirection="column" width="100%" mt="20px">
                <InputLabel>{t("Subject role")}</InputLabel>
                <Select
                  labelField={
                    subjectRoleDictionary?.data?.length > 0 && subjectRoleDictionary?.data[0][`title_${locale}`]
                      ? `title_${locale}`
                      : "title"
                  }
                  valueField="value"
                  selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  data={subjectRoleDictionary?.status === 0 ? subjectRoleDictionary?.data ?? [] : []}
                  loading={subjectRoleDictionaryLoading}
                  {...field}
                  value={field.value != null ? field.value : ""}
                />
              </Box>
            )}
          />
        )}
      </Box>

      {picture && (
        <Controller
          control={control}
          name={names?.picture ?? ""}
          defaultValue={defaultValues?.picture ?? null}
          render={({ field }) => (
            <Box
              component="img"
              sx={{
                position: "absolute",
                top: { xs: "55px", sm: "16px" },
                right: "16px",
                objectFit: "contain",
                height: { xs: "100px", sm: "200px" },
                width: { xs: "70px", sm: "170px" },
              }}
              {...field}
              src={imageURL!}
              alt="passport avatar"
            />
          )}
        />
      )}

      <Box display="flex" gap="20px" alignItems="self-start" flexDirection={{ xs: "column", md: "row" }}>
        {(fields?.pin == null || !!fields?.pin) && watch(names?.subjectRole ?? "") != "notAnAdult" && (
          <>
            <Controller
              control={control}
              name={names?.pin ?? ""}
              defaultValue={defaultValues?.pin ?? ""}
              render={({ field, fieldState }) => (
                <Box display="flex" flexDirection="column" justifyContent="center" width="100%">
                  <InputLabel>{type != 1 ? t("PIN") : t("TIN")}</InputLabel>
                  <Input
                    inputProps={{ maxLength: foreigner ? undefined : 14 }}
                    inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    helperText={fieldState.error?.message ? t(fieldState.error?.message, { min: 14, max: 14 }) : ""}
                    {...field}
                    value={field.value != null ? field.value : ""}
                  />
                </Box>
              )}
            />

            {!!names?.tundukDocumentSeries &&
              (!!fields?.tundukDocumentSeries || fields?.tundukDocumentSeries == null) &&
              !foreigner &&
              type != 1 && (
                <Controller
                  control={control}
                  name={names?.tundukDocumentSeries ?? ""}
                  defaultValue={defaultValues?.tundukDocumentSeries ?? null}
                  render={({ field, fieldState }) => (
                    <Box display="flex" flexDirection="column" width="100%">
                      <InputLabel>{t("Series")}</InputLabel>
                      <Select
                        labelField={
                          identityDocumentSeriesDictionary?.data?.length > 0 &&
                          identityDocumentSeriesDictionary?.data[0][`title_${locale}`]
                            ? `title_${locale}`
                            : "title"
                        }
                        valueField="value"
                        selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                        helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                        data={
                          identityDocumentSeriesDictionary?.status === 0
                            ? identityDocumentSeriesDictionary?.data ?? []
                            : []
                        }
                        loading={identityDocumentSeriesDictionaryLoading}
                        {...field}
                        value={field.value != null ? field.value : ""}
                      />
                    </Box>
                  )}
                />
              )}
            {!!names?.tundukDocumentNumber &&
              (!!fields?.tundukDocumentNumber || fields?.tundukDocumentNumber == null) &&
              !foreigner &&
              type != 1 && (
                <Controller
                  control={control}
                  name={names?.tundukDocumentNumber ?? ""}
                  defaultValue={defaultValues?.tundukDocumentNumber ?? ""}
                  render={({ field, fieldState }) => (
                    <Box display="flex" flexDirection="column" width="100%">
                      <InputLabel>{t("Number")}</InputLabel>
                      <Input
                        inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                        helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                        {...field}
                      />
                    </Box>
                  )}
                />
              )}

            {!foreigner && (
              <Box height="66px" display="flex" alignItems="self-end" gap="10px">
                {onPinCheck && (
                  <Button
                    loading={loading}
                    endIcon={<ContentPasteSearchIcon />}
                    sx={{ flex: 0, minWidth: "auto", padding: "8px 16px" }}
                    onClick={onPinCheck}
                  >
                    {t("Check")}
                  </Button>
                )}

                {disableFields && onPinReset && (
                  <Button
                    buttonType="danger"
                    sx={{ flex: 0, minWidth: "auto", padding: "8px 16px" }}
                    onClick={onPinReset}
                  >
                    {t("Reset")}
                  </Button>
                )}
              </Box>
            )}
          </>
        )}
      </Box>

      {(type == null || type != 1) && (
        <>
          <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
            {(fields?.lastName == null || !!fields?.lastName) && (
              <Controller
                control={control}
                name={names.lastName}
                defaultValue={defaultValues?.lastName ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel required sx={{ ".MuiFormLabel-asterisk": { color: "error.main" } }}>
                      {t("Last name")}
                    </InputLabel>
                    <Input
                      disabled={disableFields}
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
                    <InputLabel required sx={{ ".MuiFormLabel-asterisk": { color: "error.main" } }}>
                      {t("First name")}
                    </InputLabel>
                    <Input
                      disabled={disableFields}
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
                      disabled={disableFields}
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      {...field}
                    />
                  </Box>
                )}
              />
            )}
          </Box>

          <Box display="flex" gap="20px" alignItems="center" flexDirection={{ xs: "column", md: "row" }}>
            {(fields?.birthDate == null || !!fields?.birthDate) && (
              <Controller
                control={control}
                name={names.birthDate}
                defaultValue={defaultValues?.birthDate ?? null}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Birth date")}</InputLabel>
                    <DatePicker
                      disabled={disableFields}
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
                      disabled={disableFields}
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

            {Boolean(fields?.nationality) && Boolean(names?.nationality) && (
              <Controller
                control={control}
                name={names.nationality ?? ""}
                defaultValue={defaultValues?.nationality ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Nationality")}</InputLabel>
                    <Input
                      disabled={disableFields}
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      {...field}
                    />
                  </Box>
                )}
              />
            )}

            {Boolean(fields?.maritalStatus) && Boolean(names?.maritalStatus) && (
              <Controller
                control={control}
                name={names.maritalStatus ?? ""}
                defaultValue={defaultValues?.maritalStatus ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Marital status")}</InputLabel>
                    <Input
                      disabled={disableFields}
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      {...field}
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
                    disabled={disableFields}
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
                    disabled={disableFields}
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
                    disabled={disableFields}
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
                      disabled={disableFields}
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
                      disabled={disableFields}
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
                      disabled={disableFields}
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
                      disabled={disableFields}
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
            {(fields?.notaryTotalParticipantsQty == null || !!fields?.notaryTotalParticipantsQty) && (
              <Controller
                control={control}
                name={names.notaryTotalParticipantsQty}
                defaultValue={defaultValues?.notaryTotalParticipantsQty ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Total number (participants)")}</InputLabel>
                    <Input
                      disabled={disableFields}
                      type="number"
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      {...field}
                    />
                  </Box>
                )}
              />
            )}

            {(fields?.notaryDateOfOrder == null || !!fields?.notaryDateOfOrder) && (
              <Controller
                control={control}
                name={names.notaryDateOfOrder}
                defaultValue={defaultValues?.notaryDateOfOrder ?? null}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel>{t("Order date")}</InputLabel>
                    <DatePicker
                      disabled={disableFields}
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
          </Box>
        </>
      )}
    </Box>
  );
}
