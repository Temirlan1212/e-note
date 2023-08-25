import { IAddress } from "./address";
import { ICompany } from "./company";

export interface IUser {
  username: string;
}

export interface IUserCredentials extends IUser {
  password: string;
}

export interface ICitizenship {
  id: number;
  version: number;
  $version: number;
  name: string;
  code: string;
}

export interface IEmail {
  id: number;
  version: number;
  $version: number;
  address: string;
}

export interface IPartner {
  id: number;
  version: number;
  $version: number;
  fullName: string;
  name: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  mobilePhone: string;
  personalNumber: string;
  partnerTypeSelect: number;
  foreigner: boolean;
  identityDocument: string;
  passportSeries: number;
  passportNumber: string;
  authority: string;
  authorityNumber: string;
  dateOfIssue: string;
  citizenship: ICitizenship;
  emailAddress: IEmail;
  mainAddress: IAddress;
  actualResidenceAddress: IAddress;
}

export interface IUserGroup {
  id: number;
  version: number;
  $version: number;
  name: string;
}

export interface IUserRole {
  id: number;
  version: number;
  $version: number;
  name: string;
}

export interface IUserData extends IUser {
  id: number;
  version: number;
  $version: number;
  name: string;
  email: string;
  code: string;
  partner: Partial<IPartner>;
  activeCompany: ICompany;
  group: IUserGroup;
  roles: IUserRole[];
}