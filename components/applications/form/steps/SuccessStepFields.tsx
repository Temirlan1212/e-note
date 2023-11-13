import { useId } from "react";
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
import { IStatus } from "@/models/application-status";
import { IActionType } from "@/models/action-type";
import { useRouter } from "next/router";
import Link from "@/components/ui/Link";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function;
  onNext?: Function;
}

export default function SuccessStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();
  const { data: statusData } = useFetch("/api/dictionaries/application-status", "POST");
  const { data, loading } = useFetch(`/api/applications/${form.getValues().id ?? ""}`, "POST");
  const dataItem = data?.data?.[0];

  return (
    <Box display="flex" gap="30px" flexDirection="column">
      <Hint type="hint">
        <Typography fontSize={"18px"} fontWeight={600}>
          {t("Your application has been successfully sent to the notary")}
        </Typography>
      </Hint>

      <Box display="flex" flexDirection="column" gap="30px">
        <Box>
          <GridTable
            rowHeight={80}
            loading={loading}
            rows={[
              {
                name: locale !== "en" ? dataItem?.product?.["$t:name"] || "" : dataItem?.product?.name || "",
                date: dataItem?.creationDate || "",
                notary: dataItem?.company?.name,
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
                field: "notary",
                headerName: "Notary",
                width: 200,
                editable: false,
                sortable: false,
                cellClassName: "notaryColumn",
              },
            ]}
            sx={{
              height: "100%",
              ".notaryColumn": {
                color: "success.main",
              },
            }}
          />
        </Box>
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Link href="/applications/create">
          <Button startIcon={<PostAddIcon />} sx={{ width: "auto", height: "50px" }}>
            <Typography>{t("Make a new application")}</Typography>
          </Button>
        </Link>
        <Link href="/applications">
          <Button startIcon={<ModeEditIcon />} sx={{ width: "auto", height: "50px" }} buttonType="secondary">
            <Typography>{t("Go to applications")}</Typography>
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
