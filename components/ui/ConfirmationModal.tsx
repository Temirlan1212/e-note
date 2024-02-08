import { Box, IconButton, ModalProps, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from "@/components/ui/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@/components/ui/Button";
import Hint from "@/components/ui/Hint";
import { useTranslations } from "next-intl";

export interface IConfirmationModal extends Omit<ModalProps, "slots"> {
  onConfirm: (callback: Dispatch<SetStateAction<boolean>>) => void;
  onToggle: (callback: Dispatch<SetStateAction<boolean>>) => void;
  handleReject?: () => void;
  confirmButtonText?: string;
  rejectButtonText?: string;
  isPermanentOpen?: boolean;
  confirmLoading?: boolean;
  isHintShown?: boolean;
  hintTitle: string;
  hintText: string;
  type: "warning" | "error" | "hint";
  title: string;
  confirmButtonType: "primary" | "secondary" | "danger" | "warning";
  isCloseIconShown: boolean;
  slots?: {
    button?: (callback: Dispatch<SetStateAction<boolean>>) => React.ReactNode;
    body?: (callback: Dispatch<SetStateAction<boolean>>) => React.ReactNode;
  };
}

export const ConfirmationModal = ({
  onConfirm,
  slots,
  children,
  handleReject,
  confirmLoading,
  isPermanentOpen,
  confirmButtonType,
  confirmButtonText = "Yes",
  rejectButtonText = "No",
  isHintShown = true,
  hintTitle = "Do you really want to delete this record?",
  hintText = "",
  type = "error",
  title = "Deleting the record",
  isCloseIconShown = false,
  onToggle,
  ...rest
}: Partial<IConfirmationModal>) => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    !onConfirm && setOpen(false);
    onConfirm && onConfirm(setOpen);
  };

  const handleRejectClick = () => {
    handleReject && handleReject();
  };

  const handleToggle = () => {
    setOpen(!open);
    onToggle && onToggle(setOpen);
  };

  return (
    <Box>
      <Box onClick={handleToggle}>{children}</Box>

      <Modal open={isPermanentOpen ?? open} onClose={handleToggle} {...rest}>
        <Box display="flex" flexDirection="column" gap="20px">
          {(!!title || !!isCloseIconShown) && (
            <Box component="header" display="flex" alignItems="center" justifyContent="space-between">
              {!!title && (
                <Typography variant="h6" fontWeight={600}>
                  {t(title)}
                </Typography>
              )}
              {isCloseIconShown && (
                <IconButton onClick={handleToggle}>
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          )}

          <Box display="flex" flexDirection="column" gap="10px">
            {isHintShown && (
              <Hint type={type} sx={{ mb: "20px", display: "flex", gap: "10px" }}>
                {hintTitle && (
                  <Typography fontSize={16} fontWeight={600} color="text.primary">
                    {t(hintTitle)}
                  </Typography>
                )}

                {hintText && (
                  <Typography fontSize={14} color="text.primary">
                    {t(hintText)}
                  </Typography>
                )}
              </Hint>
            )}

            {slots?.body && <Box>{slots.body(setOpen)}</Box>}

            <Box display="flex" gap="20px">
              {slots?.button ? (
                slots.button(setOpen)
              ) : (
                <>
                  <Button
                    buttonType={confirmButtonType ? confirmButtonType : type === "warning" ? "warning" : "danger"}
                    onClick={handleConfirm}
                    loading={confirmLoading}
                  >
                    {t(confirmButtonText)}
                  </Button>
                  <Button
                    buttonType="secondary"
                    onClick={() => {
                      handleToggle();
                      handleReject && handleRejectClick();
                    }}
                  >
                    {t(rejectButtonText)}
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
