export interface IContact {
  chatCreator: string;
  chatId: number;
  chatRoomLink: string;
  guest: string;
  userToken: string;
}

export interface IUser {
  id: number;
  "partner.fullName": string;
  version: number;
}

export interface IChatUser {
  data: IUser[];
}

export interface IRequester {
  id: number;
  personalNumber?: string;
  version: number;
}

export interface IFetchByIdData {
  data: {
    id: number;
    version: number;
    requester: IRequester[];
    members: IRequester[];
  }[];
}

export interface IFetchNotaryChat {
  status: number;
  data: Partial<IContact>;
}
