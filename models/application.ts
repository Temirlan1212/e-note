import { ICompany } from "./company";
import { IUserData } from "@/models/user-data";

export interface IApplication {
  product: {
    fullName: string;
  };
  id: number;
  version: number;
  company: ICompany;
  typeNotarialAction: number;
  createdOn: Date | string;
  statusSelect: number;
  notaryUniqNumber: string;
  notarySignatureStatus: number;
  members: IUserData[];
  requester: IUserData[];
}
