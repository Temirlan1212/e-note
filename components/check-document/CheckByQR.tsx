import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { Html5Qrcode } from "html5-qrcode";
import { Typography, Box } from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";

import Button from "../ui/Button";
import Hint from "@/components/ui/Hint";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";

export default function CheckByQR() {
  const [isEnabled, setEnabled] = useState(false);
  const [qrMessage, setQrMessage] = useState("");
  const t = useTranslations();

  const router = useRouter();

  const { data, update } = useFetch("", "POST");

  useEffect(() => {
    const config = { fps: 10, qrbox: { width: 200, height: 200 } };

    const html5QrCode = new Html5Qrcode("qrCodeContainer");

    const qrScanerStop = () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop();
      }

      update("/api/check-document", {
        criteria: [
          {
            fieldName: "uniqueQrCode",
            operator: "=",
            value: qrMessage,
          },
        ],
      });
    };

    const qrCodeSuccess = (decodedText: string) => {
      setQrMessage(decodedText);
      setEnabled(false);
    };

    if (isEnabled) {
      html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccess, () => {});
      setQrMessage("");
    } else {
      qrScanerStop();
    }

    return () => {
      qrScanerStop();
    };
  }, [isEnabled]);

  useEffectOnce(() => {
    if (data?.data) {
      router.push(`/check-document/${encodeURIComponent(data?.data[0]?.uniqueQrCode as string)}`);
    }
  }, [data?.data]);

  return (
    <Box>
      <Box position="relative">
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
      {qrMessage && (
        <Hint type="hint" title="Document Found" maxWidth="100%" sx={{ marginTop: "20px" }}>
          <Typography>{qrMessage}</Typography>
        </Hint>
      )}
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
