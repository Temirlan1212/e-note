import React, { useState, useRef } from "react";
import ShowRemind from "./ShowRemind";
import NothingFound from "./NothingFound";
import Button from "@/components/ui/Button";
import { Typography, Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import Grid from "@mui/material/Unstable_Grid2";

export default function CheckByQR() {
  const [documentFound, setDocumentFound] = useState(false);
  const [documentData, setDocumentData] = useState({});
  const [cameraOpened, setCameraOpened] = useState(false);
  const t = useTranslations();

  const videoRef = useRef(null);
  const [scannedData, setScannedData] = useState("");

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  if (cameraOpened) {
    startScanner();
  }

  const stopScanner = () => {
    setCameraOpened(false);
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
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
        console.log(json);
        if (Object.keys(json).length === 0) {
          setDocumentFound(false);
        } else {
          setDocumentData(json);
          setDocumentFound(true);
        }
      })
      .catch((error) => {
        console.error("Error occurred during fetch:", error);
        setDocumentFound(false);
      });

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const qrData = decodeQRCode(imageData);

    setScannedData(qrData);
  };

  const handleOpenCamera = (e) => {
    e.preventDefault();
    setCameraOpened(true);
  };

  const handleOpenDocument = (e) => {
    e.preventDefault();
    alert("OPEN DOCUMENT");
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
            <Box component="img" alt="#" src="/icons/camera.svg" height="100%" />
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
            {/* <button onClick={startScanner}>Start Scanner</button> */}
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
      {documentFound ? (
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
            remindTitle="Document Found"
            remindText="Click on the button for details to view information about the notary document"
            iconUrl="/icons/check-mark.svg"
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
              <Box component="img" src="/icons/qrcode.svg" alt="QR code" />
              <Typography align="center">{documentData.address.zipcode}</Typography>
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

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/check-power-of-attorney.json`)).default,
      },
    },
  };
}
