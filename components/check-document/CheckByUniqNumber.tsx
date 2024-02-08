import React, { useEffect, useState } from "react";
import { Typography, Box, InputLabel, Collapse, Alert } from "@mui/material";
import { useTranslations } from "next-intl";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { useRouter } from "next/router";
import Hint from "@/components/ui/Hint";
import { IApplication } from "@/models/application";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SearchBar from "@/components/ui/SearchBar";
import { checkDocumentByNumber, ICheckDocumentByNumber } from "@/validator-schemas/check-document-by-number";

interface ICheckedDocument extends FetchResponseBody {
  data: IApplication[];
}

export default function CheckByUniqNumber() {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);
  const t = useTranslations();

  const { handleSubmit, formState, control } = useForm<ICheckDocumentByNumber>({
    resolver: yupResolver<ICheckDocumentByNumber>(checkDocumentByNumber),
  });
  const { data, loading, update, error } = useFetch<ICheckedDocument>("", "POST");

  const onSubmit = (data: { keyword?: string }) => {
    if (!data?.keyword || data.keyword?.trim() === "") {
      return;
    }
    update("/api/check-document", {
      domainVal: data.keyword,
    });
  };

  useEffect(() => {
    if (data?.total === 0 || error !== null) {
      setAlertOpen(true);
    }
    if (data?.data) {
      router.push(`/check-document/${encodeURIComponent(data?.data[0]?.uniqueQrCode as string)}`);
    }
  }, [data, error]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "30px" }}>
      <Collapse sx={{ width: "100%" }} in={alertOpen}>
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          {t("Document not found")}
        </Alert>
      </Collapse>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: "15px" }}>
        <InputLabel htmlFor="search-field" sx={{ whiteSpace: "normal", color: "#687C9B" }}>
          {t("Enter a unique number of the document to search:")}
        </InputLabel>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="keyword"
            control={control}
            render={({ field }) => (
              <SearchBar
                boxSx={{
                  ".css-19gtboq-MuiButtonBase-root-MuiButton-root": {
                    height: "43px",
                  },
                }}
                loading={loading}
                id="search-field"
                {...field}
                error={!!formState.errors.keyword?.message}
                helperText={t(formState.errors.keyword?.message)}
              />
            )}
          />
        </Box>
      </Box>

      <Hint
        type="hint"
        maxWidth="100%"
        sx={{
          alignSelf: "end",
        }}
      >
        <Typography fontWeight={400}>{t("Each signed notarized document has its unique number")}</Typography>
      </Hint>
    </Box>
  );
}
