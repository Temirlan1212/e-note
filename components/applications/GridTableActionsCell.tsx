import { Box } from "@mui/material";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DetailsIcon from "@/public/icons/details-action.svg";
import DownloadIcon from "@/public/icons/download-action.svg";
import EditIcon from "@/public/icons/edit-action.svg";

export const GridTableActionsCell = ({
  params,
}: {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
}) => {
  return (
    <Box display="flex" alignItems="center" gap="10px">
      <Box>
        <DetailsIcon />
      </Box>
      <Box>
        <EditIcon />
      </Box>
      <Box>
        <DownloadIcon />
      </Box>
      <Box>
        <DeleteOutlineIcon />
      </Box>
    </Box>
  );
};
