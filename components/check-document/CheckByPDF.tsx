import { ChangeEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Typography, Fade } from "@mui/material";
import useFetch from "@/hooks/useFetch";
import SearchBar from "@/components/ui/SearchBar";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function CheckByPDF() {
  const t = useTranslations();
  const [file, setFile] = useState<File | null>(null);
  const [base64Doc, setBase64Doc] = useState<string | null>(null);

  const { data, loading, update } = useFetch("", "POST");

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      setFile(e.target?.files[0]);
    }
  };

  const handleFileSubmit = async () => {
    if (file) {
      await update("/api/check-document/byPdf", {
        signDocument: base64Doc,
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

  return (
    <Box display="flex" flexDirection="column" gap="20px">
      <SearchBar type="file" loading={loading} onChange={handleFileChange} onClick={handleFileSubmit} />

      {data && (
        <Box sx={{ marginTop: "50px" }}>
          {data?.status === 0 && (
            <Fade in={data?.status === 0} timeout={1000}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "2px dashed #1BAA75",
                }}
              >
                <CheckCircleIcon sx={{ width: 50, height: 50 }} color="success" />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="h5" color="#1BAA75">
                    {t("Signed")}
                  </Typography>
                  <Typography variant="h5">{data?.data?.company}</Typography>
                </Box>
              </Box>
            </Fade>
          )}

          {data?.status != 0 && (
            <Fade in={data?.status != 0} timeout={1000}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "2px dashed #d32f2f",
                }}
              >
                <ErrorIcon sx={{ width: 50, height: 50 }} color="error" />
                <Typography variant="h5" color="#d32f2f">
                  {t("Not signed")}
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>
      )}
    </Box>
  );
}
