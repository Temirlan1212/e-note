import { create } from "zustand";

export interface IChildRoute {
  title: string;
  link: string;
  type: "link" | "menu";
  icon?: string;
  bottomDivider?: boolean;
}

export interface IRoute extends Omit<IChildRoute, "type"> {
  type: IChildRoute["type"] | "group";
  children?: IChildRoute[];
}

export interface IRouteState {
  guestRoutes: IRoute[];
  userRoutes: IRoute[];
  notaryRoutes: IRoute[];
  getRoutes: (routeList: IRoute[], type?: IChildRoute["type"] | "all", rootOnly?: boolean) => IRoute[] | IChildRoute[];
}

export const useRouteStore = create<IRouteState>()((set, get) => ({
  guestRoutes: [
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
  ],
  userRoutes: [
    {
      title: "Files",
      link: "/files",
      type: "menu",
      icon: "Folder",
    },
  ],
  notaryRoutes: [],
  getRoutes: (routeList, type, rootOnly = false) => {
    if (type == null) {
      return routeList;
    }

    const routes = routeList.reduce((acc: IRoute[], val: IRoute) => {
      if (!rootOnly && val.children != null) {
        acc.push(...val.children);
      } else {
        acc.push(val);
      }

      return acc;
    }, []);

    switch (type) {
      case "link":
      case "menu":
        return routes.filter((route) => route.type === type);
      default:
        return routes;
    }
  },
}));
