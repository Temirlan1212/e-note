import { Box, IconButton } from "@mui/material";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import DetailsIcon from "@/public/icons/details-action.svg";
import DownloadIcon from "@/public/icons/download-action.svg";
import EditIcon from "@/public/icons/edit-action.svg";

import Link from "@/components/ui/Link";
import { ConfirmationModal } from "../ui/ConfirmationModal";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Dispatch, SetStateAction, useEffect } from "react";
import useFetch from "@/hooks/useFetch";

export const GridTableActionsCell = ({
  params,
  updateList,
}: {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
  updateList: () => void;
}) => {
  const { update } = useFetch<Response>("/api/applications/delete?id=", "DELETE", {
    useEffectOnce: false,
    returnResponse: true,
  });

  const handleDeleteClick = async (callback: Dispatch<SetStateAction<boolean>>) => {
    if (params.row.id != null) {
      await update("/api/applications/delete?id=" + params.row.id);
      callback(false);
      updateList();
    }
  };

  return (
    <Box display="flex" alignItems="center" gap="10px">
      <Link href="applications">
        <IconButton sx={{ color: "text.primary" }}>
          <DetailsIcon />
        </IconButton>
      </Link>

      <Link href={"applications"}>
        <IconButton sx={{ color: "text.primary" }}>
          <EditIcon />
        </IconButton>
      </Link>

      <Link href="applications/">
        <IconButton sx={{ color: "text.primary" }}>
          <DownloadIcon />
        </IconButton>
      </Link>

      <ConfirmationModal onConfirm={(callback) => handleDeleteClick(callback)}>
        <IconButton sx={{ color: "text.primary" }}>
          <DeleteOutlineIcon />
        </IconButton>
      </ConfirmationModal>
    </Box>
  );
};
