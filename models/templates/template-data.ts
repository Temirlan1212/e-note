export interface ITemplateData {
  translate: boolean;
  id: number;
  fullName: string;
  name: string;
  productTypeSelect: string;
}

export interface IRequestBody {
  criteria: Array<{
    fieldName: string;
    operator: string;
    value: string;
  }> | null;
  operator: string | null;
}

export interface IRowData {
  status: number;
  offset: number;
  total: number;
  data: Array<Record<string, any>>;
}
