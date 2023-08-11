import { Alert, Snackbar, SnackbarProps } from "@mui/material";
import useNotificationStore from "@/stores/notification";

export interface INotificationProps extends SnackbarProps {
  title: string | null;
  severity?: "error" | "warning" | "info" | "success";
  variant?: "filled" | "outlined" | "standard";
  onClose?: () => void;
}

const Notification = ({
  title,
  autoHideDuration = 3000,
  onClose,
  open,
  severity,
  variant,
  anchorOrigin,
  ...rest
}: INotificationProps) => {
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} anchorOrigin={anchorOrigin} onClose={onClose} {...rest}>
      <Alert severity={severity} variant={variant} onClose={onClose}>
        {title}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
