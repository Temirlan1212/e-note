import React, { useState, useRef } from "react";
import { Typography, Box, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import jsQR from "jsqr";

import ShowRemind from "./ShowRemind";
import NothingFound from "./NothingFound";
import Button from "../ui/Button";

export default function CheckByQR() {
  const [documentFound, setDocumentFound] = useState(false);
  const [documentData, setDocumentData] = useState<any>({});
  const [cameraOpened, setCameraOpened] = useState(false);
  const [scannedData, setScannedData] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const t = useTranslations();

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  if (cameraOpened) {
    startScanner();
  }

  const decodeQRCode = (imageData: ImageData) => {
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      return code.data;
    } else {
      return null;
    }
  };

  const handleScan = () => {
    fetch(`https://jsonplaceholder.typicode.com/users/1`)
      .then((response) => {
        if (!response.ok) {
          setDocumentFound(false);
          return {};
        }
        return response.json();
      })
      .then((json) => {
        if (Object.keys(json).length === 0) {
          setDocumentFound(false);
        } else {
          setDocumentData(json);
          setDocumentFound(true);
        }
      })
      .catch((error) => {
        setDocumentFound(false);
      });

    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrData = decodeQRCode(imageData);
        setScannedData(qrData || "");
      }
    }
  };

  const stopScanner = () => {
    setCameraOpened(false);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream?.getTracks() || [];
      tracks.forEach((track: MediaStreamTrack) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleOpenCamera = (e: React.MouseEvent) => {
    e.preventDefault();
    setCameraOpened(true);
  };

  const handleOpenDocument = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <>
      {!cameraOpened ? (
        <Box
          sx={{
            display: cameraOpened ? "none" : "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#24334B",
            height: "296px",
          }}
        >
          <Button
            href="/"
            variant="contained"
            color="success"
            onClick={handleOpenCamera}
            sx={{
              width: "auto",
              gap: "8px",
              padding: "13px 22px",
            }}
          >
            <PhotoCameraOutlinedIcon />
            <Typography fontWeight={600}>{t("Turn on camera")}</Typography>
          </Button>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "296px",
            }}
          >
            <video ref={videoRef} width="618px" height="296px" style={{ objectFit: "none" }} />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Button variant="contained" color="success" onClick={stopScanner}>
                <Typography fontWeight={600}>{t("Stop Scanner")}</Typography>
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" color="success" onClick={handleScan}>
                <Typography fontWeight={600}>{t("Scan QR code")}</Typography>
              </Button>
            </Grid>
          </Grid>
        </>
      )}
      {scannedData ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: { xs: "30px 10px", md: "30px 20px" },
            width: "100%",
            gap: "30px",
            backgroundColor: "#FFF",
            boxShadow: "0px 10px 40px 0px #DCDCDC",
          }}
        >
          <ShowRemind
            documentFound={documentFound}
            remindTitle={<Typography>Document Found</Typography>}
            remindText={
              <Typography>Click on the button for details to view information about the notarial document</Typography>
            }
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Typography fontWeight={600}>{t(`${documentData.name}`)}</Typography>
            <Box sx={{ display: "grid", gap: "10px" }}>
              <QrCodeScannerIcon />
              <Typography align="center">{scannedData}</Typography>
            </Box>
          </Box>

          <Button
            href="/"
            variant="contained"
            color="success"
            onClick={handleOpenDocument}
            sx={{
              width: "auto",
              gap: "8px",
              padding: "13px 22px",
            }}
          >
            <Typography fontWeight={600}>{t("More")}</Typography>
          </Button>
        </Box>
      ) : (
        <NothingFound />
      )}
    </>
  );
}