import { create } from "zustand";
import { persist } from "zustand/middleware";

interface INotificationState {
  notification: string | null;
  setNotification: (notification: string) => void;
  clearNotification: () => void;
}

const useNotificationStore = create<INotificationState>(
  persist(
    (set) => ({
      notification: null,
      setNotification: (notification) => set({ notification }),
      clearNotification: () => set({ notification: null }),
    }),
    {
      name: "notification-store",
    }
  )
);

export default useNotificationStore;
