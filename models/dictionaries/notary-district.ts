export interface INotaryDistrict {
  id: number;
  version: number;
  name: string;
  "city.id": number;
}

export interface IRelatedNotaryDistrict extends Omit<INotaryDistrict, "version"> {
  $version: number;
}
