export interface IRegulatoryActs {
  title: string;
  url: string;
  id: number;
  "$t:title": string;
}

export interface IRegulatoryActsData {
  data: IRegulatoryActs[];
}
