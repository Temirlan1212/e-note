export interface IUser {
  username: string;
}

export interface IUserCredentials extends IUser {
  password: string;
}

export interface IUserRole {
  id: string;
  name: string;
  $version: number;
}

export interface IUserData extends IUser {
  id: number;
  name: string;
  email: string;
  "partner.mobilePhone": string;
  version: number;
  roles: IUserRole[];
}
