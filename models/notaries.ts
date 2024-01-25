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
  "$t:address.city.name": string;
  "address.city.name": string;
  id: number;
  "partner.simpleFullName": string;
  "partner.fullName": string;
  "partner.linkedUser.id": number;
  name: string;
  licenseTermUntil: string;
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
      "$t:name": string;
      fullName: string;
      id: number;
      $version: number;
    };
    district: {
      "$t:name": string;
      code: string;
      name: string;
      id: number;
      $version: number;
    };
    "$t:fullName": string;
    fullName: string;
    id: number;
    $version: number;
    region: {
      "$t:name": string;
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
  statusOfNotary: string;
  longitude: string;
  latitude: string;
}

export interface ApiNotaryResponse {
  status: number;
  data: INotaryInfoData[];
}

export interface INotaryFilterData {
  city: number | null;
  district: number | null;
  notaryDistrict: number | null;
  region: number | null;
  typeOfNotary: string | null;
  workingDay: string | null;
  roundClock?: boolean;
  departure?: boolean;
}
