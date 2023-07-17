import { create } from "zustand";

export const GuestRouteList = [
  {
    title: "Home page",
    link: "/",
  },
  {
    title: "About us",
    link: "/about",
  },
  {
    title: "Notaries",
    link: "/notaries",
  },
  {
    title: "Regulatory acts",
    link: "/regulatory-acts",
  },
  {
    title: "Questions and answers",
    link: "/qa",
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
