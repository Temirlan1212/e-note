export interface IRegion {
  id: number;
  version: number;
  $version: number;
  name: string;
  "$t:name": string;
  code: string;
}

export interface IDistrict {
  id: number;
  version: number;
  $version: number;
  name: string;
  "$t:name": string;
  code: string;
  "region.id": number;
}

export interface ICity {
  id: number;
  version: number;
  $version: number;
  name: string;
  "$t:name": string;
  zip: string;
  "district.id": number;
}

export interface IAddress {
  id: number;
  version: number;
  $version: number;
  fullName: string;
  region: IRegion;
  district: IDistrict;
  city: ICity;
  addressL4: string;
  addressL3: string;
  addressL2: string;
}
