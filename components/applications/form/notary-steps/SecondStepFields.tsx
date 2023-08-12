import { useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { useProfileStore } from "@/stores/profile";
import { IProduct } from "@/models/applications/application-list";
import { Box, InputLabel, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Hint from "@/components/ui/Hint";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  onPrev?: Function | null;
  onNext?: Function | null;
}

export default function SecondStepFields({ form, onPrev, onNext }: IStepFieldsProps) {
  const profile = useProfileStore.getState();
  const t = useTranslations();

  const { trigger, control, getValues, setValue } = form;

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [myDocumentFilter, setMyDocumentFilter] = useState<Record<string, any>>({});
  const [systemDocumentFilter, setSystemMyDocumentFilter] = useState<Record<string, any>>({});

  const { data: myDocuments, loading: myDocumentsLoading } = useFetch("/api/dictionaries/document-type", "POST", {
    body: myDocumentFilter,
  });
  const { data: systemDocuments, loading: systemDocumentsLoading } = useFetch(
    "/api/dictionaries/document-type",
    "POST",
    {
      body: systemDocumentFilter,
    }
  );

  const { update: applicationUpdate } = useFetch("", "PUT");

  useEffectOnce(() => {
    setMounted(true);
    setSystemMyDocumentFilter({ formValues: { isSystem: true } });
  });

  useEffectOnce(() => {
    setMyDocumentFilter({ formValues: { createdBy: profile.userData?.id } });
  }, [profile]);

  useEffectOnce(() => {
    console.log(myDocuments);
  }, [myDocuments]);

  useEffectOnce(() => {
    console.log(systemDocuments);
  }, [systemDocuments]);

  const triggerFields = async () => {
    return await trigger(["product"]);
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async () => {
    const validated = await triggerFields();

    if (validated) {
      setLoading(true);

      const values = getValues();
      const data: Partial<IApplicationSchema> = {
        id: values.id,
        version: values.version,
        product: values.product,
      };

      const result = await applicationUpdate(`/api/applications/update/${values.id}`, data);
      if (result != null && result.data != null && result.data[0]?.id != null) {
        setValue("version", result.data[0].version);
        if (onNext != null) onNext();
      }

      setLoading(false);
    }
  };

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box
        display="flex"
        justifyContent="space-between"
        gap={{ xs: "20px", md: "200px" }}
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Typography variant="h4" whiteSpace="nowrap">
          {t("Choose document from templates")}
        </Typography>
        <Hint type="hint">{t("Notary form first step hint text")}</Hint>
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name="product.id"
          defaultValue={null}
          render={({ field, fieldState }) => {
            return (
              <Box width="100%" display="flex" flexDirection="column" gap="10px">
                <InputLabel>{t("Searched document")}</InputLabel>
                <Select
                  selectType={field.value ? "success" : "secondary"}
                  labelField="name"
                  valueField="id"
                  data={myDocuments?.status === 0 ? (myDocuments?.data as IProduct[]) ?? [] : []}
                  loading={myDocumentsLoading}
                  value={field.value == null ? "" : field.value}
                  onBlur={field.onBlur}
                  onChange={(...event: any[]) => {
                    field.onChange(...event);
                    trigger(field.name);
                  }}
                />
              </Box>
            );
          }}
        />
        <Controller
          control={control}
          name="product.id"
          defaultValue={null}
          render={({ field, fieldState }) => {
            return (
              <Box width="100%" display="flex" flexDirection="column" gap="10px">
                <InputLabel>{t("Searched document")}</InputLabel>
                <Select
                  selectType={field.value ? "success" : "secondary"}
                  labelField="name"
                  valueField="id"
                  data={systemDocuments?.status === 0 ? (systemDocuments?.data as IProduct[]) ?? [] : []}
                  loading={systemDocumentsLoading}
                  value={field.value == null ? "" : field.value}
                  onBlur={field.onBlur}
                  onChange={(...event: any[]) => {
                    field.onChange(...event);
                    trigger(field.name);
                  }}
                />
              </Box>
            );
          }}
        />
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        {onPrev != null && (
          <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />}>
            {t("Prev")}
          </Button>
        )}
        {onNext != null && (
          <Button loading={loading} onClick={handleNextClick} endIcon={<ArrowForwardIcon />}>
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
