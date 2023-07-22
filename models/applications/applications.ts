export type ICreatedBy = {
  "createdBy.fullName": string;
  "createdBy.id": number;
};

export type IProduct = {
  "product.fullName": string;
  "product.id": number;
  "product.name": number;
};

export interface IApplication extends IProduct, ICreatedBy {
  statusSelect: number;
  createdBy: ICreatedBy;
  id: number;
  creationDate: string;
  version: number;
  typeNotarialAction: number;
}

export interface IApplicationsQueryParamsData {
  _domain: string;
  _domainContext: {
    [key: string]: (number | string)[];
  };
}

export interface IApplicationQueryParams {
  offset: number;
  limit: number;
  fields: string[];
  data: IApplicationsQueryParamsData;
}

export type SortType = "asc" | "desc";
