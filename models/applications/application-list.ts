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
  id: number;
  creationDate: string;
  version: number;
  typeNotarialAction: number;
  "company.name": string;
}

export interface IApplicationsQueryParamsData {
  _domain: string;
  _domainContext: {
    [key: string]: (number | string)[];
  };
}
