import { IRoute } from "./data";

export const routes: IRoute[] = [
  {
    title: "Home page",
    link: "/",
    type: "menu",
  },
  {
    title: "Login",
    link: "/login",
    type: "link",
  },
  {
    title: "Notariat",
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
