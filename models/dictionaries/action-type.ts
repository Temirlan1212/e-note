export interface IActionType {
  order_seq: number;
  title_fr: string;
  title_en: string;
  title_ru: string;
  title: string;
  value: string;
}

export interface IActionTypeQueryParams {
  offset: number;
  limit: number;
  translate: boolean;
}
