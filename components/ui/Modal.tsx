import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import MUIModal, { ModalProps } from "@mui/material/Modal";

const contentStyle: SxProps<Theme> = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 320, sm: 450, md: 500, lg: 530, xl: 550 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 1.5, sm: 4 },
  outline: "none",
};

interface IModalProps extends ModalProps {}

export default function Modal({ children, ...rest }: IModalProps) {
  return (
    <MUIModal aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" {...rest}>
      <Box sx={contentStyle}>{children}</Box>
    </MUIModal>
  );
}
