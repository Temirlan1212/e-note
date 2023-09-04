import { create } from "zustand";
import { useProfileStore } from "./profile";

const userData = useProfileStore.getState().userData;

export interface IChildRoute {
  title: string;
  link: string;
  type: "link" | "menu";
  role?: "user" | "notary";
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
  getRoutes: (
    routeList: IRoute[],
    type?: IRoute["type"] | "rendered",
    role?: IChildRoute["role"],
    rootOnly?: boolean
  ) => IRoute[] | IChildRoute[];
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
      title: "Notarial actions",
      link: "/applications",
      type: "menu",
      icon: "BorderColor",
    },
    {
      title: "Files",
      link: "/files",
      type: "menu",
      icon: "Folder",
    },
    {
      title: "Correspondence",
      link: "/chat",
      type: "menu",
      icon: "Chat",
    },
    {
      title: "Registries",
      link: "",
      type: "group",
      role: "notary",
      icon: "Inventory",
      children: [
        {
          title: "OMSUOfficials",
          link: "/omsu-officials",
          type: "menu",
          icon: "Groups3",
        },
        {
          title: "ForeignInstitutions",
          link: "/foreign-institutions-officials",
          type: "menu",
          icon: "LocalLibrary",
        },
        // {
        //   title: "Register of Notaries of the KR",
        //   link: "",
        //   type: "menu",
        //   icon: "ListAlt",
        // },
        // {
        //   title: "Register of notarial acts",
        //   link: "",
        //   type: "menu",
        //   icon: "ContentPasteSearch",
        // },
        {
          title: "Register of inheritance cases",
          link: "/inheritance-cases",
          type: "menu",
          icon: "ReceiptLong",
        },
        {
          title: "Black list",
          link: "/black-list",
          type: "menu",
          icon: "Block",
        },
      ],
    },
    {
      title: "Templates",
      link: "",
      type: "group",
      icon: "Description",
      children: [
        {
          title: "System templates",
          link: "/templates",
          type: "menu",
          icon: "LibraryBooks",
        },
        {
          title: "My templates",
          link: "my-templates",
          type: "menu",
          icon: "CollectionsBookmark",
        },
      ],
    },
  ],
  getRoutes: (routeList, type, role, rootOnly = false) => {
    if (type == null) {
      return routeList;
    }

    return routeList.reduce((acc: IRoute[], val: IRoute) => {
      if (role != null && val.role != null && role !== val.role) return acc;

      if (rootOnly && val.children != null) {
        val.children.map((item) => {
          if (
            (role == null || val.role == null || role === val.role) &&
            (type == null || type === "rendered" || type === item.type)
          )
            acc.push(item);
        });
      } else {
        const childRoutes = val.children?.filter(
          (item) =>
            (role == null || item.role == null || role === item.role) &&
            (type == null || type === "rendered" || type === item.type)
        );
        const route = { ...val, children: childRoutes };

        if (
          (role == null || val.role == null || role === val.role) &&
          (type == null || type === "rendered" || type === val.type)
        )
          acc.push(route);
      }

      return acc;
    }, []);
  },
}));
