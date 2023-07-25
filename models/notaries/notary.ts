export interface INotary {
  id: number;
  name: string;
  image?: string;
  rating: number;
  region: string;
  area: string;
  location: string;
}

export interface NotaryCardProps {
  notary: INotary;
}
