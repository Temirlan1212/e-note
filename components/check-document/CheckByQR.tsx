import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { Html5Qrcode } from "html5-qrcode";
import { Typography, Box, Alert, Collapse } from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";

import Button from "../ui/Button";

export default function CheckByQR() {
  const [isEnabled, setEnabled] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const t = useTranslations();

  const router = useRouter();

  useEffect(() => {
    const config = { fps: 10, qrbox: { width: 200, height: 200 } };

    const html5QrCode = new Html5Qrcode("qrCodeContainer");

    const qrScanerStop = () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop();
      }
    };

    const qrCodeSuccess = (decodedText: string) => {
      const uniqueQrCode = decodedText.split("/").pop();
      router.push(`/check-document/${encodeURIComponent(uniqueQrCode as string)}`);
      setEnabled(false);
    };

    if (isEnabled) {
      html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccess, () => {});
    } else {
      qrScanerStop();
    }

    return () => {
      qrScanerStop();
    };
  }, [isEnabled]);

  return (
    <Box>
      <Collapse sx={{ width: "100%" }} in={alertOpen}>
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          {t("Document not found")}
        </Alert>
      </Collapse>
      <Box position="relative" mt="20px">
        <Box
          sx={{
            height: isEnabled ? "unset" : "296px",
            background: "#24334B",
          }}
          id="qrCodeContainer"
        />
        <Button
          variant="contained"
          color="success"
          sx={{
            display: isEnabled ? "none" : "flex",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
            gap: "8px",
            padding: "13px 22px",
          }}
          onClick={() => setEnabled(true)}
        >
          <PhotoCameraOutlinedIcon />
          <Typography fontWeight={600}>{t("Turn on camera")}</Typography>
        </Button>
      </Box>
      <Button
        variant="contained"
        color="success"
        sx={{
          display: isEnabled ? "flex" : "none",
          gap: "8px",
          padding: "13px 22px",
          marginTop: "20px",
        }}
        onClick={() => setEnabled(false)}
      >
        <PhotoCameraOutlinedIcon />
        <Typography fontWeight={600}>{t("Turn off camera")}</Typography>
      </Button>
    </Box>
  );
}
