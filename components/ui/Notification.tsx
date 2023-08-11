import { Alert, Snackbar } from "@mui/material";
import useNotificationStore from "@/stores/notification";

const Notification = () => {
  const notification = useNotificationStore((state) => state.notification);
  return (
    <Snackbar open={!!notification} autoHideDuration={3000} anchorOrigin={{ horizontal: "right", vertical: "top" }}>
      <Alert severity="error" variant="filled">
        {notification}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
