import { create } from "zustand";

interface INotificationState {
  open: boolean;
  notification: string;
  setNotification: (notification: string) => void;
  setOpenNotification: (open: boolean) => void;
}

const useNotificationStore = create<INotificationState>((set) => ({
  open: false,
  notification: null,
  setNotification: (notification) => set({ notification }),
  setOpenNotification: (open) => set({ open }),
}));

export default useNotificationStore;
