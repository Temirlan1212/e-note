import { Box, CircularProgress, IconButton, InputLabel, Modal, TextField, Tooltip, Typography } from "@mui/material";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import Link from "@/components/ui/Link";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
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
import VideocamIcon from "@mui/icons-material/Videocam";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import Input from "@/components/ui/Input";
import { useRouter } from "next/router";
import { format } from "date-fns";
import DeclVideoRecordModal from "../decl-video-record/DeclVideoRecordModal";
import EmblemIcon from "@/public/icons/emblem.svg";
import html2canvas from "html2canvas";

export const ApplicationListActions = ({
  params,
  onDelete,
  checkNotaryLicense,
  setAlertOpen,
}: {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
  onDelete: () => void;
  checkNotaryLicense: () => Promise<boolean>;
  setAlertOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const t = useTranslations();
  const [openModal, setOpenModal] = useState(false);
  const [signModal, setSignModal] = useState(false);
  const [annulmentReason, setAnnulmentReason] = useState<string | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [userData, setUserData] = useState<IUserData | null>();
  const [hash, setHash] = useState<string | null>(null);
  const [signTime, setSignTime] = useState<string | null>(null);
  const [editReason, setEditReason] = useState<string | null>(null);
  const [file, setFile] = useState<File | File[] | null>();
  const [fileError, setFileError] = useState<boolean>(false);
  const htmlSignRef = useRef<HTMLDivElement | null>(null);
  const profile = useProfileStore((state) => state);

  const isNotary = userData?.group?.name === "Notary";
  const isPrivateNotary = userData?.["activeCompany.typeOfNotary"] === "private";
  const isStateNotary = userData?.["activeCompany.typeOfNotary"] === "state";
  const isActiveNotary = userData?.["activeCompany.statusOfNotary"] === "active";
  const showSign = userData?.roles.some((role) => role.name === "Trainee" || role.name === "Assistant notary");

  const { data, update: createChat } = useFetch<IFetchNotaryChat>("", "POST");
  const { update: getUser } = useFetch<IFetchByIdData>("", "POST");
  const { update: getChatUsers } = useFetch<IChatUser>("", "POST");
  const { update: annulDoc, loading: annulLoading } = useFetch("", "POST");
  const { update } = useFetch<Response>("", "DELETE", {
    returnResponse: true,
  });
  const { update: getPdf } = useFetch<Response>("", "GET", { returnResponse: true });
  const { update: downloadUpdate } = useFetch<FetchResponseBody | null>("", "POST");
  const { update: cancelUpdate } = useFetch<FetchResponseBody | null>("", "PUT");
  const { update: getCopy } = useFetch<IFetchByIdData>("", "GET");
  const { update: getScan } = useFetch<Response>("", "GET", { returnResponse: true });
  const { data: copyData, update: updateCopyData } = useFetch("", "POST");
  const { update: getApplication, loading: applicationLoading } = useFetch("", "POST");
  const { update: scanDoc, loading: scannedDocLoading } = useFetch("", "POST");

  const handleDownloadClick = async () => {
    const lastScanPdf = params.row.scan[params.row.scan.length - 1];
    const pdfResponse = await downloadUpdate(`/api/applications/download/${params.row.id}`);
    handlePdfDownload(
      {
        pdfLink: pdfResponse?.data[0]?.documentInfo?.pdfLink,
        token: pdfResponse?.data[0]?.documentInfo?.token,
        fileName: pdfResponse?.data[0]?.documentInfo?.name,
      },
      lastScanPdf
    );
  };

  const handlePdfDownload = async (
    originalPdfLink: { pdfLink: string; token: string; fileName: string },
    scanPdf?: { fileName: string; id: number }
  ) => {
    const { pdfLink, token, fileName } = originalPdfLink;
    if (!pdfLink || !token) return;

    const response = scanPdf
      ? await getScan(`/api/files/download/${scanPdf.id}`)
      : await getPdf(`/api/adapter?url=${pdfLink}&token=${token}`);
    const blob = await response?.blob();
    if (blob == null) return;

    const formattedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const formattedFileName = `${fileName} ${formattedDate}`;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = scanPdf ? scanPdf.fileName : formattedFileName || "document.pdf";
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

  const handleAnnulClick = async (callback: Dispatch<SetStateAction<boolean>>) => {
    if (params.row.id != null && annulmentReason) {
      const formattedDate = format(new Date(), "dd.MM.yyyy, HH:mm:ss");
      const uniqueData = formattedDate + userData?.email;
      const hash = btoa(uniqueData);

      setHash(hash);
      setSignTime(formattedDate);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const canvas = await html2canvas(htmlSignRef.current!, {
        backgroundColor: null,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const base64String = dataUrl?.split(",")[1];

      await annulDoc("/api/files/annul/" + params.row.id, {
        hash,
        seal: base64String,
      });

      await cancelUpdate("/api/applications/update/" + params.row.id, {
        id: params.row.id,
        version: params.row.version,
        statusSelect: 4,
        notaryReliabilityStatus: "4",
        notaryAnnulmentDate: new Date().toISOString(),
        notaryAnnulmentReason: annulmentReason,
      });
      callback(false);
      onDelete();
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
          barCode: null,
          notaryDocumentSignDate: null,
          uniqueQrCode: null,
          notaryDateHandWritten: null,
          notaryAnnulmentDate: null,
          notaryAnnulmentReason: null,
          notaryUniqNumber: null,
          isToPrintLineSubTotal: true,
          documentInfo: null,
          notaryPlaceHandWritten: null,
          scan: null,
          notaryReason: null,
          notaryReasonDate: null,
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
    const license = await checkNotaryLicense();

    if (!!pdfLink) {
      if (isPrivateNotary) {
        const license = await checkNotaryLicense();
        !!license && isActiveNotary
          ? router.push({ pathname: `/applications/edit/${id}`, query: { step: 5 } })
          : setAlertOpen(true);
      } else if (isStateNotary) {
        isActiveNotary ? router.push({ pathname: `/applications/edit/${id}`, query: { step: 5 } }) : setAlertOpen(true);
      }
    } else {
      setSignModal(true);
    }
  };

  const handleEditClick = async (rowId: number) => {
    if (isNotary) {
      if (isPrivateNotary) {
        const license = await checkNotaryLicense();
        !!license && isActiveNotary ? router.push(`/applications/edit/${rowId}`) : setAlertOpen(true);
      } else if (isStateNotary) {
        isActiveNotary ? router.push(`/applications/edit/${rowId}`) : setAlertOpen(true);
      }
    } else {
      router.push(`/applications/edit/${rowId}`);
    }
  };

  const handleEditReason = async (callback: Dispatch<SetStateAction<boolean>>) => {
    if (editReason && file) {
      const formData = new FormData();
      if ("name" in file) {
        formData.append("id", String(params.id));
        formData.append("editReason", editReason);
        formData.append("fileName", file.name);
        formData.append("file", file as File);

        await scanDoc("/api/applications/edit-scan", formData);
      }
      callback(false);
      handleResetScanForm();
    }
    if (!editReason) {
      setEditReason("");
    }
    if (!file) {
      setFileError(true);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const elem = event.target;
    if (!elem.files) return;
    setFile(elem.files[0]);
    setFileError(false);
  };

  const handleResetScanForm = () => {
    setEditReason(null);
    setFile(null);
    setFileError(false);
  };

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

      <DeclVideoRecordModal applicationId={params.row.id} variant="preview">
        <Tooltip title={t("Video recordings")} arrow>
          <IconButton>
            <VideocamIcon />
          </IconButton>
        </Tooltip>
      </DeclVideoRecordModal>

      {params.row.statusSelect === 2 && (
        <>
          <Tooltip title={t("Edit")} arrow>
            <IconButton onClick={() => handleEditClick(params.row.id)}>
              <ModeEditIcon />
            </IconButton>
          </Tooltip>

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
          {isNotary && !showSign && (
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

      {isNotary && params.row.statusSelect === 1 && (
        <>
          <ConfirmationModal
            hintTitle="Do you really want to annul the application?"
            title="Annulling an application"
            confirmLoading={annulLoading}
            onConfirm={(callback) => handleAnnulClick(callback)}
            slots={{
              body: () => (
                <Box sx={{ marginBottom: "20px" }}>
                  <InputLabel>{t("Enter the reason for canceling the application")}</InputLabel>
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
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </ConfirmationModal>
        </>
      )}

      {params.row.statusSelect === 1 && (
        <ConfirmationModal
          hintTitle="Do you really want to correct the document?"
          title="Document correction"
          confirmLoading={scannedDocLoading}
          onConfirm={(callback) => handleEditReason(callback)}
          handleReject={handleResetScanForm}
          slots={{
            body: () => (
              <Box display="flex" flexDirection="column" gap="20px">
                <Box>
                  <InputLabel sx={{ whiteSpace: "pre-wrap" }}>
                    {t("Enter the reason for correcting the document")}
                  </InputLabel>
                  <Input
                    onChange={(e) => setEditReason(e.target.value)}
                    inputType={editReason === "" ? "error" : "secondary"}
                    helperText={editReason === "" && t("This field is required!")}
                  />
                </Box>
                <Box>
                  <InputLabel sx={{ whiteSpace: "pre-wrap" }}>
                    {t("Attach a scanned copy of the corrected document")}
                  </InputLabel>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    inputType={fileError ? "error" : "secondary"}
                    helperText={fileError && t("This field is required!")}
                  />
                </Box>
              </Box>
            ),
          }}
        >
          <Tooltip title={t("Document correction")} arrow>
            <IconButton>
              <DocumentScannerIcon />
            </IconButton>
          </Tooltip>
        </ConfirmationModal>
      )}

      <Box sx={{ width: 0, height: 0, overflow: "hidden" }}>
        <Box
          ref={htmlSignRef}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            width: "400px",
            border: "5px double #ff5555",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Box sx={{ width: "50px", height: "50px" }}>
              <EmblemIcon />
            </Box>
            <Box sx={{ color: "#ff5555", fontSize: "14px", fontWeight: 600, textAlign: "left" }}>
              ДОКУМЕНТ АННУЛИРОВАН
            </Box>
          </Box>
          <Box
            sx={{
              color: "#ff5555",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <Box>Дата: {signTime}</Box>
            <Box>ФИО: {userData?.partner?.fullName}</Box>
            <Box>Hash: {hash?.slice(0, 32)}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
