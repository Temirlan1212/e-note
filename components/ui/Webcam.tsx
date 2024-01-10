import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import ReactWebcam, { WebcamProps } from "react-webcam";
import { Alert, Box, Collapse, Icon, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import useEffectOnce from "@/hooks/useEffectOnce";
import Button from "@/components/ui/Button";

interface IButtonSlotProps extends Partial<IOnRecordStop> {
  start: () => void;
  stop: () => void;
  restart?: () => void;
  capturing: boolean;
}

interface IOnRecordStop {
  chunks: BlobPart[];
  setAlert: Dispatch<SetStateAction<boolean>>;
  setChunks: Dispatch<SetStateAction<BlobPart[]>>;
}

interface IWebcamProps extends Partial<WebcamProps> {
  onStop?: (args: IOnRecordStop) => void;
  videoBitsPerSecond?: number;
  maxCaptureTime?: number;
  alertText?: string;
  variant?:
    | {
        type: "live";
      }
    | {
        type: "record" | "preview";
        blobUrl: string | null;
      };
  slots?: {
    body?: (arg: IButtonSlotProps) => React.ReactNode;
    footer?: (arg: IButtonSlotProps) => React.ReactNode;
  };
}

const Webcam: FC<IWebcamProps> = ({
  videoBitsPerSecond = 200000,
  slots,
  maxCaptureTime = 2000,
  onStop,
  alertText = "This action failed",
  variant = { type: "live" },
  ...rest
}) => {
  const t = useTranslations();
  const webcamRef = useRef<ReactWebcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleStartCaptureClick = useCallback(() => {
    if (webcamRef.current == null) return;
    setAlertOpen(false);
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current?.stream as MediaStream, {
      mimeType: "video/webm",
      // videoBitsPerSecond,
    });
    mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
    mediaRecorderRef.current.start();

    setTimeout(() => {
      handleStopCaptureClick();
    }, maxCaptureTime);
  }, [recordedChunks, webcamRef, setCapturing, mediaRecorderRef]);

  const handleStopCaptureClick = () => {
    if (mediaRecorderRef.current == null) return console.log("media recorder didn't initialized");
    mediaRecorderRef.current.stop();
    setCapturing(false);
  };

  const handleRestartCaptureClick = () => {
    handleStopCaptureClick();
    handleStartCaptureClick();

    setRecordedChunks([]);
  };

  useEffectOnce(() => {
    if (recordedChunks.length > 0 && onStop) {
      onStop({ chunks: recordedChunks, setAlert: setAlertOpen, setChunks: setRecordedChunks });
    }
  }, [recordedChunks.length]);

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

  const isBlobUrl = (variant?.type === "record" || variant?.type === "preview") && variant?.blobUrl != null;

  return (
    <>
      <Box display="flex" flexDirection="column" gap="15px">
        <Collapse in={alertOpen}>
          <Alert severity="warning" onClose={() => setAlertOpen(false)}>
            {t(alertText)}
          </Alert>
        </Collapse>
        {isCameraAvailable ? (
          <>
            {recordedChunks?.length > 0 || isBlobUrl ? (
              <video
                src={
                  isBlobUrl
                    ? variant?.blobUrl ?? ""
                    : URL.createObjectURL(new Blob(recordedChunks, { type: "video/webm" }))
                }
                width="100%"
                height="auto"
                controls
              >
                {t("Your browser does not support the video tag")}
              </video>
            ) : null}

            {!(recordedChunks?.length > 0) && !isBlobUrl && (
              <Box sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <ReactWebcam
                  style={{ display: recordedChunks?.length > 0 && variant?.type === "record" ? "none" : "block" }}
                  width="100%"
                  height="100%"
                  videoConstraints={{ facingMode: "user" }}
                  ref={webcamRef}
                  {...rest}
                />
                {!(recordedChunks?.length > 0) && !isBlobUrl && variant?.type === "live" && (
                  <Box
                    component="img"
                    src="/images/face-id-recognition.png"
                    sx={{
                      position: "absolute",
                      top: 0,
                      width: "100%",
                    }}
                  />
                )}
              </Box>
            )}
            {slots?.body ? (
              <Box>{slots.body({ capturing, start: handleStartCaptureClick, stop: handleStopCaptureClick })}</Box>
            ) : (
              <>
                {variant?.type !== "preview" &&
                  !isBlobUrl &&
                  recordedChunks.length < 1 &&
                  variant?.type === "record" && (
                    <Button
                      endIcon={capturing ? <Countdown seconds={maxCaptureTime / 1000} /> : null}
                      sx={{
                        fontSize: { xs: "14px", sm: "16px" },
                      }}
                      buttonType={capturing ? "danger" : "secondary"}
                      onClick={capturing ? handleStopCaptureClick : handleStartCaptureClick}
                    >
                      {capturing ? t("Stop recording") : t("Start recording")}
                    </Button>
                  )}
              </>
            )}

            {slots?.footer ? (
              <Box>
                {slots.footer({
                  start: handleStartCaptureClick,
                  stop: handleStopCaptureClick,
                  restart: handleRestartCaptureClick,
                  setAlert: setAlertOpen,
                  setChunks: setRecordedChunks,
                  chunks: recordedChunks,
                  capturing,
                })}
              </Box>
            ) : null}
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

export default Webcam;

export function Countdown({ seconds = 30 }: { seconds?: number }) {
  const [timer, setTimer] = useState(seconds);
  const id = useRef<number | null>(null);
  const clear = () => (id.current != null ? window.clearInterval(id.current) : null);
  useEffectOnce(() => {
    id.current = window.setInterval(() => {
      setTimer((time) => time - 1);
    }, 1000);
    return () => clear();
  }, []);

  useEffectOnce(() => {
    if (timer === 0) {
      clear();
    }
  }, [timer]);

  return <>{timer}</>;
}
