export interface INotaryGeo {
  fullName: string | undefined;
  name: string;
  id: number;
}
export interface INotary {
  "partner.rating": number;
  "logo.fileName": string;
  "address.district": INotaryGeo;
  "address.city": INotaryGeo;
  "address.region": INotaryGeo;
  id: number;
  "partner.simpleFullName": string;
}

export interface INotaryData {
  data: INotary[];
  total: number;
}

export interface INotarySelections {
  status: number;
  offset: number;
  total: number;
  data: INotarySelectionsData[];
}

export interface INotarySelectionsData {
  name: string;
  id: number;
  version: number;
}

export interface INotaryTypeSelections {
  status: number;
  data: INotaryTypeSelectionsData[];
}

export interface INotaryTypeSelectionsData {
  order_seq: number;
  title_fr: string;
  title_en: string;
  title: string;
  value: string;
}
