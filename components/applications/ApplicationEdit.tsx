import { Box } from "@mui/material";
import Select from "@/components/ui/Select";
import { useForm } from "react-hook-form";
import { useDictionaryStore } from "@/stores/dictionaries";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { IApplication } from "@/models/applications/applications";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const ApplicationEdit = ({ data }: { data: IApplication }) => {
  const t = useTranslations();

  interface FormValues {
    statusSelect: string;
  }

  const form = useForm<FormValues>();

  const actionTypeData = useDictionaryStore((store) => store.actionTypeData);
  const documentTypeData = useDictionaryStore((store) => store.documentTypeData);
  const statusData = useDictionaryStore((store) => store.statusData);

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  const customLocaleText = {
    months: [
      "January_Custom",
      "February_Custom",
      "March_Custom",
      "April_Custom",
      "May_Custom",
      "June_Custom",
      "July_Custom",
      "August_Custom",
      "September_Custom",
      "October_Custom",
      "November_Custom",
      "December_Custom",
    ],
    weekdays: [
      "Sunday_Custom",
      "Monday_Custom",
      "Tuesday_Custom",
      "Wednesday_Custom",
      "Thursday_Custom",
      "Friday_Custom",
      "Saturday_Custom",
    ],
  };

  return (
    <Box display="flex" alignItems="center" gap="10px">
      <Box component="form" onSubmit={form.handleSubmit(onSubmit)} maxWidth={300}>
        <Select
          data={actionTypeData ?? []}
          labelField="title"
          outputField="value"
          register={form.register}
          name="typeNotarialAction"
          defaultValue={String(data.typeNotarialAction) ?? ""}
        />

        <Select
          data={documentTypeData ?? []}
          labelField="name"
          outputField="id"
          register={form.register}
          name="product.name"
          defaultValue={String(data["product.id"]) ?? ""}
        />

        <Select
          data={statusData ?? []}
          labelField="title"
          outputField="value"
          register={form.register}
          name="statusSelect"
          defaultValue={String(data?.statusSelect) ?? ""}
        />

        <DatePicker
          label="Controlled picker"
          localeText={{
            clearButtonLabel: "tima",
          }}
        />

        <Button
          type="submit"
          sx={{
            padding: "10px 0",
            width: { xs: "100%", md: 250 },
            display: "flex",
            gap: "30px",
          }}
          fullWidth
          color="success"
        >
          {t("Apply")}
        </Button>
      </Box>
    </Box>
  );
};
