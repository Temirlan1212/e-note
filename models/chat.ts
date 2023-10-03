export interface IContact {
  appName: string;
  chatCreator: string;
  chatId: number;
  chatRoomLink: string;
  guestEmail: null;
  guestId: number;
  notary: {
    id: number;
    name: string;
  };
  userToken: string;
}

interface IUser {
  $version: number;
  code: string;
  fullName: string;
  id: number;
}

interface IRequester {
  id: number;
  user?: IUser;
  version: number;
}

export interface IFetchByIdData {
  status: number;
  data: {
    id: number;
    version: number;
    requester: IRequester[];
  }[];
}

export interface IFetchNotaryChat {
  status: number;
  data: Partial<IContact>;
}
