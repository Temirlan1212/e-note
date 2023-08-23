import { Box, IconButton, Tooltip } from "@mui/material";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import Link from "@/components/ui/Link";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { Dispatch, SetStateAction } from "react";
import useFetch from "@/hooks/useFetch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useTranslations } from "next-intl";

export const ApplicationListActions = ({
  params,
  onDelete,
}: {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
  onDelete: () => void;
}) => {
  const t = useTranslations();
  const { update } = useFetch<Response>("", "DELETE", {
    returnResponse: true,
  });

  const handleDeleteClick = async (callback: Dispatch<SetStateAction<boolean>>) => {
    if (params.row.id != null) {
      await update("/api/applications/delete/" + params.row.id + "?version=" + params.row.version);
      callback(false);
      onDelete();
    }
  };

  return (
    <Box display="flex" alignItems="center" gap="10px">
      <Link href={`/applications/application-status/${params.row.id}`}>
        <Tooltip title={t("More detailed")} arrow>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </Link>

      <Link href={`/applications/edit/${params.row.id}`}>
        <Tooltip title={t("Edit")} arrow>
          <IconButton>
            <ModeEditIcon />
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
    </Box>
  );
};
