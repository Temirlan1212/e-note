export interface IUser {
  username: string;
}

export interface IUserCredentials extends IUser {
  password: string;
}

export interface IUserGroup {
  id: number;
  name: string;
  $version: number;
}

export interface IUserRole {
  id: number;
  name: string;
  $version: number;
}
export interface IPartner {
  mobilePhone: string;
  $version: number;
  fullName: string;
  id: number;
  lastName: string;
  firstName: string;
  middleName: string;
  notaryPosition: string;
  birthDate: string;
  "emailAddress.address": string;
  simpleFullName: string;
  notaryWorkOrder: string;
  notaryCriminalRecord: string;
  version: number;
}

export interface IUserData extends IUser {
  id: number;
  name: string;
  email: string;
  partner: IPartner;
  "partner.mobilePhone": string;
  version: number;
  code: string;
  group: IUserGroup;
  roles: IUserRole[];
  activeCompany: { id: number };
}
