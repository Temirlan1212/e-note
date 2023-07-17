import { create } from "zustand";

export const GuestRouteList = [
  {
    title: "Home page",
    link: "/",
    type: "link",
  },
  {
    title: "Login",
    link: "/login",
    type: "link",
  },
  {
    title: "About us",
    link: "/about",
    type: "menu",
  },
  {
    title: "Notaries",
    link: "/notaries",
    type: "menu",
  },
  {
    title: "Regulatory acts",
    link: "/regulatory-acts",
    type: "menu",
  },
  {
    title: "Questions and answers",
    link: "/qa",
    type: "menu",
  },
];

export const UserRouteList = [];

export const NotaryRouteList = [];

export interface IRouteState {
  guestRoutes: typeof GuestRouteList;
  userRoutes: typeof UserRouteList;
  notaryRoutes: typeof NotaryRouteList;
}

export const useRouteStore = create<IRouteState>()((set) => ({
  guestRoutes: GuestRouteList,
  userRoutes: UserRouteList,
  notaryRoutes: NotaryRouteList,
}));
