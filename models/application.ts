import { ICompany } from "./company";

export interface IApplication {
  id: number;
  version: number;
  company: ICompany;
}
