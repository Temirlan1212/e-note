export interface INotification {
  createdOn: string;
  isArchived: boolean;
  isRead: boolean;
  isStarred: boolean;
  "message.subject": string;
  "message.relatedId": number;
  id: number;
  subject: string;
  version: number;
  linkToChat: string;
  displayName: string;
  chatToken: string;
}
