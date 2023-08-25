import { IPartner, IUserData } from "./user";

export interface IBlackList {
  id: number;
  version: number;
  $version: number;
  createdOn: string;
  createdBy: IUserData;
  partner: IPartner;
  "blockingReason.name": string;
}
