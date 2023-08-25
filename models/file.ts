import { IUserData } from "./user";

export interface IFileTag {}

export interface IFile {
  id: number;
  version: number;
  $version: number;
  canShare: boolean;
  canWrite: boolean;
  detailsIcon: string;
  downloadIcon: string;
  fileName: string;
  "metaFile.createdOn": string;
  "metaFile.fileType": string;
  relatedModel: string;
  typeIcon: string;
  createdOn: string;
  updatedOn: string;
  createdBy: IUserData;
  updatedBy: IUserData;
  tags: IFileTag[];
}
