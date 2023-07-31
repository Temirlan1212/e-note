export interface IFilteredData {
  id: number;
  version: number;
  createdOn: string;
  "createdBy.fullName": string;
  "partner.fullName": string;
  "partner.personalNumber": number;
  "blockingReason.name": string;
  "partner.birthDate": string;
}
