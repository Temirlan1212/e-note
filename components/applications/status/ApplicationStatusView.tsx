import { FC, useState } from "react";

import { useTranslations } from "next-intl";
import { Box, CircularProgress, Typography } from "@mui/material";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

import Button from "@/components/ui/Button";
import PDFViewer from "@/components/PDFViewer";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { IApplication } from "@/models/application";

interface IApplicationStatusViewProps {
  data: IApplication;
}

const ApplicationStatusView: FC<IApplicationStatusViewProps> = (props) => {
  const t = useTranslations();

  const { data } = props;

  const [docUrl, setDocUrl] = useState<string>();

  const { loading: pdfLoading, update: getPdf } = useFetch<Response>("", "GET", { returnResponse: true });
  const { loading: scanLoading, update: getScan } = useFetch<Response>("", "GET", { returnResponse: true });

  useEffectOnce(async () => {
    if (data.scan) {
      const lastScanId = data.scan[data.scan.length - 1].id;
      const pdfResponse = await getScan(`/api/files/download/${lastScanId}`);

      const binary = await pdfResponse?.text();
      const pdfBlob = new Blob([binary], { type: "application/pdf" });

      // Создайте URL из Blob и установите его в состояние
      const blobUrl = URL.createObjectURL(pdfBlob);

      setDocUrl(blobUrl);
    }
  }, [data]);

  console.log(docUrl);

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
      </Box>

      {!pdfLoading ? (
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
