import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { Box, InputLabel, Typography } from "@mui/material";
import Select from "@/components/ui/Select";
import Hint from "@/components/ui/Hint";
import { useRouter } from "next/router";
import { INotarialActionData } from "@/models/notarial-action";
import Autocomplete from "@/components/ui/Autocomplete";
import { useEffect, useState } from "react";
import ExpandingFields from "./ExpandingFields";

export interface INotarialActionProps {
  form: UseFormReturn<any>;
  step: number;
}

export default function NotarialAction({ form, step }: INotarialActionProps) {
  const t = useTranslations();
  const { locale } = useRouter();
  const [isAdditionalFieldsOpen, setIsAdditionalFieldsOpen] = useState(false);

  const { trigger, control, watch, resetField, getValues, setValue } = form;

  const objectVal = watch("object");
  const objectTypeVal = watch("objectType");
  const notarialActionVal = watch("notarialAction");
  const typeNotarialActionVal = watch("typeNotarialAction");
  const actionVal = watch("action");
  const product = watch("product");

  const { data: objectData, loading: objectLoading } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=object`,
    "POST"
  );

  const {
    data: objectTypeData,
    update: objectTypeUpdate,
    loading: objectTypeLoading,
  } = useFetch<INotarialActionData>(`/api/dictionaries/notarial-action?actionType=objectType`, "POST");

  const {
    data: notarialActionData,
    update: notarialActionUpdate,
    loading: notarialActionLoading,
  } = useFetch<INotarialActionData>(`/api/dictionaries/notarial-action?actionType=notarialAction`, "POST");

  const {
    data: typeNotarialActionData,
    update: typeNotarialActionUpdate,
    loading: typeNotarialActionLoading,
  } = useFetch<INotarialActionData>(`/api/dictionaries/notarial-action?actionType=typeNotarialAction`, "POST");

  const {
    data: actionData,
    update: actionUpdate,
    loading: actionLoading,
  } = useFetch<INotarialActionData>(`/api/dictionaries/notarial-action?actionType=action`, "POST");

  const { data: searchedDocData, loading: searchedDocLoading, update: updateSearchedDoc } = useFetch("", "POST");
  const { update: updateSearchedDocTree } = useFetch("", "POST");

  const values = [actionVal, objectVal, objectTypeVal, notarialActionVal, typeNotarialActionVal];
  const isValuesSelected = values.every((item) => !!item);

  useEffectOnce(() => {
    if (actionVal != null || objectVal != null) {
      updateSearchedDoc("/api/dictionaries/document-type", {
        formValues: {
          action: actionVal,
          object: objectVal,
          objectType: objectTypeVal,
          notarialAction: notarialActionVal,
          typeNotarialAction: typeNotarialActionVal,
          isSystem: true,
        },
      });
    }

    if (isValuesSelected) setIsAdditionalFieldsOpen(isValuesSelected);
  }, values);

  useEffectOnce(() => {
    const parentId = objectVal || objectTypeVal || notarialActionVal || typeNotarialActionVal || "";
    objectTypeUpdate(
      `/api/dictionaries/notarial-action?actionType=objectType${
        objectTypeVal ? "" : objectVal ? `&parentId=${objectVal}` : parentId ? `&parentId=${parentId}` : ""
      }`
    );
    notarialActionUpdate(
      `/api/dictionaries/notarial-action?actionType=notarialAction${
        notarialActionVal ? "" : objectTypeVal ? `&parentId=${objectTypeVal}` : parentId ? `&parentId=${parentId}` : ""
      }`
    );
    typeNotarialActionUpdate(
      `/api/dictionaries/notarial-action?actionType=typeNotarialAction${
        typeNotarialActionVal
          ? ""
          : notarialActionVal
          ? `&parentId=${notarialActionVal}`
          : parentId
          ? `&parentId=${parentId}`
          : ""
      }`
    );
    actionUpdate(
      `/api/dictionaries/notarial-action?actionType=action${
        actionVal
          ? ""
          : typeNotarialActionVal
          ? `&parentId=${typeNotarialActionVal}`
          : parentId
          ? `&parentId=${parentId}`
          : ""
      }`
    );
  }, [objectVal, objectTypeVal, notarialActionVal, typeNotarialActionVal]);

  useEffectOnce(async () => {
    const productId = product?.id;
    if (productId != null) {
      const res = await updateSearchedDocTree(`/api/dictionaries/document-type/${productId}`);
      const data = res?.data?.[0];
      if (Object.values(data ?? {}).length < 1) return;

      const actionsTree = {
        object: "object",
        objectType: "objectType",
        notarialAction: "notarialAction",
        typeNotarialAction: "typeNotarialAction",
        action: "notaryAction",
      } as const;

      for (let key in actionsTree) {
        const field = key as keyof typeof actionsTree;
        const serverField = actionsTree[field];
        const value = data?.[serverField]?.id || null;
        if (value != null) setValue(field, value);
      }
    }
  }, [product]);

  useEffect(() => {
    updateSearchedDoc("/api/dictionaries/document-type", {
      formValues: {
        isSystem: true,
      },
    });
    setIsAdditionalFieldsOpen(true);
  }, []);

  return (
    <>
      <Typography color="secondary" variant="h4">
        {t("Select a notarial act by name")}
      </Typography>
      <Controller
        control={control}
        name="product"
        defaultValue={null}
        render={({ field, fieldState }) => (
          <Box width="100%" display="flex" flexDirection="column" gap="10px">
            <InputLabel sx={{ fontWeight: 600 }}>{t("Document")}</InputLabel>
            <Autocomplete
              sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
              textFieldPlaceholder={t("All documents")}
              labelField={locale !== "en" ? "$t:name" : "name"}
              type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
              helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
              options={searchedDocData?.status === 0 ? (searchedDocData?.data as Record<string, any>[]) ?? [] : []}
              loading={searchedDocLoading}
              value={
                field.value != null
                  ? (Array.isArray(searchedDocData?.data) ? searchedDocData?.data : [])?.find(
                      (item: Record<string, any>) => item.id == field.value?.id
                    ) ?? null
                  : null
              }
              onBlur={field.onBlur}
              onChange={(event, value) => {
                field.onChange(value?.id != null ? { id: value.id } : null);
                trigger(field.name);
              }}
              ref={field.ref}
            />
          </Box>
        )}
      />

      <ExpandingFields title="Additional filters" permanentExpand={isAdditionalFieldsOpen}>
        <Box display="flex" flexDirection="column" gap="10px">
          <Typography color="secondary" variant="h4">
            {t("Filter by object")}
          </Typography>

          <Controller
            control={control}
            name="object"
            defaultValue={null}
            render={({ field, fieldState }) => {
              const objectList = objectData?.data;
              const errorMessage = fieldState.error?.message;
              return (
                <Box width="100%" display="flex" flexDirection="column" gap="10px">
                  <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap="10px 20px" alignItems="end">
                    <InputLabel sx={{ fontWeight: 600 }}>{t("Objects of civil rights")}</InputLabel>
                    <Hint type="hint" maxWidth="520px" defaultActive={false}>
                      {t("second-step-hint-title")}
                    </Hint>
                  </Box>

                  <Select
                    sx={{ fontWeight: 500 }}
                    fullWidth
                    placeholder={t("All objects of civil rights")}
                    selectType={errorMessage ? "error" : field.value ? "success" : "secondary"}
                    data={objectList ?? []}
                    labelField={"nameIn" + locale?.[0].toUpperCase() + locale?.slice(1)}
                    valueField="id"
                    helperText={errorMessage ? t(errorMessage) : ""}
                    value={field.value == null ? "" : field.value}
                    onBlur={field.onBlur}
                    loading={objectLoading}
                    onChange={(...event: any[]) => {
                      field.onChange(...event);
                      trigger(field.name);
                      ["objectType", "notarialAction", "typeNotarialAction", "action", "product"].map((item: any) =>
                        resetField(item, { defaultValue: null })
                      );
                    }}
                    ref={field.ref}
                  />
                </Box>
              );
            }}
          />

          <Controller
            control={control}
            name="objectType"
            defaultValue={null}
            render={({ field, fieldState }) => {
              const errorMessage = fieldState.error?.message;
              const objectTypeList = objectTypeData?.data;
              return (
                <Box width="100%" display="flex" flexDirection="column" gap="10px">
                  <InputLabel sx={{ fontWeight: 600 }}>{t("Object type")}</InputLabel>
                  <Select
                    sx={{ fontWeight: 500 }}
                    // disabled={!objectVal}
                    placeholder={t("All types of objects")}
                    selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    data={objectTypeList ?? []}
                    labelField={"nameIn" + locale?.[0].toUpperCase() + locale?.slice(1)}
                    valueField="id"
                    helperText={!!objectVal && errorMessage ? t(errorMessage) : ""}
                    value={field.value == null ? "" : field.value}
                    onBlur={field.onBlur}
                    loading={objectTypeLoading}
                    onChange={(...event: any[]) => {
                      field.onChange(...event);
                      trigger(field.name);
                      ["notarialAction", "typeNotarialAction", "action", "product"].map((item: any) =>
                        resetField(item, { defaultValue: null })
                      );
                    }}
                    ref={field.ref}
                  />
                </Box>
              );
            }}
          />

          <Typography color="secondary" variant="h4" mt="20px">
            {t("Filter by document")}
          </Typography>

          <Controller
            control={control}
            name="notarialAction"
            defaultValue={null}
            render={({ field, fieldState }) => {
              const errorMessage = fieldState.error?.message;
              const notarialActionList = notarialActionData?.data;

              return (
                <Box width="100%" display="flex" flexDirection="column" gap="10px">
                  <InputLabel sx={{ fontWeight: 600 }}>{t("Notarial action")}</InputLabel>
                  <Select
                    sx={{ fontWeight: 500 }}
                    // disabled={!objectTypeVal}
                    placeholder={t("All notarial actions")}
                    selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    data={notarialActionList ?? []}
                    labelField={"nameIn" + locale?.[0].toUpperCase() + locale?.slice(1)}
                    valueField="id"
                    helperText={!!objectTypeVal && errorMessage ? t(errorMessage) : ""}
                    value={field.value == null ? "" : field.value}
                    onBlur={field.onBlur}
                    loading={notarialActionLoading}
                    onChange={(...event: any[]) => {
                      field.onChange(...event);
                      trigger(field.name);
                      ["typeNotarialAction", "action", "product"].map((item: any) =>
                        resetField(item, { defaultValue: null })
                      );
                    }}
                    ref={field.ref}
                  />
                </Box>
              );
            }}
          />

          <Controller
            control={control}
            name="typeNotarialAction"
            defaultValue={null}
            render={({ field, fieldState }) => {
              const errorMessage = fieldState.error?.message;
              const typeNotarialActionList = typeNotarialActionData?.data;

              return (
                <Box width="100%" display="flex" flexDirection="column" gap="10px">
                  <InputLabel sx={{ fontWeight: 600 }}>{t("Type of notarial action")}</InputLabel>
                  <Select
                    sx={{ fontWeight: 500 }}
                    // disabled={!notarialActionVal}
                    placeholder={t("All types of notarial actions")}
                    selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    data={typeNotarialActionList ?? []}
                    labelField={"nameIn" + locale?.[0].toUpperCase() + locale?.slice(1)}
                    valueField="id"
                    helperText={!!notarialActionVal && errorMessage ? t(errorMessage) : ""}
                    value={field.value == null ? "" : field.value}
                    onBlur={field.onBlur}
                    loading={typeNotarialActionLoading}
                    onChange={(...event: any[]) => {
                      field.onChange(...event);
                      trigger(field.name);
                      ["action", "product"].map((item: any) => resetField(item, { defaultValue: null }));
                    }}
                    ref={field.ref}
                  />
                </Box>
              );
            }}
          />

          <Controller
            control={control}
            name="action"
            defaultValue={null}
            render={({ field, fieldState }) => {
              const errorMessage = fieldState.error?.message;
              const actionList = actionData?.data;

              return (
                <Box width="100%" display="flex" flexDirection="column" gap="10px">
                  <InputLabel sx={{ fontWeight: 600 }}>{t("Purpose of action")}</InputLabel>
                  <Select
                    sx={{ fontWeight: 500 }}
                    // disabled={!typeNotarialActionVal}
                    placeholder={t("All action goals")}
                    selectType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    data={actionList ?? []}
                    labelField={"nameIn" + locale?.[0].toUpperCase() + locale?.slice(1)}
                    valueField="id"
                    helperText={!!typeNotarialActionVal && errorMessage ? t(errorMessage) : ""}
                    value={field.value == null ? "" : field.value}
                    onBlur={field.onBlur}
                    loading={actionLoading}
                    onChange={(...event: any[]) => {
                      field.onChange(...event);
                      trigger(field.name);
                      resetField("product", { defaultValue: null });
                    }}
                    ref={field.ref}
                  />
                </Box>
              );
            }}
          />
        </Box>
      </ExpandingFields>
    </>
  );
}
