export interface IFileUser {
  id: number;
  $version: number;
  code: string;
  fullName: string;
}

export interface IFileTags {}

export interface IFileList {
  id: number;
  version: number;
  canShare: boolean;
  canWrite: boolean;
  createdBy: IFileUser;
  createdOn: string;
  detailsIcon: string;
  downloadIcon: string;
  fileName: string;
  "metaFile.createdOn": string;
  "metaFile.fileType": string;
  relatedModel: string;
  tags: IFileTags[];
  typeIcon: string;
  updatedBy: IFileUser;
  updatedOn: string;
}
