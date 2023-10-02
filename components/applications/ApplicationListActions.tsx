import { Box, IconButton, Tooltip } from "@mui/material";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import Link from "@/components/ui/Link";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ChatIcon from "@mui/icons-material/Chat";
import { useTranslations } from "next-intl";
import { useProfileStore } from "@/stores/profile";
import { IUserData } from "@/models/user";
import useEffectOnce from "@/hooks/useEffectOnce";

export const ApplicationListActions = ({
  params,
  onDelete,
}: {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
  onDelete: () => void;
}) => {
  const t = useTranslations();
  const [userData, setUserData] = useState<IUserData | null>();
  const profile = useProfileStore((state) => state);

  const { data, update: createChat } = useFetch("", "POST");
  const { update: getUser } = useFetch("", "POST");
  const { update } = useFetch<Response>("", "DELETE", {
    returnResponse: true,
  });

  const handleCreateChat = () => {
    const user = getUser("/api/chat/user/" + params.id);
    user.then((res) => {
      if (res?.data[0]?.requester[0]?.user) {
        createChat("/api/chat/create/notary/" + res?.data[0]?.requester[0]?.user?.id);
      }
    });
  };

  useEffect(() => {
    if (data?.data?.chatRoomLink) {
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

  useEffectOnce(() => {
    setUserData(profile.userData);
  }, [profile.userData]);

  return (
    <Box display="flex" alignItems="center">
      {userData?.group.id === 4 && (
        <Tooltip title={t("More detailed")} arrow>
          <IconButton onClick={handleCreateChat}>
            <ChatIcon />
          </IconButton>
        </Tooltip>
      )}

      <Link href={`/applications/status/${params.row.id}`}>
        <Tooltip title={t("More detailed")} arrow>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </Link>

      <Link href="applications/">
        <Tooltip title={t("Download")} arrow>
          <IconButton>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Link>

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
    </Box>
  );
};
