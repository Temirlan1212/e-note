import { FC, useState } from "react";

import { useTranslations } from "next-intl";
import Link from "next/link";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { Box, Typography } from "@mui/material";

import Button from "@/components/ui/Button";
import useFetch from "@/hooks/useFetch";
import DocumentRead from "@/components/check-document/document/DocumentRead";
import DocumentView from "@/components/check-document/document/DocumentView";
import useEffectOnce from "@/hooks/useEffectOnce";

interface IDocumentInfoContentProps {
  id?: string;
}

const DocumentInfoContent: FC<IDocumentInfoContentProps> = ({ id }) => {
  const t = useTranslations();

  const [accessToView, setAccessToView] = useState(false);

  const { data: document } = useFetch(id ? `/api/check-document/${id}` : "", "POST");

  useEffectOnce(() => {
    if (document?.data[0] != null) {
      const generalAccess = document?.data[0]?.documentInfo?.generalAccess;
      if (generalAccess === true) {
        setAccessToView(true);
      }
    }
  }, [document]);

  return (
    <Box
      sx={{
        p: {
          xs: "10px",
          md: "40px",
        },
      }}
      display="flex"
      flexDirection="column"
      gap="40px"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          {t("Document Validation")}
        </Typography>
        <Link href="/check-document">
          <Button
            variant="text"
            sx={{
              backgroundColor: "none",
              color: "#1BAA75",
              fontSize: "16px",
              width: "auto",
              ":hover": {
                backgroundColor: "transparent !important",
              },
            }}
            startIcon={<KeyboardBackspaceOutlinedIcon />}
          >
            {t("Back")}
          </Button>
        </Link>
      </Box>
      <DocumentRead data={document?.data[0]} />
      {accessToView && <DocumentView data={document?.data[0]} />}
    </Box>
  );
};

export default DocumentInfoContent;
