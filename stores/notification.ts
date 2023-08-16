import { create } from "zustand";

interface INotificationState {
  notification: string | null;
  setNotification: (notification: string | null) => void;
}

const useNotificationStore = create<INotificationState>((set) => ({
  notification: null,
  setNotification: (notification) => set({ notification }),
}));

export default useNotificationStore;