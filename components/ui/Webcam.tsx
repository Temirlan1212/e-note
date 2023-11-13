import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import ReactWebcam, { WebcamProps } from "react-webcam";
import { Alert, Box, Collapse, Typography } from "@mui/material";
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
        type: "record";
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
      mimeType: "video/webm;codecs=H264",
      videoBitsPerSecond,
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

  if (recordedChunks.length > 0 && onStop) {
    onStop({ chunks: recordedChunks, setAlert: setAlertOpen, setChunks: setRecordedChunks });
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
            {t(alertText)}
          </Alert>
        </Collapse>
        {isCameraAvailable ? (
          <>
            {variant?.type === "record" && recordedChunks?.length > 0 ? (
              <video width="100%" height="auto" controls>
                <source
                  src={
                    variant?.blobUrl != null
                      ? variant.blobUrl
                      : URL.createObjectURL(new Blob(recordedChunks, { type: "video/webm" }))
                  }
                  type="video/webm"
                />
                {t("Your browser does not support the video tag.")}
              </video>
            ) : null}

            <ReactWebcam
              style={{ display: recordedChunks?.length > 0 && variant?.type === "record" ? "none" : "block" }}
              width="100%"
              height="200px"
              videoConstraints={{ facingMode: "user" }}
              ref={webcamRef}
              {...rest}
            />

            {slots?.body ? (
              <Box>{slots.body({ capturing, start: handleStartCaptureClick, stop: handleStopCaptureClick })}</Box>
            ) : (
              <>
                {recordedChunks.length < 1 && variant?.type === "record" && (
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

function Countdown({ seconds = 30 }: { seconds?: number }) {
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
