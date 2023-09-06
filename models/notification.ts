export interface INotification {
  createdOn: string;
  isArchived: boolean;
  isRead: boolean;
  isStarred: boolean;
  message: {
    subject: string;
    id: number;
  };
  id: number;
  subject: string;
}
