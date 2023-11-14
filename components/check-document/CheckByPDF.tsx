import { ChangeEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Alert, Collapse } from "@mui/material";
import useFetch from "@/hooks/useFetch";
import SearchBar from "@/components/ui/SearchBar";
import { useRouter } from "next/router";

export default function CheckByPDF() {
  const t = useTranslations();
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [base64Doc, setBase64Doc] = useState<string | null>(null);

  const { data, loading, update } = useFetch("", "POST");

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      setFile(e.target?.files[0]!);
    }
  };

  const handleFileSubmit = async () => {
    if (file) {
      await update("/api/check-document/byPdf", {
        encodedDocument: base64Doc,
      });
    }
  };

  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      const base64Content = reader.result;
      if (typeof base64Content === "string") {
        const base64WithoutHeader = base64Content.split(",")[1];
        setBase64Doc(base64WithoutHeader);
      }
    };

    reader.readAsDataURL(file);
  }

  useEffect(() => {
    if (data?.data) {
      router.push("/check-document/" + data.data);
    }
    if (data?.status === 0 && data.data == null) {
      setAlertOpen(true);
    }
  }, [data]);

  return (
    <Box display="flex" flexDirection="column" gap="20px">
      <Collapse sx={{ width: "100%" }} in={alertOpen}>
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          {t("Document not found")}
        </Alert>
      </Collapse>
      <SearchBar type="file" loading={loading} onChange={handleFileChange} onClick={handleFileSubmit} />
    </Box>
  );
}
