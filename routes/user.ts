import { IRoute } from "./data";

export const routes: IRoute[] = [
  {
    title: "Profile",
    link: "/profile",
    type: "link",
    icon: "PersonOutline",
  },
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
      {
        title: "Register of Notaries of the KR",
        link: "/notary-registry",
        type: "menu",
        icon: "ListAlt",
      },
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
      // {
      //   title: "Black list",
      //   link: "/black-list",
      //   type: "menu",
      //   icon: "Block",
      // },
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
        link: "/my-templates",
        type: "menu",
        role: "notary",
        icon: "CollectionsBookmark",
      },
    ],
  },
  {
    title: "Archive of notarial actions",
    link: "/applications-archive",
    type: "menu",
    role: "notary",
    icon: "Archive",
  },
  // {
  //   title: "User registry",
  //   link: "/user-registry",
  //   role: "notary",
  //   type: "menu",
  //   icon: "PersonAddAlt1",
  // },
];
