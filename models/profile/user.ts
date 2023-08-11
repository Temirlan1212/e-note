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

export interface IUserData extends IUser {
  id: number;
  name: string;
  email: string;
  "partner.mobilePhone": string;
  version: number;
  group: IUserGroup;
  roles: IUserRole[];
}
