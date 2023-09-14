export interface INotaryGeo {
  fullName?: string | undefined;
  name?: string;
  id?: number;
  "$t:name"?: string;
}
export interface INotary {
  "partner.rating": number;
  "logo.fileName": string;
  "address.district": INotaryGeo;
  "address.city": INotaryGeo;
  "address.region": INotaryGeo;
  id: number;
  "partner.simpleFullName": string;
  name: string;
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

export interface INotaryInfoData {
  notaryDistrict: {
    name: string;
    id: number;
    $version: number;
    "$t:name": string;
  };
  licenseNo: string;
  address: {
    city: {
      fullName: string;
      id: number;
      $version: number;
    };
    district: {
      code: string;
      name: string;
      id: number;
      $version: number;
    };
    fullName: string;
    id: number;
    $version: number;
    region: {
      fullName: string;
      code: string;
      name: string;
      id: number;
      $version: number;
    };
  };
  $attachments: number;
  licenseTermUntil: string;
  version: number;
  $wkfStatus: any;
  workingDay: any[];
  partner: any;
  licenseStatus: number;
  name: string;
  logo: string;
  licenseTermFrom: string;
  $processInstanceId: any;
  id: number;
  typeOfNotary: string;
}

export interface ApiNotaryResponse {
  status: number;
  data: INotaryInfoData[];
}
