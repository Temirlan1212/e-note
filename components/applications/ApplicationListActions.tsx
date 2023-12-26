import { Box, CircularProgress, IconButton, InputLabel, Modal, TextField, Tooltip, Typography } from "@mui/material";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import Link from "@/components/ui/Link";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ChatIcon from "@mui/icons-material/Chat";
import { useTranslations } from "next-intl";
import { useProfileStore } from "@/stores/profile";
import { IUserData } from "@/models/user";
import useEffectOnce from "@/hooks/useEffectOnce";
import Button from "@/components/ui/Button";
import { IChatUser, IFetchByIdData, IFetchNotaryChat, IRequester, IUser } from "@/models/chat";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyIcon from "@mui/icons-material/Key";
import BlockIcon from "@mui/icons-material/Block";
import Input from "@/components/ui/Input";
import { useRouter } from "next/router";
import { format } from "date-fns";

export const ApplicationListActions = ({
  params,
  onDelete,
}: {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
  onDelete: () => void;
}) => {
  const router = useRouter();
  const t = useTranslations();
  const [openModal, setOpenModal] = useState(false);
  const [signModal, setSignModal] = useState(false);
  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [annulmentReason, setAnnulmentReason] = useState<string | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [userData, setUserData] = useState<IUserData | null>();
  const profile = useProfileStore((state) => state);

  const { data, update: createChat } = useFetch<IFetchNotaryChat>("", "POST");
  const { update: getUser } = useFetch<IFetchByIdData>("", "POST");
  const { update: getChatUsers } = useFetch<IChatUser>("", "POST");
  const { update } = useFetch<Response>("", "DELETE", {
    returnResponse: true,
  });
  const { update: getPdf } = useFetch<Response>("", "GET", { returnResponse: true });
  const { update: downloadUpdate } = useFetch<FetchResponseBody | null>("", "POST");
  const { update: cancelUpdate } = useFetch<FetchResponseBody | null>("", "PUT");
  const { update: getCopy } = useFetch<IFetchByIdData>("", "GET");
  const { data: copyData, update: updateCopyData } = useFetch("", "POST");
  const { update: getApplication, loading: applicationLoading } = useFetch("", "POST");

  const handleDownloadClick = async () => {
    const pdfResponse = await downloadUpdate(`/api/applications/download/${params.row.id}`);
    handlePdfDownload(
      pdfResponse?.data[0]?.documentInfo?.pdfLink,
      pdfResponse?.data[0]?.documentInfo?.token,
      pdfResponse?.data[0]?.documentInfo?.name
    );
  };

  const handlePdfDownload = async (pdfLink: string, token: string, fileName: string) => {
    if (!pdfLink || !token) return;

    const response = await getPdf(`/api/adapter?url=${pdfLink}&token=${token}`);
    const blob = await response?.blob();
    if (blob == null) return;

    const formattedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const formattedFileName = `${fileName} ${formattedDate}`;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = formattedFileName || "document.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleToggle = () => {
    setOpenModal(!openModal);
  };

  const handleFetchId = () => {
    handleToggle();
    getUser("/api/chat/user/" + params.id).then((res) => {
      const user = res?.data?.[0];
      const users: IRequester[] = [];

      if (user?.requester) users.push(...user?.requester);
      if (user?.members) users.push(...user?.members);

      const userPromises = users.map((user) => {
        return getChatUsers("/api/user/search", {
          pin: user.personalNumber,
        });
      });

      Promise.all(userPromises).then((results) => {
        const chatUsers = results
          .flatMap((res) => res.data ?? [])
          .reduce((uniqueUsers, user) => {
            const uniqueUserSet = new Set(uniqueUsers.map((u: IUser) => u.id));
            if (!uniqueUserSet.has(user.id)) {
              uniqueUsers.push(user);
            }

            return uniqueUsers;
          }, []);

        setUsers(chatUsers);
      });
    });
  };

  useEffect(() => {
    if (data?.data?.chatRoomLink && data?.data?.userToken) {
      const href = `${data.data.chatRoomLink}?AuthorizationBasic=${data.data.userToken.replace(
        /Basic /,
        ""
      )}` as string;
      window.open(href, "_blank");
    }
  }, [data]);

  const handleDeleteClick = async (callback: Dispatch<SetStateAction<boolean>>) => {
    if (params.row.id != null) {
      await update("/api/applications/delete/" + params.row.id + "?version=" + params.row.version);
      callback(false);
      onDelete();
    }
  };

  const handleCancelClick = async (callback: Dispatch<SetStateAction<boolean>>) => {
    if (params.row.id != null && cancelReason) {
      await cancelUpdate("/api/applications/update/" + params.row.id, {
        id: params.row.id,
        version: params.row.version,
        statusSelect: 3,
        notaryReliabilityStatus: "3",
        notaryCancelledDate: new Date().toISOString(),
        cancelReasonStr: cancelReason,
      });
      callback(false);
      onDelete();
    }
    setCancelReason("");
  };

  const handleAnnulClick = async (callback: Dispatch<SetStateAction<boolean>>) => {
    if (params.row.id != null && annulmentReason) {
      await cancelUpdate("/api/applications/update/" + params.row.id, {
        id: params.row.id,
        version: params.row.version,
        statusSelect: 4,
        notaryReliabilityStatus: "4",
        notaryAnnulmentDate: new Date().toISOString(),
        notaryAnnulmentReason: annulmentReason,
      }).then(() =>
        getCopy("/api/applications/copy/" + params.row.id).then((res) => {
          updateCopyData("/api/applications/copy/update", {
            data: {
              ...res?.data[0],
              statusSelect: 2,
              notarySignatureStatus: 2,
              notaryReliabilityStatus: 2,
              orderNumber: params.row.notaryUniqNumber,
              notaryDateHandWritten: null,
              notaryUniqNumber: null,
              notaryAnnulmentDate: null,
              notaryAnnulmentReason: null,
              isToPrintLineSubTotal: true,
              documentInfo: null,
            },
          });
        })
      );
      callback(false);
    }
    setAnnulmentReason("");
  };

  useEffectOnce(() => {
    setUserData(profile.userData);
  }, [profile.userData]);

  const handleCopy = async () => {
    await getCopy("/api/applications/copy/" + params.row.id).then((res) => {
      updateCopyData("/api/applications/copy/update", {
        data: {
          ...res?.data[0],
          statusSelect: 2,
          notarySignatureStatus: 2,
          notaryReliabilityStatus: 2,
          notaryDateHandWritten: null,
          notaryAnnulmentDate: null,
          notaryAnnulmentReason: null,
          notaryUniqNumber: null,
          isToPrintLineSubTotal: true,
          documentInfo: null,
        },
      });
    });
  };

  useEffect(() => {
    if (copyData?.data[0]?.id) {
      router.push(`/applications/edit/${copyData?.data[0]?.id}`);
    }
  }, [copyData?.data[0]?.id]);

  const hanldeSignAction = async (id: number, e: Event) => {
    e.stopPropagation();
    const res = await getApplication(`/api/applications/${id}`);
    const pdfLink = res?.data?.[0]?.documentInfo?.pdfLink;

    if (!!pdfLink) {
      router.push({ pathname: `/applications/edit/${id}`, query: { step: 5 } });
    } else {
      setSignModal(true);
    }
  };

  const isNotary = userData?.group.id === 4;

  return (
    <Box display="flex" alignItems="center">
      {isNotary && (
        <Tooltip title={t("Copy")} arrow>
          <IconButton onClick={handleCopy}>
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
      )}
      {isNotary && (
        <ConfirmationModal
          title="Write a message"
          isHintShown={false}
          slots={{
            body: () => (
              <Box display="flex" flexDirection="column" gap="20px">
                {users.length > 0 ? (
                  users?.map((chatUser) => {
                    const handleCreateChat = async () => {
                      if (chatUser?.id) {
                        await createChat("/api/chat/create/notary/" + chatUser.id);
                      }
                    };
                    return (
                      <Button
                        key={chatUser.id}
                        variant="contained"
                        buttonType="secondary"
                        sx={{ fontSize: "14px" }}
                        onClick={handleCreateChat}
                      >
                        {chatUser["partner.fullName"]}
                      </Button>
                    );
                  })
                ) : (
                  <Typography fontSize={14} color="text.primary">
                    {t("User unavailable")}
                  </Typography>
                )}
              </Box>
            ),
            button: () => <></>,
          }}
        >
          <Tooltip title={t("Write a message")} arrow>
            <IconButton onClick={handleFetchId}>
              <ChatIcon />
            </IconButton>
          </Tooltip>
        </ConfirmationModal>
      )}

      <Link href={`/applications/status/${params.row.id}`}>
        <Tooltip title={t("More detailed")} arrow>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </Link>

      <Tooltip title={t("Download")} arrow>
        <IconButton onClick={handleDownloadClick}>
          <DownloadIcon />
        </IconButton>
      </Tooltip>

      {params.row.statusSelect === 2 && (
        <>
          <Link href={`/applications/edit/${params.row.id}`}>
            <Tooltip title={t("Edit")} arrow>
              <IconButton>
                <ModeEditIcon />
              </IconButton>
            </Tooltip>
          </Link>

          <ConfirmationModal
            hintTitle="Do you really want to remove the application from the platform?"
            title="Deleting an application"
            onConfirm={(callback) => handleDeleteClick(callback)}
          >
            <Tooltip title={t("Delete")} arrow>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </ConfirmationModal>
          {isNotary && (
            <ConfirmationModal
              isPermanentOpen={signModal}
              onClose={() => setSignModal(false)}
              isHintShown={false}
              title=""
              onConfirm={(callback) => handleDeleteClick(callback)}
              slots={{
                button: () => <Button onClick={() => setSignModal(false)}>{t("Close")}</Button>,
                body: () => <>{t("The notarial action has not been prepared for signing")}</>,
              }}
            >
              <Box onClick={(e: any) => hanldeSignAction(params.row.id, e)}>
                <Tooltip title={t("Sign")} arrow>
                  <IconButton>
                    {applicationLoading ? (
                      <CircularProgress sx={{ height: "20px !important", width: "20px !important" }} />
                    ) : (
                      <KeyIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </ConfirmationModal>
          )}
        </>
      )}

      {params.row.statusSelect === 1 && (
        <>
          <ConfirmationModal
            hintTitle="Do you really want to cancel the application?"
            title="Canceling an application"
            onConfirm={(callback) => handleCancelClick(callback)}
            slots={{
              body: () => (
                <Box sx={{ marginBottom: "20px" }}>
                  <InputLabel>{t("Enter a reason")}</InputLabel>
                  <Input
                    onChange={(e) => setCancelReason(e.target.value)}
                    inputType={cancelReason === "" ? "error" : "secondary"}
                    helperText={cancelReason === "" && t("This field is required!")}
                  />
                </Box>
              ),
            }}
          >
            <Tooltip title={t("Cancel")} arrow>
              <IconButton>
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </ConfirmationModal>

          <ConfirmationModal
            hintTitle="Do you really want to annul the application?"
            title="Annulling an application"
            onConfirm={(callback) => handleAnnulClick(callback)}
            slots={{
              body: () => (
                <Box sx={{ marginBottom: "20px" }}>
                  <InputLabel>{t("Enter a reason")}</InputLabel>
                  <Input
                    onChange={(e) => setAnnulmentReason(e.target.value)}
                    inputType={annulmentReason === "" ? "error" : "secondary"}
                    helperText={annulmentReason === "" && t("This field is required!")}
                  />
                </Box>
              ),
            }}
          >
            <Tooltip title={t("Annul")} arrow>
              <IconButton>
                <BlockIcon />
              </IconButton>
            </Tooltip>
          </ConfirmationModal>
        </>
      )}
    </Box>
  );
};
