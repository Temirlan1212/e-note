export interface IDocumentType {
  name: string;
  id: number;
  version: number;
}

export interface IDocumentTypeQueryParams {
  offset: number;
  limit: number;
  fields: string[];
  translate: boolean;
}
