import { FC, useState } from "react";

import { useTranslations } from "next-intl";
import { Box, CircularProgress, Typography } from "@mui/material";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

import Button from "@/components/ui/Button";
import PDFViewer from "@/components/PDFViewer";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";

interface IApplicationStatusViewProps {
  data: {
    documentInfo: {
      pdfLink: string;
      token: string;
      fileName: string;
      editUrl: string;
    };
  };
}

const ApplicationStatusView: FC<IApplicationStatusViewProps> = (props) => {
  const t = useTranslations();

  const { data } = props;

  const [docUrl, setDocUrl] = useState<string>();

  const { loading: pdfLoading, update: getPdf } = useFetch<Response>("", "GET", { returnResponse: true });

  const handlePdfDownload = async (pdfLink: string, token: string) => {
    if (!pdfLink || !token) return;

    const pdfResponse = await getPdf(`/api/adapter?url=${pdfLink}&token=${token}`);
    const blob = await pdfResponse?.blob();
    if (blob == null) return;

    setDocUrl(URL.createObjectURL(blob));
  };

  useEffectOnce(async () => {
    if (data?.documentInfo?.pdfLink != null && data?.documentInfo?.token != null) {
      const pdfResponse = await getPdf(
        `/api/adapter?url=${data.documentInfo.pdfLink}&token=${data.documentInfo.token}`
      );

      const blob = await pdfResponse?.blob();
      if (blob == null) return;

      setDocUrl(URL.createObjectURL(blob));
    }
  }, [data]);

  return (
    <Box display="flex" flexDirection="column" gap="25px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#687C9B",
          }}
        >
          {t("Viewing a document")}
        </Typography>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "none",
            border: "1px dashed #CDCDCD",
            color: "#1BAA75",
            fontSize: "14px",
            padding: "10px 20px",
            width: "auto",
            ":hover": {
              backgroundColor: "transparent !important",
              border: "1px dashed #CDCDCD",
            },
          }}
          startIcon={<PictureAsPdfOutlinedIcon />}
          onClick={() => handlePdfDownload(data?.documentInfo?.pdfLink, data?.documentInfo?.token)}
        >
          {t("Download PDF")}
        </Button>
      </Box>

      {pdfLoading ? (
        docUrl && <PDFViewer fileUrl={docUrl} />
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress color="success" />
        </Box>
      )}
    </Box>
  );
};

export default ApplicationStatusView;
