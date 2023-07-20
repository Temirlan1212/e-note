export interface IActionType {
  order_seq: number;
  title_fr: string;
  title_en: string;
  title: string;
  value: string;
}

export interface IActionTypeQuery {
  offset: number;
  limit: number;
  translate: boolean;
}
