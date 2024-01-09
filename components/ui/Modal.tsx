import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import MUIModal, { ModalProps } from "@mui/material/Modal";

const contentStyle: SxProps<Theme> = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxHeight: "90vh",
  minWidth: { xs: 320, sm: 450, md: 500 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 1.5, sm: 4 },
  outline: "none",
  overflow: "auto",
};

interface IModalProps extends ModalProps {}

export default function Modal({ children, ...rest }: IModalProps) {
  return (
    <MUIModal aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" {...rest}>
      <Box sx={contentStyle} {...rest}>
        {children}
      </Box>
    </MUIModal>
  );
}
