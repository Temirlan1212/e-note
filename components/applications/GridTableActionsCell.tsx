import { Box, IconButton, Typography } from "@mui/material";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DetailsIcon from "@/public/icons/details-action.svg";
import DownloadIcon from "@/public/icons/download-action.svg";
import EditIcon from "@/public/icons/edit-action.svg";
import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Button from "../ui/Button";
import { lighten } from "@mui/material/styles";
import Hint from "../ui/Hint";
import useFetch from "@/hooks/useFetch";

export const GridTableActionsCell = ({
  params,
  updateData,
}: {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
  updateData: () => void;
}) => {
  return (
    <Box display="flex" alignItems="center" gap="10px">
      <IconButton sx={{ color: "text.primary" }}>
        <DetailsIcon />
      </IconButton>
      <IconButton sx={{ color: "text.primary" }}>
        <EditIcon />
      </IconButton>
      <IconButton sx={{ color: "text.primary" }}>
        <DownloadIcon />
      </IconButton>
      <DeleteModal id={params.row.id} updateData={updateData} />
    </Box>
  );
};

export const DeleteModal = ({ id, updateData }: { id: null | number; updateData: () => void }) => {
  const url = "/api/applications/deleteApplication?id=";

  const { data, update } = useFetch<Response>(url, "DELETE", {
    headers: { "Content-Type": "application/octet-stream" },
    useEffectOnce: false,
    returnResponse: true,
  });

  const handleDeleteClick = () => {
    if (id != null) update(url + id);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    updateData();
    handleClose();
  }, [data]);

  return (
    <Box>
      <IconButton sx={{ color: "text.primary" }} onClick={handleOpen}>
        <DeleteOutlineIcon />
      </IconButton>

      <Modal open={open} onClose={handleClose}>
        <Box display="flex" flexDirection="column" gap="20px">
          <Box component="header" display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              Удаление заявки
            </Typography>
            <Button
              variant="text"
              sx={{
                display: "flex",
                width: "fit-content",
                "&:hover": { backgroundColor: lighten("#1BAA75", 0.9) },
                px: "5px",
                gap: "5px",
              }}
              onClick={handleClose}
            >
              <CloseIcon />
              <Typography variant="h6">Отменить</Typography>
            </Button>
          </Box>

          <Box>
            <Hint type="error" sx={{ mb: "20px" }}>
              <Typography fontSize={13} fontWeight={600} color="text.primary">
                Вы действительно хотите удалить пользователя с платформы?
              </Typography>
            </Hint>

            <Box display="flex" gap="20px">
              <Button buttonType="primary" onClick={handleDeleteClick}>
                Да
              </Button>
              <Button buttonType="danger" onClick={handleClose}>
                Нет
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
