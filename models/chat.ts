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
