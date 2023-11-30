interface IAnalyticsItem {
  name: string;
  actionCounter: number;
}
export interface IAnalyticsData {
  company: IAnalyticsItem[];
  region: IAnalyticsItem[];
}
