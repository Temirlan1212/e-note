import { ChangeEvent, FC, useEffect, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { format, isValid } from "date-fns";
import { Box, InputLabel, Typography } from "@mui/material";
import { FilterAltOffOutlined, Search } from "@mui/icons-material";

import Button from "../ui/Button";
import Select from "../ui/Select";
import DatePicker from "../ui/DatePicker";

import EraserIcon from "@/public/icons/eraser.svg";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { Controller, UseFormReturn } from "react-hook-form";
import { IUserRegistryFiltrationSchema } from "@/validator-schemas/user-registry";

interface IUserRegistryFiltrationProps {
  form: UseFormReturn<any>;
  onFormSubmit?: (form: IUserRegistryFiltrationSchema) => void;
  onFormReset?: () => void;
}

const getLabelField = (data: FetchResponseBody | null, locale: string) => {
  if ((locale === "ru" || locale === "kg") && data?.status === 0 && Array.isArray(data?.data)) {
    const item = data.data.find((item) => item);
    if (item.hasOwnProperty("title")) return item?.[`title_${locale}`] != null ? `title_${locale}` : "title";
    if (item.hasOwnProperty("$t:name")) return item != null ? "$t:name" : "name";
  }
  return "name";
};

const UserRegistryFilterForm: FC<IUserRegistryFiltrationProps> = ({ form, onFormSubmit, onFormReset }) => {
  const t = useTranslations();
  const locale = useLocale();

  const { control } = form;

  const { data: rolesData } = useFetch("/api/user-registry/dictionaries/roles", "POST");
  const { data: createdByData } = useFetch("/api/user-registry/dictionaries/created-by", "POST");

  const fields = [
    {
      id: 1,
      label: t("User role"),
      name: "role",
      data: rolesData?.data,
      field: "name",
    },
    {
      id: 2,
      label: t("Registered by whom"),
      name: "createdBy",
      data: createdByData?.data,
      field: "emailAddress.address",
    },
  ] as const;

  return (
    <Box
      component="form"
      onSubmit={onFormSubmit && form.handleSubmit(onFormSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "30px",
          alignItems: "center",
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <Controller
          name="createdOn"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <Box sx={{ width: "100%" }}>
              <InputLabel>{t("Registration period")}</InputLabel>
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <DatePicker
                  boxSx={{
                    width: "50%",
                  }}
                  onChange={(date: Date) =>
                    field.onChange({
                      ...field.value,
                      value: isValid(date) ? format(date, "yyyy-MM-dd") : null,
                    })
                  }
                  placeholder="__/__/____"
                  value={field.value}
                />
                <Typography>{t("FromTo")}</Typography>
                <DatePicker
                  boxSx={{
                    width: "50%",
                  }}
                  onChange={(date: Date) =>
                    field.onChange({
                      ...field.value,
                      value2: isValid(date) ? format(date, "yyyy-MM-dd") : null,
                    })
                  }
                  placeholder="__/__/____"
                  value={field.value}
                />
              </Box>
            </Box>
          )}
        />
        {fields.map((item) => (
          <Controller
            key={item.id}
            control={control}
            name={item.name}
            defaultValue={null}
            render={({ field, fieldState }) => (
              <Box
                sx={{
                  width: {
                    md: "80%",
                    xs: "100%",
                  },
                }}
              >
                <InputLabel>{item.label}</InputLabel>
                <Select
                  boxSx={{
                    width: "100%",
                  }}
                  labelField={item.name === "role" ? getLabelField(item.data, locale) : item.field}
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  data={item.data ?? []}
                  value={field.value}
                  valueField={item.field}
                  startAdornment={<Search />}
                  onChange={(...event: any[]) => {
                    field.onChange(...event);
                  }}
                />
              </Box>
            )}
          />
        ))}
      </Box>
      <Box display="flex" gap="30px" flexDirection={{ xs: "column", md: "row" }} width={{ sx: "100%", md: "60%" }}>
        <Button
          startIcon={<FilterAltOffOutlined />}
          color="success"
          type="submit"
          buttonType="primary"
          sx={{ p: "10px 0" }}
        >
          {t("Apply a filter")}
        </Button>
        <Button startIcon={<EraserIcon />} buttonType="secondary" sx={{ p: "10px 0" }} onClick={onFormReset}>
          {t("Clear the filter")}
        </Button>
      </Box>
    </Box>
  );
};

export default UserRegistryFilterForm;
