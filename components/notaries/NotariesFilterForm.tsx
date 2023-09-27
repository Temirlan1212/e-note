import { useLocale, useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { INotaryDistrict } from "@/models/notary-district";
import { Box, InputLabel } from "@mui/material";
import Autocomplete from "@/components/ui/Autocomplete";
import Area from "@/components/fields/Area";
import { INotariesSchema } from "@/validator-schemas/notaries";
import Button from "@/components/ui/Button";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import EraserIcon from "@/public/icons/eraser.svg";
import Radio from "@/components/ui/Radio";

export interface INotariesFilterForm {
  form: UseFormReturn<INotariesSchema>;
  onFormSubmit?: (form: INotariesSchema) => void;
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

export default function NotariesFilterForm({ form, onFormSubmit, onFormReset }: INotariesFilterForm) {
  const t = useTranslations();
  const locale = useLocale();

  const { trigger, control, watch } = form;

  const city = watch("city");

  const { data: notaryDistrictDictionary, loading: notaryDistrictDictionaryLoading } = useFetch(
    city != null ? `/api/dictionaries/notary-districts?cityId=${city.id}` : "",
    "GET"
  );

  const { data: workDaysAreaData } = useFetch("/api/notaries/dictionaries/work-days", "GET");
  const { data: notaryTypesData } = useFetch("/api/notaries/dictionaries/notary-types", "GET");

  const fields = [
    {
      id: 1,
      label: t("Type of notary"),
      name: "typeOfNotary",
      data: notaryTypesData,
    },
    {
      id: 2,
      label: t("Working days"),
      name: "workingDay",
      data: workDaysAreaData,
    },
  ] as const;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: "25px", md: "40px" },
      }}
      component="form"
      onSubmit={onFormSubmit && form.handleSubmit(onFormSubmit)}
    >
      <Box display="flex" gap="20px" flexDirection="column" width="100%">
        <Area form={form} names={{ region: "region", district: "district", city: "city" }} />

        <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
          {fields.map((item) => (
            <Controller
              key={item.id}
              control={control}
              name={item.name}
              defaultValue={null}
              render={({ field, fieldState }) => (
                <Box display="flex" flexDirection="column" width="100%">
                  <InputLabel>{item.label}</InputLabel>
                  <Autocomplete
                    labelField={getLabelField(item.data, locale)}
                    type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                    options={item.data?.status === 0 ? (item.data?.data as Record<string, any>[]) ?? [] : []}
                    value={
                      field.value != null
                        ? (item.data?.data ?? []).find(
                            (item: Record<string, any>) => item?.value == field.value?.value
                          ) ?? null
                        : null
                    }
                    onBlur={field.onBlur}
                    onChange={(event, value) => {
                      field.onChange(value?.value != null ? { value: value?.value } : null);
                    }}
                  />
                </Box>
              )}
            />
          ))}

          <Controller
            control={control}
            name={"notaryDistrict"}
            defaultValue={null}
            render={({ field, fieldState }) => (
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel>{t("Notary district")}</InputLabel>
                <Autocomplete
                  labelField={getLabelField(notaryDistrictDictionary, locale)}
                  type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  disabled={!city}
                  options={
                    notaryDistrictDictionary?.status === 0
                      ? (notaryDistrictDictionary?.data as INotaryDistrict[]) ?? []
                      : []
                  }
                  loading={notaryDistrictDictionaryLoading}
                  value={
                    field.value != null
                      ? (notaryDistrictDictionary?.data ?? []).find(
                          (item: INotaryDistrict) => item.id == field.value?.id
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
        </Box>
      </Box>

      <Controller
        name="workMode"
        control={control}
        render={({ field }) => (
          <Radio
            labelField="name"
            row
            {...field}
            data={[
              { name: t("Around the clock"), value: "roundClock" },
              { name: t("Visiting"), value: "checkOut" },
            ]}
          />
        )}
      />

      <Box display="flex" gap="30px" flexDirection={{ xs: "column", md: "row" }} width={{ sx: "100%", md: "60%" }}>
        <Button
          startIcon={<FilterAltOutlinedIcon />}
          color="success"
          type="submit"
          buttonType="primary"
          sx={{ p: "10px 0" }}
        >
          {t("Apply a filter")}
        </Button>
        <Button sx={{ p: "10px 0" }} startIcon={<EraserIcon />} onClick={onFormReset} buttonType="secondary">
          {t("Clear the filter")}
        </Button>
      </Box>
    </Box>
  );
}
