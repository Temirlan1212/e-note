import { ICompany } from "../company";

export interface INotaryDistrict {
  id: number;
  version: number;
  name: string;
  company: ICompany;
  "city.id": number;
}
