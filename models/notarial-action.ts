export interface INotarialAction {
  title_ru: string;
  title_kg: string;
  title_en: string;
  id: number;
  value: number;
  "parent.value": number[];
}

export type INotarialActionData = {
  data: INotarialAction[];
};
