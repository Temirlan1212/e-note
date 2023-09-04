import { FC } from "react";

import { useTranslations } from "next-intl";
import { Box, Typography } from "@mui/material";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

import Button from "@/components/ui/Button";
// import PDFViewer from "@/components/PDFViewer";

interface IDocumentViewProps {}

const DocumentView: FC<IDocumentViewProps> = (props) => {
  const t = useTranslations();

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
        >
          {t("Download PDF")}
        </Button>
      </Box>

      {/* <PDFViewer fileUrl="pdfFile" /> */}
    </Box>
  );
};

export default DocumentView;
