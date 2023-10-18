export interface IRatingItem {
  grade: string;
  id: number;
  version: number;
}

export interface IRating {
  status: number;
  offset: number;
  total: number;
  data: IRatingItem[];
}
