import { ChangeEvent, Dispatch, SetStateAction, useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, InputLabel, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Hint from "@/components/ui/Hint";
import { GridTable } from "@/components/ui/GridTable";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { GridValueGetterParams } from "@mui/x-data-grid";
import { IStatus } from "@/models/application-status";
import { IActionType } from "@/models/action-type";
import { useRouter } from "next/router";
import Link from "@/components/ui/Link";
import { ITemplateData } from "@/components/template-list/TemplateList";
import Input from "@/components/ui/Input";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function;
  onNext?: Function;
}

const getFullName = (name: string | null, lastName: string | null) => {
  if (name && lastName) {
    return lastName + " " + name;
  }
  return name ? name : lastName ? lastName : "";
};

export default function SuccessStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();
  const { locale, push } = useRouter();
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [inputError, setInputError] = useState<boolean>(false);
  const { data: statusData } = useFetch("/api/dictionaries/application-status", "POST");
  const { data, loading } = useFetch(`/api/applications/${form.getValues().id ?? ""}`, "POST");
  const dataItem = data?.data?.[0];

  const {
    data: templateData,
    loading: templateLoading,
    update,
  } = useFetch<FetchResponseBody<ITemplateData>>("", "POST");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value) {
      setInputError(false);
    }
  };

  const handleInMyTemplatesClick = async (callback: Dispatch<SetStateAction<boolean>>) => {
    if (inputValue && !templateLoading) {
      callback(false);
      await update("/api/templates/create", {
        id: dataItem?.product?.id,
        name: inputValue,
      });
      setInputValue(null);
      setInputError(false);
    }
    if (!inputValue) {
      setInputError(true);
    }
  };

  useEffect(() => {
    if (templateData?.data?.editUrl && templateData?.data?.userToken) {
      const href = `${templateData.data.editUrl}?AuthorizationBasic=${templateData.data.userToken.replace(
        /Basic /,
        ""
      )}` as string;
      window.open(href, "_blank");
      push("/applications");
    }
  }, [templateData?.data]);

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
              name: locale !== "en" ? dataItem?.product?.["$t:name"] || "" : dataItem?.product?.name || "",
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

        <ConfirmationModal
          title={t("To my templates")}
          hintText={t("Do you really want to add to the My Templates section?")}
          hintTitle=""
          onConfirm={(callback) => handleInMyTemplatesClick(callback)}
          slots={{
            body: () => (
              <Box sx={{ marginBottom: "20px" }}>
                <InputLabel>{t("Enter a template name")}</InputLabel>
                <Input
                  value={inputValue}
                  onChange={handleSearchChange}
                  inputType={inputError ? "error" : "secondary"}
                  helperText={inputError && t("This field is required!")}
                />
              </Box>
            ),
          }}
        >
          <Box width={{ xs: "100%", sm: "fit-content" }}>
            <Button loading={templateLoading}>{t("Add to my templates")}</Button>
          </Box>
        </ConfirmationModal>
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
