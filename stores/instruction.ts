import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InstructionState {
  step: string | null;
  setValue: (field: keyof InstructionState, value: any) => void;
}

const useInstructionStore = create<InstructionState>()(
  persist(
    (set, get) => ({
      step: null,
      setValue: (key, value) => set({ ...get(), [key]: value }),
    }),
    {
      name: "instruction",
    }
  )
);

export default useInstructionStore;
