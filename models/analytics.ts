export interface IAnalyticsItem {
  name: string;
  actionCounter: number;
  regionName?: string;
  totalAction?: number;
  notaries?: IAnalyticsItem[];
}
