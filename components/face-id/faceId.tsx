import { FC, RefObject, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useProfileStore } from "@/stores/profile";
import useFetch from "@/hooks/useFetch";
import { Alert, Box, Collapse } from "@mui/material";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

interface IFaceIdScannerProps {
  getStatus: (status: boolean) => void;
}

const FaceIdScanner: FC<IFaceIdScannerProps> = ({ getStatus }) => {
  const t = useTranslations();
  const webcamRef = useRef<Webcam | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const userData = useProfileStore((state) => state.userData);

  const { update } = useFetch("", "POST");

  const videoConstraints = {
    aspectRatio: 1.8,
    facingMode: "user",
  };

  const startRecording = () => {
    setRecording(true);
    setRecordedChunks([]);

    const mediaRecorder = new MediaRecorder(webcamRef.current?.stream as MediaStream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
      }
    };

    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      update("/api/face-id/" + userData?.code, {
        file: url,
      }).then((res) => {
        if (!res?.data?.success) {
          setAlertOpen(true);
        }
        getStatus(res?.data?.success);
      });
    }, 2000);
  };

  return (
    <Box display="flex" flexDirection="column" gap="15px">
      <Collapse in={alertOpen}>
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          {t("This action failed")}
        </Alert>
      </Collapse>
      <Webcam width="100%" videoConstraints={videoConstraints} audio={false} ref={webcamRef} />

      <Button
        sx={{
          fontSize: { xs: "14px", sm: "16px" },
        }}
        buttonType="secondary"
        onClick={startRecording}
        disabled={recording}
      >
        {t("Verify")}
      </Button>
    </Box>
  );
};

export default FaceIdScanner;
