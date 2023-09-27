import { INotaryInfoData } from "@/models/notaries";
import { create } from "zustand";

interface INotariesState {
  notaryData: INotaryInfoData | null;
  setNotaryData: (notary: INotaryInfoData | null) => void;
}

const useNotariesStore = create<INotariesState>((set) => ({
  notaryData: null,
  setNotaryData: (notaryData) => set({ notaryData }),
}));

export default useNotariesStore;
