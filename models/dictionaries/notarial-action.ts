export interface INotarialAction {
  title_ru: string;
  title_kg: string;
  title_en: string;
  id: number;
  value: number;
  "parent.value": number[];
}

export type INotarialActionType = "object" | "objectType" | "notarialAction" | "typeNotarialAction" | "action";

export type INotarialActionData = {
  [key in INotarialActionType]: INotarialAction[];
};
