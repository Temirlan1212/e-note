import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import { InputLabel, Box, BoxProps } from "@mui/material";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import Checkbox from "@/components/ui/Checkbox";
import Radio from "@/components/ui/Radio";
import Button from "@/components/ui/Button";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import { MouseEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useEffectOnce from "@/hooks/useEffectOnce";

type Names = {
  type: string;
  foreigner: string;
  lastName: string;
  firstName: string;
  name: string;
  middleName: string;
  pin: string;
  nameOfCompanyOfficial: string;
  nameOfCompanyGov: string;
  representativesName: string;
  notaryRegistrationNumber: string;
  notaryOKPONumber: string;
  notaryPhysicalParticipantsQty: string;
  notaryLegalParticipantsQty: string;
  notaryTotalParticipantsQty: string;
  notaryDateOfOrder: string;
  subjectRole: string;
  picture: string;
  tundukDocumentSeries: string;
  tundukDocumentNumber: string;
  validatePassport: string;
};

export interface IPersonalDataProps {
  form: UseFormReturn<any>;
  names: Partial<Names>;
  defaultValues?: {
    type?: number | null;
    foreigner?: boolean;
    subjectRole?: string | null;
    picture?: string;
    lastName?: string;
    firstName?: string;
    middleName?: string;
    pin?: number;
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
    nameOfCompanyOfficial?: boolean;
    nameOfCompanyGov?: boolean;
    representativesName?: boolean;
    notaryRegistrationNumber?: boolean;
    notaryOKPONumber?: boolean;
    notaryPhysicalParticipantsQty?: boolean;
    notaryLegalParticipantsQty?: boolean;
    notaryTotalParticipantsQty?: boolean;
    notaryDateOfOrder?: boolean;
    tundukDocumentSeries?: boolean;
    tundukDocumentNumber?: boolean;
  };
  onPinCheck?: MouseEventHandler<HTMLButtonElement>;
  onPinReset?: MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  disableFields?: boolean;
  isTundukRequested?: boolean;
  isRequester?: boolean;
  validatePassport?: boolean;
  slotProps?: {
    image?: BoxProps;
  };
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
  isTundukRequested,
  isRequester = false,
  validatePassport = false,
  slotProps,
}: IPersonalDataProps) {
  const t = useTranslations();

  const [imageURL, setImageURL] = useState<string | null>(null);
  const { locale } = useRouter();

  const { trigger, control, watch, resetField } = form;

  const passportSeries = watch(names?.tundukDocumentSeries ?? "");
  const passportNumber = watch(names?.tundukDocumentNumber ?? "");
  const foreigner = watch(names?.foreigner ?? "");
  const type = watch(names?.type ?? "");
  const picture = watch(names?.picture ?? "");
  const firstName = watch(names?.firstName ?? "");
  const name = watch(names?.nameOfCompanyOfficial ?? "");

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
    if (names?.picture! && picture) {
      setImageURL(`data:image/jpeg;base64,${picture}`);
    }
  }, [picture]);

  useEffect(() => {
    if (firstName && names?.name) form.setValue(names?.name, firstName);
  }, [firstName]);

  useEffect(() => {
    if (name) {
      form.setValue(names?.name!, name);
      form.setValue(names?.firstName!, name);
    }
  }, [name]);

  useEffectOnce(() => {
    if (validatePassport && (!passportSeries || !passportNumber)) {
      form.setValue(names?.validatePassport as string, validatePassport);
    }
  }, [passportSeries, passportNumber]);

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box>
        <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
          {(fields?.type == null || !!fields?.type) && names?.type && (
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
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    form.clearErrors();
                  }}
                  value={field.value != null ? field.value : ""}
                />
              )}
            />
          )}

          {(fields?.foreigner == null || !!fields?.foreigner) && names?.foreigner && (
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
                <InputLabel
                  required
                  sx={{
                    fontWeight: 600,
                    ".MuiFormLabel-asterisk": {
                      color: "error.main",
                      fontSize: "2em",
                      verticalAlign: "middle",
                    },
                  }}
                >
                  {t("Subject role")}
                </InputLabel>
                <Select
                  labelField={
                    subjectRoleDictionary?.data?.length > 0 && subjectRoleDictionary?.data[0][`title_${locale}`]
                      ? `title_${locale}`
                      : "title"
                  }
                  sx={{ fontWeight: 500 }}
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
              {...field}
              src={imageURL!}
              alt="passport avatar"
              {...(slotProps?.image || {})}
              sx={{
                position: "absolute",
                top: { xs: "55px", sm: "16px" },
                right: "16px",
                objectFit: "contain",
                height: { xs: "100px", sm: "200px" },
                width: { xs: "70px", sm: "170px" },
                ...(slotProps?.image?.sx || {}),
              }}
            />
          )}
        />
      )}

      <Box
        display="flex"
        gap="20px"
        alignItems="self-start"
        flexDirection={{ xs: "column", md: "row" }}
        sx={{
          boxShadow: "0px 0px 8px 0px rgba(73, 73, 73, 0.5)",
          padding: "10px",
        }}
      >
        {(fields?.pin == null || !!fields?.pin) && watch(names?.subjectRole ?? "") != "notAnAdult" && (
          <>
            <Controller
              control={control}
              name={names?.pin ?? ""}
              defaultValue={defaultValues?.pin ?? ""}
              render={({ field, fieldState }) => (
                <Box display="flex" flexDirection="column" justifyContent="center" width="100%">
                  <InputLabel
                    required
                    sx={{
                      fontWeight: 600,
                      ".MuiFormLabel-asterisk": {
                        color: "error.main",
                        fontSize: "2em",
                        verticalAlign: "middle",
                      },
                    }}
                  >
                    {type != 1 ? t("PIN") : t("TIN")}
                  </InputLabel>
                  <Input
                    sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
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
                      {isRequester ? (
                        <InputLabel
                          required
                          sx={{
                            fontWeight: 600,
                            ".MuiFormLabel-asterisk": {
                              color: "error.main",
                              fontSize: "2em",
                              verticalAlign: "middle",
                            },
                          }}
                        >
                          {t("Series")}
                        </InputLabel>
                      ) : (
                        <InputLabel
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {t("Series")}
                        </InputLabel>
                      )}
                      <Select
                        labelField={
                          identityDocumentSeriesDictionary?.data?.length > 0 &&
                          identityDocumentSeriesDictionary?.data[0][`title_${locale}`]
                            ? `title_${locale}`
                            : "title"
                        }
                        valueField="value"
                        sx={{ fontWeight: 500 }}
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
                      {isRequester ? (
                        <InputLabel
                          required
                          sx={{
                            fontWeight: 600,
                            ".MuiFormLabel-asterisk": {
                              color: "error.main",
                              fontSize: "2em",
                              verticalAlign: "middle",
                            },
                          }}
                        >
                          {t("Number")}
                        </InputLabel>
                      ) : (
                        <InputLabel
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {t("Number")}
                        </InputLabel>
                      )}
                      <Input
                        sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
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

                {isTundukRequested && onPinReset && (
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
            {(fields?.lastName == null || !!fields?.lastName) && names?.lastName && (
              <Controller
                control={control}
                name={names.lastName}
                defaultValue={defaultValues?.lastName ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel
                      required
                      sx={{
                        fontWeight: 600,
                        ".MuiFormLabel-asterisk": {
                          color: "error.main",
                          fontSize: "2em",
                          verticalAlign: "middle",
                        },
                      }}
                    >
                      {t("Last name")}
                    </InputLabel>
                    <Input
                      sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
                      disabled={disableFields}
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message, { min: 2 }) : ""}
                      {...field}
                    />
                  </Box>
                )}
              />
            )}

            {(fields?.firstName == null || !!fields?.firstName) && names?.firstName && (
              <Controller
                control={control}
                name={names.firstName}
                defaultValue={defaultValues?.firstName ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel
                      required
                      sx={{
                        fontWeight: 600,
                        ".MuiFormLabel-asterisk": {
                          color: "error.main",
                          fontSize: "2em",
                          verticalAlign: "middle",
                        },
                      }}
                    >
                      {t("First name")}
                    </InputLabel>
                    <Input
                      sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
                      disabled={disableFields}
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message, { min: 2 }) : ""}
                      {...field}
                    />
                  </Box>
                )}
              />
            )}

            {(fields?.middleName == null || !!fields?.middleName) && names?.middleName && (
              <Controller
                control={control}
                name={names.middleName}
                defaultValue={defaultValues?.middleName ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel sx={{ fontWeight: 600 }}>{t("Middle name")}</InputLabel>
                    <Input
                      sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
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
          {(fields?.nameOfCompanyOfficial == null || !!fields?.nameOfCompanyOfficial) &&
            names?.nameOfCompanyOfficial && (
              <Controller
                control={control}
                name={names.nameOfCompanyOfficial}
                defaultValue={defaultValues?.nameOfCompanyOfficial ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel sx={{ fontWeight: 600 }}>{t("Full name in the official language")}</InputLabel>
                    <Input
                      sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
                      disabled={disableFields}
                      inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      {...field}
                    />
                  </Box>
                )}
              />
            )}

          {(fields?.nameOfCompanyGov == null || !!fields?.nameOfCompanyGov) && names?.nameOfCompanyGov && (
            <Controller
              control={control}
              name={names.nameOfCompanyGov}
              defaultValue={defaultValues?.nameOfCompanyGov ?? ""}
              render={({ field, fieldState }) => (
                <Box display="flex" flexDirection="column" width="100%">
                  <InputLabel sx={{ fontWeight: 600 }}>{t("Full name in the state language")}</InputLabel>
                  <Input
                    sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
                    disabled={disableFields}
                    inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                    {...field}
                  />
                </Box>
              )}
            />
          )}

          {(fields?.representativesName == null || !!fields?.representativesName) && names?.representativesName && (
            <Controller
              control={control}
              name={names.representativesName}
              defaultValue={defaultValues?.representativesName ?? ""}
              render={({ field, fieldState }) => (
                <Box display="flex" flexDirection="column" width="100%">
                  <InputLabel sx={{ fontWeight: 600 }}>{t("Full name of the representative")}</InputLabel>
                  <Input
                    sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
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
            {(fields?.notaryRegistrationNumber == null || !!fields?.notaryRegistrationNumber) &&
              names?.notaryRegistrationNumber && (
                <Controller
                  control={control}
                  name={names.notaryRegistrationNumber}
                  defaultValue={defaultValues?.notaryRegistrationNumber ?? ""}
                  render={({ field, fieldState }) => (
                    <Box display="flex" flexDirection="column" width="100%">
                      <InputLabel sx={{ fontWeight: 600 }}>{t("Registration number")}</InputLabel>
                      <Input
                        sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
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

            {(fields?.notaryOKPONumber == null || !!fields?.notaryOKPONumber) && names?.notaryOKPONumber && (
              <Controller
                control={control}
                name={names.notaryOKPONumber}
                defaultValue={defaultValues?.notaryOKPONumber ?? ""}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel sx={{ fontWeight: 600 }}>{t("OKPO code")}</InputLabel>
                    <Input
                      sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
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
            {(fields?.notaryPhysicalParticipantsQty == null || !!fields?.notaryPhysicalParticipantsQty) &&
              names?.notaryPhysicalParticipantsQty && (
                <Controller
                  control={control}
                  name={names.notaryPhysicalParticipantsQty}
                  defaultValue={defaultValues?.notaryPhysicalParticipantsQty ?? ""}
                  render={({ field, fieldState }) => (
                    <Box display="flex" flexDirection="column" width="100%">
                      <InputLabel sx={{ fontWeight: 600 }}>
                        {t("Number of founders (participants) of individuals")}
                      </InputLabel>
                      <Input
                        sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
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

            {(fields?.notaryLegalParticipantsQty == null || !!fields?.notaryLegalParticipantsQty) &&
              names?.notaryLegalParticipantsQty && (
                <Controller
                  control={control}
                  name={names.notaryLegalParticipantsQty}
                  defaultValue={defaultValues?.notaryLegalParticipantsQty ?? ""}
                  render={({ field, fieldState }) => (
                    <Box display="flex" flexDirection="column" width="100%">
                      <InputLabel sx={{ fontWeight: 600 }}>
                        {t("Number of founders (participants) of legal entities")}
                      </InputLabel>
                      <Input
                        sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
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
            {(fields?.notaryTotalParticipantsQty == null || !!fields?.notaryTotalParticipantsQty) &&
              names?.notaryTotalParticipantsQty && (
                <Controller
                  control={control}
                  name={names.notaryTotalParticipantsQty}
                  defaultValue={defaultValues?.notaryTotalParticipantsQty ?? ""}
                  render={({ field, fieldState }) => (
                    <Box display="flex" flexDirection="column" width="100%">
                      <InputLabel sx={{ fontWeight: 600 }}>{t("Total number (participants)")}</InputLabel>
                      <Input
                        sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
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

            {(fields?.notaryDateOfOrder == null || !!fields?.notaryDateOfOrder) && names?.notaryDateOfOrder && (
              <Controller
                control={control}
                name={names.notaryDateOfOrder}
                defaultValue={defaultValues?.notaryDateOfOrder ?? null}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel sx={{ fontWeight: 600 }}>{t("Order date")}</InputLabel>
                    <DatePicker
                      sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
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
