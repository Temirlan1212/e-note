import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import ReactWebcam, { WebcamProps } from "react-webcam";
import { Alert, Box, CircularProgress, Collapse, Icon, IconButton, Skeleton, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import useEffectOnce from "@/hooks/useEffectOnce";
import Button from "@/components/ui/Button";
import { IProfileState, useProfileStore } from "@/stores/profile";
import useFetch from "@/hooks/useFetch";
import Hint from "@/components/ui/Hint";

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
  loading?: boolean;
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
  loading,
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
  const [progress, setProgress] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const profile = useProfileStore<IProfileState>((state) => state);
  const profileData = profile.getUserData();

  const { data: imageData } = useFetch<Response>(
    profileData?.id != null ? "/api/profile/download-image/" + profileData?.id : "",
    "GET",
    {
      returnResponse: true,
    }
  );

  const handleStartCaptureClick = useCallback(() => {
    if (variant.type === "live") {
      setStartTimer(!startTimer);
    }
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

  const isBlobUrl = (variant?.type === "record" || variant?.type === "preview") && variant?.blobUrl != null;

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

  useEffect(() => {
    let timer: NodeJS.Timer;

    if (startTimer) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            setStartTimer(false);
            setProgress(0);
            return 0;
          } else {
            return prevProgress + 10;
          }
        });
      }, 180);
    }

    return () => {
      clearInterval(timer);
    };
  }, [startTimer]);

  useEffectOnce(async () => {
    const base64String = await imageData?.text();
    if (base64String) {
      setBase64Image(base64String);
    }
  }, [imageData]);

  if (variant.type === "live" && !base64Image) {
    return (
      <Hint
        type="warning"
        title={
          "To begin the Face ID verification process, you must submit a personal photo by setting it as your avatar in the Personal Area section of your personal account"
        }
      />
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap="10px">
      <Collapse in={alertOpen}>
        <Alert severity="error" sx={{ fontSize: "16px", fontWeight: 600 }} onClose={() => setAlertOpen(false)}>
          {t(alertText)}
        </Alert>
      </Collapse>
      {isCameraAvailable ? (
        <>
          {(variant.type === "record" && recordedChunks?.length > 0) || isBlobUrl ? (
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

          {slots?.body ? (
            <Box>{slots.body({ capturing, start: handleStartCaptureClick, stop: handleStopCaptureClick })}</Box>
          ) : (
            variant?.type !== "preview" &&
            !isBlobUrl &&
            recordedChunks.length < 1 && (
              <>
                <ReactWebcam
                  style={{ display: recordedChunks?.length > 0 && variant?.type != "live" ? "none" : "block" }}
                  width="100%"
                  height="100%"
                  videoConstraints={{ facingMode: "user" }}
                  ref={webcamRef}
                  {...rest}
                />
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
              </>
            )
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Skeleton
                variant="circular"
                sx={{ width: { xs: "320px", md: "400px" }, height: { xs: "320px", md: "400px" } }}
              />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {!(recordedChunks?.length > 0) && !isBlobUrl && variant.type === "live" && (
                <Box
                  sx={{
                    position: "relative",
                    width: { xs: "320px", md: "400px" },
                    height: { xs: "320px", md: "400px" },
                  }}
                >
                  <ReactWebcam
                    style={{
                      display: recordedChunks?.length > 0 ? "none" : "block",
                      borderRadius: "50%",
                      border: `2px solid ${alertOpen ? "#d32f2f" : "#000"}`,
                      objectFit: "cover",
                    }}
                    width="100%"
                    height="100%"
                    videoConstraints={{ facingMode: "user" }}
                    ref={webcamRef}
                    {...rest}
                  />

                  {capturing && (
                    <CircularProgress
                      color="success"
                      size="100%"
                      thickness={0.5}
                      variant="determinate"
                      value={progress}
                      sx={{ position: "absolute", top: 0, left: 0 }}
                    />
                  )}
                  {!capturing && (
                    <Box
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        background: "#000",
                        opacity: 0.5,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        transition: "opacity 0.5s",
                        "&:hover": {
                          opacity: 0,
                        },
                      }}
                      onClick={handleStartCaptureClick}
                    >
                      <Typography align="center" color="primary.contrastText" variant="h3">
                        {t("Verify")}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
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
