import { INotary } from "@/models/notaries";
import { create } from "zustand";

interface INotariesState {
  notary: INotary | null;
  setNotary: (notary: INotary | null) => void;
}

const useNotariesStore = create<INotariesState>((set) => ({
  notary: null,
  setNotary: (notary) => set({ notary }),
}));

export default useNotariesStore;
