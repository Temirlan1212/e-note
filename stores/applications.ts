import { create } from "zustand";

interface IFieldState {
  name?: string;
  value?: string;
  unique?: boolean;
  message?: string;
}
interface IFormState {
  pin: IFieldState;
}

interface IApplicationsState {
  formState: IFormState;
  setFormState: (field: keyof IFormState, value: IFieldState) => void;
}

const fieldInitState = { unique: true, name: undefined, value: undefined };

const useApplicationsStore = create<IApplicationsState>((set, get) => ({
  formState: { pin: fieldInitState },
  setFormState: (key, value) => {
    const formState = { ...get().formState, [key]: value };
    set({ formState });
  },
}));

export default useApplicationsStore;
