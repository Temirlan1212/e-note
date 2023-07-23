import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import MUIModal, { ModalProps } from "@mui/material/Modal";
import { useState } from "react";

const contentStyle: SxProps<Theme> = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 300, sm: 400 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 1.5, sm: 4 },
};

interface IModalProps extends ModalProps {}

export default function Modal({ children, ...rest }: IModalProps) {
  return (
    <MUIModal aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" {...rest}>
      <Box sx={contentStyle}>{children}</Box>
    </MUIModal>
  );
}
