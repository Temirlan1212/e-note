import React, { useEffect, useState } from "react";
import { Typography, Box, InputLabel, Collapse, Alert } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchOutlined } from "@mui/icons-material";

import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { useRouter } from "next/router";
import Hint from "@/components/ui/Hint";
import { IApplication } from "@/models/application";
import { Controller, useForm } from "react-hook-form";
import { checkDocumentById, ICheckDocumentById } from "@/validator-schemas/check-document-byId";
import { yupResolver } from "@hookform/resolvers/yup";

interface ICheckedDocument extends FetchResponseBody {
  data: IApplication[];
}

export default function CheckByID() {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);
  const t = useTranslations();

  const { handleSubmit, formState, control } = useForm<ICheckDocumentById>({
    resolver: yupResolver<ICheckDocumentById>(checkDocumentById),
  });
  const { data, update, error } = useFetch<ICheckedDocument>("", "POST");

  const onSubmit = (data: { keyword: string }) => {
    update("/api/check-document", {
      criteria: [
        {
          fieldName: "uniqueQrCode",
          operator: "=",
          value: data?.keyword,
        },
      ],
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
          {t("Enter a unique number (ID) of the document to search:")}
        </InputLabel>

        <Box component="form" sx={{ display: "flex" }} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="keyword"
            control={control}
            render={({ field }) => (
              <Input
                id="search-field"
                placeholder={t("Search")}
                fullWidth
                {...field}
                error={!!formState.errors.keyword?.message}
                helperText={t(formState.errors.keyword?.message)}
              />
            )}
          />
          <Button sx={{ width: "80px", height: "43px" }} type="submit" color="success">
            <SearchOutlined />
          </Button>
        </Box>
      </Box>

      <Hint
        type="hint"
        maxWidth="100%"
        sx={{
          alignSelf: "end",
        }}
      >
        <Typography fontWeight={400}>
          {t("Each notarial document has its unique number, consisting of n-characters Click on the")}
        </Typography>
      </Hint>
    </Box>
  );
}
