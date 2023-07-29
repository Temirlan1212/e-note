export interface ICompany {
  id: number;
  version: number;
  name: string;
  code: string;
  "notaryDistrict.id": number;
}

export interface IRelatedCompany extends Omit<ICompany, "version"> {
  $version: number;
}
