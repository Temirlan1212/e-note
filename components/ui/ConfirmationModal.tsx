import { Box, IconButton, ModalProps, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from "@/components/ui/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@/components/ui/Button";
import Hint from "@/components/ui/Hint";
import { useTranslations } from "next-intl";

export interface IConfirmationModal extends ModalProps {
  onConfirm: (callback: Dispatch<SetStateAction<boolean>>) => void;
  onToggle: (callback: Dispatch<SetStateAction<boolean>>) => void;
  onButtonSlots: (callback: Dispatch<SetStateAction<boolean>>) => React.ReactNode;
  onBodySlots: (callback: Dispatch<SetStateAction<boolean>>) => React.ReactNode;
  hintTitle: string;
  hintText: string;
  type: "warning" | "error";
  title: string;
}

export const ConfirmationModal = ({
  onConfirm,
  onButtonSlots,
  onBodySlots,
  children,
  hintTitle = "Do you really want to delete this record?",
  hintText = "",
  type = "error",
  title = "Deleting the record",
  onToggle,
  ...rest
}: Partial<IConfirmationModal>) => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    !onConfirm && setOpen(false);
    onConfirm && onConfirm(setOpen);
  };

  const handleToggle = () => {
    setOpen(!open);
    onToggle && onToggle(setOpen);
  };

  return (
    <Box>
      <Box onClick={handleToggle}>{children}</Box>

      <Modal open={open} onClose={handleToggle} {...rest}>
        <Box display="flex" flexDirection="column" gap="20px">
          <Box component="header" display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              {t(title)}
            </Typography>
            <IconButton onClick={handleToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box>
            <Hint type={type === "warning" ? "warning" : "error"} sx={{ mb: "20px" }}>
              <Typography fontSize={16} fontWeight={600} color="text.primary">
                {t(hintTitle)}
              </Typography>

              {hintText && (
                <Typography fontSize={14} color="text.primary" marginTop="10px">
                  {t(hintText)}
                </Typography>
              )}
            </Hint>

            {onBodySlots && <Box>{onBodySlots(setOpen)}</Box>}

            <Box display="flex" gap="20px">
              {onButtonSlots ? (
                onButtonSlots(setOpen)
              ) : (
                <>
                  <Button buttonType={type === "warning" ? "warning" : "danger"} onClick={handleConfirm}>
                    {t("Yes")}
                  </Button>
                  <Button buttonType="secondary" onClick={handleToggle}>
                    {t("No")}
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
