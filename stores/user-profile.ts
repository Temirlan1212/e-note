import { create } from "zustand";
import { persist } from "zustand/middleware";

import { IUser, IUserCredentials, IUserData } from "@/models/profile/user";

export interface IProfileState {
  cookie: string | null;
  user: IUser | null;
  userData: IUserData | null;
}

export const useProfileStore = create<IProfileState>()(
  persist(
    (set, get) => ({
      cookie: null,
      user: null,
      userData: null,
    }),
    {
      name: "user-profile",
    }
  )
);
