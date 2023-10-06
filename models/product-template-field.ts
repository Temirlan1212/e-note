import { FieldPathValue, UseFormReturn } from "react-hook-form";

export type ProductTemplateFieldTypes =
  | "Boolean"
  | "Selection"
  | "Float"
  | "Decimal"
  | "Integer"
  | "String"
  | "Time"
  | "DateTime"
  | "Date"
  | "tunduk";

export interface IProductTemplateField {
  type: ProductTemplateFieldTypes;
  form: UseFormReturn<any>;
  name: string;
  defaultValue: FieldPathValue<any, any>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  selectionName?: string;
}

export interface IProductTemplateFieldTunduk {
  type: "tunduk";
  url: string;
  fields: IProductTemplateField[];
  responseFields: IProductTemplateField[];
}

export interface IProductTemplateFieldSchema {
  type: IProductTemplateField | IProductTemplateFieldTunduk;
  url: string;
  fields: IProductTemplateField[];
  responseFields: IProductTemplateField[];
}
