import { IPartner } from "@/models/user";

export interface ICompany {
  id: number;
  version: number;
  $version: number;
  name: string;
  code: string;
  "notaryDistrict.id": number;
  partner: Partial<IPartner>;
}
