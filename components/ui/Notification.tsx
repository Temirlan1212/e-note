import { Alert, Slide, Snackbar, SnackbarProps } from "@mui/material";
import useNotificationStore from "@/stores/notification";
import { TransitionProps } from "@mui/material/transitions";

export interface INotificationProps extends SnackbarProps {
  title: string;
  severity?: "error" | "warning" | "info" | "success";
  variant?: "filled" | "outlined" | "standard";
  onClose?: () => void;
}

const SlideTransition = (props: TransitionProps) => <Slide {...props} direction="down" />;

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
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      anchorOrigin={anchorOrigin}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      {...rest}
    >
      <Alert severity={severity} variant={variant} onClose={onClose}>
        {title}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
