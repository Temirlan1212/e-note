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

  // const constraints = { video: true };

  const handleStartCaptureClick = useCallback(() => {
    // navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    //   const options = {
    //     videoBitsPerSecond: 200000,
    //     mimeType: "video/webm;codecs=H264",
    //   };
    //   const mediaRecord = new MediaRecorder(stream, options);
    //   console.log(mediaRecord);
    // });
    setCapturing(true);
    const mediaRecorder = new MediaRecorder(webcamRef.current?.stream as MediaStream, {
      mimeType: "video/webm;codecs=H264",
      videoBitsPerSecond: 200000,
    });
    mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
    mediaRecorder.start();

    // console.log(MediaRecorder.isTypeSupported("video/webm;codecs=H264"));

    setTimeout(() => {
      mediaRecorder.stop();
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
