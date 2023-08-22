import { Dispatch, SetStateAction, useId } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Hint from "@/components/ui/Hint";
import { GridTable } from "@/components/ui/GridTable";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import useFetch from "@/hooks/useFetch";
import { GridValueGetterParams } from "@mui/x-data-grid";
import { IStatus } from "@/models/dictionaries/status";
import { IActionType } from "@/models/dictionaries/action-type";
import { useRouter } from "next/router";
import Link from "@/components/ui/Link";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  stepState: [number, Dispatch<SetStateAction<number>>];
  onPrev?: Function;
  onNext?: Function;
}

const getFullName = (name: string | null, lastName: string | null) => {
  if (name && lastName) {
    return lastName + " " + name;
  }
  return name ? name : lastName ? lastName : "";
};

export default function SuccessStepFields({ form, stepState, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();
  const { data: statusData } = useFetch("/api/dictionaries/status", "POST");
  const { data, loading } = useFetch(`/api/applications/${form.getValues().id ?? ""}`, "POST");
  const dataItem = data?.data?.[0];

  return (
    <Box display="flex" gap="30px" flexDirection="column">
      <Hint type="hint">
        <Typography fontSize={"18px"} fontWeight={600}>
          {t("The notarial action is entered in the register")}
        </Typography>
      </Hint>

      <Box display="flex" flexDirection="column" gap="30px">
        <GridTable
          loading={loading}
          rows={[
            {
              name: dataItem?.product?.fullName || "",
              date: dataItem?.creationDate || "",
              requester: getFullName(dataItem?.requester?.[0]?.name, dataItem?.requester?.[0]?.lastName),
              status: dataItem?.statusSelect || 0,
              id: useId(),
            },
          ]}
          columns={[
            {
              field: "name",
              headerName: "Type of action",
              width: 200,
              editable: false,
              sortable: false,
            },
            {
              field: "status",
              headerName: "Status",
              width: 200,
              editable: false,
              sortable: false,
              valueGetter: (params: GridValueGetterParams) => {
                if (statusData != null) {
                  const matchedItem = statusData?.data?.find((item: IStatus) => item.value == String(params.value));
                  const translatedTitle = matchedItem?.[("title_" + locale) as keyof IActionType];
                  return !!translatedTitle ? translatedTitle : matchedItem?.["title" as keyof IActionType] ?? "";
                }
                return params.value;
              },
            },
            {
              field: "date",
              headerName: "Date",
              width: 200,
              editable: false,
              sortable: false,
            },
            {
              field: "requester",
              headerName: "Applicant",
              width: 200,
              editable: false,
              sortable: false,
            },
          ]}
        />

        <Box width={{ xs: "100%", sm: "fit-content" }}>
          <Button>{t("Add to my templates")}</Button>
        </Box>
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Link href="/applications/create">
          <Button startIcon={<PostAddIcon />} sx={{ width: "auto", height: "50px" }}>
            <Typography>{t("Make a new action")}</Typography>
          </Button>
        </Link>

        <Link href="/applications">
          <Button startIcon={<ModeEditIcon />} sx={{ width: "auto", height: "50px" }} buttonType="secondary">
            <Typography>{t("Go to notary actions")}</Typography>
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
