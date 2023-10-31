import { Box, IconButton, InputLabel, TextField, Tooltip, Typography } from "@mui/material";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import Link from "@/components/ui/Link";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ChatIcon from "@mui/icons-material/Chat";
import { useTranslations } from "next-intl";
import { useProfileStore } from "@/stores/profile";
import { IUserData } from "@/models/user";
import useEffectOnce from "@/hooks/useEffectOnce";
import Button from "@/components/ui/Button";
import { IFetchByIdData, IFetchNotaryChat } from "@/models/chat";
import CancelIcon from "@mui/icons-material/Cancel";
import Input from "@/components/ui/Input";

export const ApplicationListActions = ({
  params,
  onDelete,
}: {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
  onDelete: () => void;
}) => {
  const t = useTranslations();
  const [openModal, setOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [inputError, setInputError] = useState<boolean>(false);
  const [userData, setUserData] = useState<IUserData | null>();
  const profile = useProfileStore((state) => state);

  const { data, update: createChat } = useFetch<IFetchNotaryChat>("", "POST");
  const { data: userById, update: getUser } = useFetch<IFetchByIdData>("", "POST");
  const { update } = useFetch<Response>("", "DELETE", {
    returnResponse: true,
  });
  const { update: getPdf } = useFetch<Response>("", "GET", { returnResponse: true });
  const { update: downloadUpdate } = useFetch<FetchResponseBody | null>("", "POST");
  const { update: cancelUpdate } = useFetch<FetchResponseBody | null>("", "PUT");

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

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName || "document.pdf";
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
    getUser("/api/chat/user/" + params.id);
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
    if (params.row.id != null && inputValue) {
      await cancelUpdate("/api/applications/update/" + params.row.id, {
        id: params.row.id,
        version: params.row.version,
        statusSelect: 3,
        notaryReliabilityStatus: "3",
        cancelReasonStr: inputValue,
      });
      callback(false);
      onDelete();
    }
    setInputError(true);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value) {
      setInputError(false);
    }
  };

  useEffectOnce(() => {
    setUserData(profile.userData);
  }, [profile.userData]);

  return (
    <Box display="flex" alignItems="center">
      {userData?.group.id === 4 && (
        <ConfirmationModal
          title="Write a message"
          isHintShown={false}
          slots={{
            body: () => (
              <Box display="flex" flexDirection="column" gap="20px">
                {userById?.data[0].requester.find((item) => !item.user) ? (
                  <Typography fontSize={14} color="text.primary">
                    {t("User unavailable")}
                  </Typography>
                ) : (
                  userById?.data[0].requester.map((item) => {
                    const handleCreateChat = () => {
                      if (item.user) {
                        createChat("/api/chat/create/notary/" + item.user?.id);
                      }
                    };
                    return (
                      <Button
                        key={item.id}
                        variant="contained"
                        buttonType="secondary"
                        sx={{ fontSize: "14px" }}
                        onClick={handleCreateChat}
                      >
                        {item.user?.fullName}
                      </Button>
                    );
                  })
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

      {params.row.statusSelect != 1 && (
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
        </>
      )}

      {params.row.statusSelect != 3 && (
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
                    value={inputValue}
                    onChange={handleSearchChange}
                    inputType={inputError ? "error" : "secondary"}
                    helperText={inputError && t("This field is required!")}
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
        </>
      )}
    </Box>
  );
};
