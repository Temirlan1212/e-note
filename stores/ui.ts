import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  pathname: string | null;
  paginationCurrentPages: Record<string, number> | null;
  setValue: (field: keyof UiState, value: any) => void;
}

const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      pathname: null,
      paginationCurrentPages: null,
      setValue: (key, value) => set({ ...get(), [key]: value }),
    }),
    {
      name: "ui",
    }
  )
);

export default useUiStore;
