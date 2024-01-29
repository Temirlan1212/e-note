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
  const [scanUrls, setScanUrls] = useState<string[]>();

  const { loading: pdfLoading, update: getPdf } = useFetch<Response>("", "GET", { returnResponse: true });
  const { loading: scanLoading, update: getScan } = useFetch<Response>("", "GET", { returnResponse: true });

  useEffectOnce(async () => {
    if (data.scan && data.scan.length > 0) {
      const lastScanIds = data.scan.map(async (scan) => {
        const pdfResponse = await getScan(`/api/files/download/${scan.id}`);
        const blob = await pdfResponse?.blob();
        if (blob == null) return;

        return URL.createObjectURL(blob);
      });
      const scansUrl = await Promise.all(lastScanIds);

      setScanUrls(scansUrl as string[]);
    } else if (data?.documentInfo?.pdfLink != null && data?.documentInfo?.token != null) {
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
      </Box>

      {!scanLoading ? (
        scanUrls && scanUrls.reverse().map((scanUrl, idx) => <PDFViewer key={idx} fileUrl={scanUrl} />)
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress color="success" />
        </Box>
      )}

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
