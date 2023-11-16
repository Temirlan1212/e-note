import { useTranslations } from "next-intl";
import { Box, CircularProgress, Divider, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import { ConfirmationModal, IConfirmationModal } from "@/components/ui/ConfirmationModal";
import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import Webcam from "@/components/ui/Webcam";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/router";
import Button from "@/components/ui/Button";

export default function DeclVideoRecordModal(props: Partial<IConfirmationModal & { onFinish: () => void }>) {
  const t = useTranslations();
  const router = useRouter();
  const { id: applicationId } = router.query as { id: string | null };
  const { update, loading } = useFetch("", "POST");
  const [users, setUsers] = useState<Record<string, any>[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [files, setFiles] = useState<{ fileName: string; id: number }[]>([]);

  const handleGoBack = () => {
    if (!showVideo) {
      setUserId(null);
    }
    setShowVideo(false);
  };

  useEffectOnce(async () => {
    handleDeclList();
  });

  const handleDeclList = async () => {
    if (applicationId == null) return;
    const res = await update(`/api/applications/${applicationId}`);
    const application = res?.data?.[0];
    const users: Record<string, any>[] = [];

    if (Array.isArray(application?.requester)) users.push(...application.requester);
    if (Array.isArray(application?.members)) users.push(...application.members);
    if (application?.files?.length > 0) setFiles(application.files);

    setUsers(users);
  };

  const isUserSelected = userId != null;

  const getLastFileId = (id: number | null) => {
    return files.length > 0 ? files.findLast((item) => item.fileName.includes(String(id)))?.id ?? null : null;
  };

  if (applicationId == null) return;

  return (
    <ConfirmationModal
      title="Video recording"
      type="hint"
      hintTitle=""
      hintText={
        !isUserSelected
          ? "To record a video, select a participant"
          : "The maximum amount of video recording time is 30 seconds"
      }
      {...props}
      slots={{
        body: () => (
          <Box sx={{ maxHeight: { xs: "300px", md: "unset" }, overflowY: { xs: "scroll", md: "unset" } }}>
            {loading && (
              <Box height={250}>
                <CircularProgress sx={{ margin: "10px auto", display: "flex" }} />
              </Box>
            )}

            {!isUserSelected && !loading ? (
              <List sx={{ width: "100%", bgcolor: "background.paper", maxHeight: 300, overflow: "auto" }}>
                {users.length > 0
                  ? users.map((item, index) => (
                      <Fragment key={index}>
                        <ListItem
                          alignItems="flex-start"
                          sx={{ "&:hover": { background: "rgba(0, 0, 0, 0.1)", cursor: "pointer" } }}
                          onClick={() => {
                            setUserId(item?.id ? item.id : null);
                          }}
                        >
                          <ListItemText
                            primary={`${item?.lastName} ${item?.firstName}`}
                            secondary={
                              <>
                                {!!item?.personalNumber && (
                                  <Typography
                                    sx={{ display: "inline" }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {item.personalNumber}
                                  </Typography>
                                )}
                                {getLastFileId(item?.id ? item.id : null) != null && (
                                  <Typography
                                    sx={{ display: "block" }}
                                    component="span"
                                    variant="body2"
                                    color="text.damger"
                                  >
                                    {t("Video recorded")}
                                  </Typography>
                                )}
                              </>
                            }
                          />
                        </ListItem>
                        <Divider component="li" />
                      </Fragment>
                    ))
                  : null}
              </List>
            ) : null}

            {isUserSelected && !loading ? (
              <Box>
                <IconButton sx={{ marginBottom: "15px" }} onClick={handleGoBack}>
                  <KeyboardBackspaceIcon />
                </IconButton>
                <VideoUpload
                  onUpload={handleDeclList}
                  userId={userId}
                  fileId={getLastFileId(userId)}
                  applicationId={applicationId}
                />
              </Box>
            ) : null}
          </Box>
        ),
        button: () => (isUserSelected ? null : <Button onClick={props.onFinish}>{t("Done")}</Button>),
      }}
    >
      <></>
    </ConfirmationModal>
  );
}

const VideoUpload = ({
  userId,
  fileId,
  applicationId,
  onUpload,
}: {
  applicationId: string;
  userId: number;
  fileId: number | null;
  onUpload: () => Promise<void>;
}) => {
  const t = useTranslations();
  const [blobURL, setBlobURL] = useState<string>("");

  const { update: downloadUpdate } = useFetch<Response>("", "GET", {
    returnResponse: true,
  });
  const { update, loading } = useFetch("", "POST");

  const handleUpload = async (
    recordedChunks: BlobPart[],
    setAlertOpen: Dispatch<SetStateAction<boolean>>,
    setChunks: Dispatch<SetStateAction<BlobPart[]>>
  ) => {
    if (applicationId == null || userId == null) return;
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const formData = new FormData();
      formData.append("file", blob);
      await update(`/api/applications/video-upload?saleOrderId=${applicationId}&partnerId=${userId}`, formData).then(
        async (res) => {
          if (res?.status === -1) {
            setAlertOpen(true);
          } else {
            await onUpload();
            setChunks([]);
            if (fileId != null) handleDownload(fileId);
          }
        }
      );
    }
  };

  const handleDownload = async (id: number) => {
    if (id != null) {
      const res = await downloadUpdate(`/api/files/download/${id ?? 0}`);
      const blobData = await res.blob();
      setBlobURL(URL.createObjectURL(blobData));
    }
  };

  useEffectOnce(async () => {
    if (fileId != null) handleDownload(fileId);
  }, []);

  return (
    <>
      <Webcam
        videoBitsPerSecond={0}
        muted={true}
        variant={{ type: "record", blobUrl: !!blobURL ? blobURL : null }}
        audio={true}
        maxCaptureTime={30000}
        slots={{
          footer: ({ restart, chunks, setAlert, setChunks }) => {
            if (setAlert == null || setChunks == null || restart == null) return <></>;
            const isVideoRecorded = !!(chunks != null && chunks?.length > 0);

            return (
              <>
                <Box display="flex" justifyContent="space-between" gap="15px">
                  {isVideoRecorded && (
                    <Button
                      sx={{
                        fontSize: { xs: "14px", sm: "16px" },
                      }}
                      buttonType="primary"
                      loading={loading}
                      onClick={() => handleUpload(chunks, setAlert, setChunks)}
                    >
                      {t("Upload")}
                    </Button>
                  )}

                  {isVideoRecorded ||
                    (!!blobURL && (
                      <Button
                        sx={{
                          fontSize: { xs: "14px", sm: "16px" },
                        }}
                        buttonType="danger"
                        onClick={() => {
                          restart();
                          setBlobURL("");
                        }}
                      >
                        {t("Re-record")}
                      </Button>
                    ))}
                </Box>
              </>
            );
          },
        }}
      />
    </>
  );
};
