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

interface ICheckedDocument extends FetchResponseBody {
  data: IApplication[];
}

export default function CheckByID() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const t = useTranslations();

  const { data, update } = useFetch<ICheckedDocument>("", "POST");

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleKeywordSearch: React.MouseEventHandler<HTMLDivElement> &
    ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) = (event) => {
    event.preventDefault();
    if (keyword.trim() === "") {
      return;
    }
    update("/api/check-document", {
      criteria: [
        {
          fieldName: "uniqueQrCode",
          operator: "=",
          value: keyword,
        },
      ],
    });
  };

  useEffect(() => {
    if (data?.total === 0) {
      setAlertOpen(true);
    }
    if (data?.data) {
      router.push(`/check-document/${encodeURIComponent(data?.data[0]?.uniqueQrCode as string)}`);
    }
  }, [data]);

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

        <SearchBar onChange={handleKeywordChange} onClick={handleKeywordSearch} value={keyword} name="search-field" />
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
