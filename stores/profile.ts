import { IUser, IUserCredentials, IUserData } from "@/models/profile/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IProfileState {
  cookie: string | null;
  user: IUser | null;
  userData: IUserData | null;
  loading: boolean;
  getCookie: () => string | null;
  getUser: () => IUser | null;
  getUserData: () => IUserData | null;
  logIn: (credentials: IUserCredentials) => Promise<void>;
  logOut: () => void;
  loadUserData: (user: IUser) => Promise<void>;
}

export const useProfileStore = create<IProfileState>()(
  persist(
    (set, get) => ({
      cookie: null,
      user: null,
      userData: null,
      loading: false,
      getCookie: () => {
        return get().cookie;
      },
      getUser: () => {
        return get().user;
      },
      getUserData: () => {
        return get().userData;
      },
      logIn: async (credentials) => {
        let cookie: string | null = null;
        let user: IUser | null = null;
        set({ loading: true });
        const response = await fetch("/api/profile/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        set({ loading: false });

        if (!response.ok) return;

        const setCookie = response.headers.get("cookie");
        if (setCookie == null) return;

        cookie = setCookie;
        user = await response.json();
        if (user == null) return;

        set(() => ({ cookie, user }));
        get().loadUserData(user);
      },
      logOut: () => {
        set(() => ({ cookie: null, user: null, userData: null }));
      },
      loadUserData: async (user) => {
        const cookie = get().cookie;
        if (cookie == null) return;

        const response = await fetch("/api/profile/user-data", {
          method: "POST",
          headers: { "Content-Type": "application/json", "server-cookie": cookie },
          body: JSON.stringify(user),
        });

        const userData: { data: IUserData[] } | null = await response.json();

        if (!response.ok || userData == null || userData.data == null) return;

        set(() => ({ userData: userData.data[0] }));
      },
    }),
    {
      name: "profile",
    }
  )
);
