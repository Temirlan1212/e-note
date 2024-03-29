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
  createdOn: string;
  notaryUniqNumber: string;
  orderNumber?: string;
  notaryAnnulmentDate?: string;
  notaryAnnulmentReason?: string;
  notarySignatureStatus: number;
  notaryDocumentSignDate?: string;
  uniqueQrCode?: string;
  createdBy: IUserData;
  company: ICompany;
  product: IProduct;
  requester: IPartner[];
  members: IPartner[];
  scan?: {
    fileName: string;
    id: number;
  }[];
  notaryReason?: string;
  notaryReasonDate?: string;
  cancelReasonStr?: string;
  notaryCancelledDate?: string;
  documentInfo: {
    pdfLink: string;
    token: string;
    fileName: string;
    editUrl: string;
  };
  currency?: {
    code: string;
    name: string;
    id: number;
  };
}
