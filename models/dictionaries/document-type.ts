export interface IDocumentType {
  name: string;
  id: number;
  version: number;
  $wkfStatus: any;
}

export interface IDocumentTypeQuery {
  offset: 0;
  limit: 10;
  fields: string[];
  translate: boolean;
}
