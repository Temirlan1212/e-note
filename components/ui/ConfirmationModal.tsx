import { Box, IconButton, ModalProps, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from "@/components/ui/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@/components/ui/Button";
import Hint from "@/components/ui/Hint";
import { useTranslations } from "next-intl";

export interface IConfirmationModal extends ModalProps {
  onConfirm: (callback: Dispatch<SetStateAction<boolean>>) => void;
  hintTitle: string;
  hintText: string;
  hintType: "success" | "error" | "hint";
  confirmButtonType: "primary" | "secondary" | "danger";
  cancelButtonType: "primary" | "secondary" | "danger";
  title: string;
}

export const ConfirmationModal = ({
  onConfirm,
  children,
  hintTitle = "Do you really want to delete this entry?",
  hintText = "",
  hintType = "error",
  confirmButtonType = "danger",
  cancelButtonType = "secondary",
  title = "Deleting an entry",
  ...rest
}: Partial<IConfirmationModal>) => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    !onConfirm && setOpen(false);
    onConfirm && onConfirm(setOpen);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Box onClick={handleOpen}>{children}</Box>

      <Modal open={open} onClose={handleClose} {...rest}>
        <Box display="flex" flexDirection="column" gap="20px">
          <Box component="header" display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              {t(title)}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box>
            <Hint type={hintType} sx={{ mb: "20px" }}>
              <Typography fontSize={16} fontWeight={600} color="text.primary">
                {t(hintTitle)}
              </Typography>

              {hintText && (
                <Typography fontSize={14} color="text.primary" marginTop="10px">
                  {t(hintText)}
                </Typography>
              )}
            </Hint>

            <Box display="flex" gap="20px">
              <Button buttonType={confirmButtonType} onClick={handleConfirm}>
                {t("Yes")}
              </Button>
              <Button buttonType={cancelButtonType} onClick={handleClose}>
                {t("No")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
