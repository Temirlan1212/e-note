import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Link, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface ShowRemindProps {
  closeRemind?: Function;
  documentFound: boolean;
  remindTitle?: JSX.Element;
  remindText?: JSX.Element;
}

export default function ShowRemind({ closeRemind, documentFound, remindTitle, remindText }: ShowRemindProps) {
  const t = useTranslations();

  return (
    <Box
      sx={{
        display: "flex",
        height: "auto",
        width: "auto",
        padding: "16px",
        gap: "5px",
        boxShadow: "0px 10px 20px 0px #E9E9E9",
        justifyContent: "space-between",
      }}
    >
      {!documentFound ? (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography fontWeight={400} color="#687C9B">
            {t("Each notarial document has its unique number, consisting of n-characters Click on the")}
            <Link href="#" color="success.main" sx={{ textDecoration: "underline" }}>
              {t("link")}{" "}
            </Link>
            {t("to find out how to get it")}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography color="secondary" fontWeight={600}>
            {remindTitle}
          </Typography>
          <Typography color="#687C9B" fontWeight={400}>
            {remindText}
          </Typography>
        </Box>
      )}

      {!documentFound ? (
        <CloseIcon
          onClick={(event) => closeRemind?.(event)}
          width={24}
          height={24}
          style={{ cursor: "pointer", color: "green" }}
        />
      ) : (
        <CheckCircleIcon width={24} height={24} style={{ cursor: "pointer", color: "green" }} />
      )}
    </Box>
  );
}
