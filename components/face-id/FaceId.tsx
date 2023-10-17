import { FC, useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import useFetch from "@/hooks/useFetch";
import { Alert, Box, Collapse, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

interface IFaceIdScannerProps {
  getStatus: (status: boolean) => void;
}

const FaceIdScanner: FC<IFaceIdScannerProps> = ({ getStatus }) => {
  const t = useTranslations();
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);

  const { update } = useFetch("", "POST");

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current?.stream as MediaStream, {
      mimeType: "video/webm",
      videoBitsPerSecond: 200000,
    });
    mediaRecorderRef.current?.addEventListener("dataavailable", handleDataAvailable);
    mediaRecorderRef.current?.start();

    setTimeout(() => {
      mediaRecorderRef.current?.stop();
      setCapturing(false);
    }, 2000);
  }, [recordedChunks, webcamRef, setCapturing, mediaRecorderRef]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const formData = new FormData();
      formData.append("file", blob);
      update("/api/face-id", formData).then((res) => {
        if (!res?.data?.success) {
          setAlertOpen(true);
        }
        getStatus(res?.data?.success);
      });
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  if (recordedChunks.length > 0) {
    handleDownload();
  }

  const handleDataAvailable = useCallback(
    ({ data }: BlobEvent) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setIsCameraAvailable(true);
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch((e) => {
        setIsCameraAvailable(false);
        console.log(e);
      });
  }, []);

  return (
    <>
      <Box display="flex" flexDirection="column" gap="15px">
        <Collapse in={alertOpen}>
          <Alert severity="warning" onClose={() => setAlertOpen(false)}>
            {t("This action failed")}
          </Alert>
        </Collapse>
        {isCameraAvailable ? (
          <>
            <Webcam
              width="100%"
              height="200px"
              videoConstraints={{ facingMode: "user" }}
              audio={false}
              ref={webcamRef}
            />
            <Button
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
              }}
              buttonType="secondary"
              onClick={handleStartCaptureClick}
              disabled={capturing}
            >
              {t("Verify")}
            </Button>
          </>
        ) : (
          <Typography align="center" fontSize={{ xs: "14px", sm: "16px" }} fontWeight={600}>
            {t("Camera unavailable")}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default FaceIdScanner;
