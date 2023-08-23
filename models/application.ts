import { ICompany } from "./company";
import { IProduct } from "./product";
import { IPartner, IUserData } from "./user";

export interface IApplication {
  id: number;
  version: number;
  $version: number;
  statusSelect: number;
  typeNotarialAction: number;
  creationDate: string;
  notaryUniqNumber: string;
  notarySignatureStatus: number;
  createdBy: IUserData;
  company: ICompany;
  product: IProduct;
  requester: IPartner[];
  members: IPartner[];
}
