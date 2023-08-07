export interface INotification {
  version: number;
  isArchived: boolean;
  isRead: boolean;
  isStarred: boolean;
  message: string;
  "message.body": string;
  userId: string;
  createdOn: string;
  updatedOn: string;
}
