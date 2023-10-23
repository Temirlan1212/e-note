import { IUser, IUserCredentials, IUserData } from "@/models/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IProfileState {
  cookie: string | null;
  user: IUser | null;
  userData: IUserData | null;
  userRoleSelected: boolean;
  getCookie: () => string | null;
  getUser: () => IUser | null;
  getUserData: () => IUserData | null;
  setUserRoleSelected: (value: boolean) => void;
  logIn: (credentials: IUserCredentials) => Promise<void>;
  logInEsi: (code: string) => Promise<void>;
  logOut: () => void;
  loadUserData: (user: IUser) => Promise<void>;
}

export const useProfileStore = create<IProfileState>()(
  persist(
    (set, get) => ({
      cookie: null,
      user: null,
      userData: null,
      userRoleSelected: false,
      getCookie: () => {
        return get().cookie;
      },
      getUser: () => {
        return get().user;
      },
      getUserData: () => {
        return get().userData;
      },
      setUserRoleSelected: (value) => {
        set(() => ({ userRoleSelected: value }));
      },
      logIn: async (credentials) => {
        let cookie: string | null = null;
        let user: IUser | null = null;

        const response = await fetch("/api/profile/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) return;

        const setCookie = response.headers.get("cookie");
        if (setCookie == null) return;

        cookie = setCookie;
        user = await response.json();
        if (user == null) return;

        set(() => ({ cookie, user }));
        get().loadUserData(user);
      },
      logInEsi: async (code) => {
        let cookie: string | null = null;
        let user: IUser | null = null;

        const response = await fetch(`/api/profile/esi-login?code=${code}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

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
        set(() => ({ cookie: null, user: null, userData: null, userRoleSelected: false }));
      },
      loadUserData: async (user) => {
        const cookie = get().cookie;
        if (cookie == null) return;

        const response = await fetch("/api/profile/user-data", {
          method: "POST",
          headers: { "Content-Type": "application/json", "server-cookie": cookie },
          body: JSON.stringify(user),
        });

        if (!response.ok) return;

        const userData: { data: IUserData[] } | null = await response.json();

        if (userData == null || userData.data == null) return;

        set(() => ({ userData: userData.data[0] }));
      },
    }),
    {
      name: "profile",
    }
  )
);
