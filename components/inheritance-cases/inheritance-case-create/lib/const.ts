export const getAddressNames = (index: number) => ({
  region: `requester.${index}.mainAddress.region`,
  district: `requester.${index}.mainAddress.district`,
  city: `requester.${index}.mainAddress.city`,
  street: `requester.${index}.mainAddress.addressL4`,
  house: `requester.${index}.mainAddress.addressL3`,
  apartment: `requester.${index}.mainAddress.addressL2`,
  foreignAddress: `requester.${index}.foreignAddress`,
});

export const getPersonalDataNames = (index: number) => ({
  lastName: `requester.${index}.lastName`,
  firstName: `requester.${index}.firstName`,
  name: `requester.${index}.name`,
  middleName: `requester.${index}.middleName`,
  pin: `requester.${index}.personalNumber`,
  picture: `requester.${index}.picture`,
  tundukDocumentSeries: `requester.${index}.passportSeries`,
  tundukDocumentNumber: `requester.${index}.passportNumber`,
  deathDate: `requester.${index}.deathDate`,
  birthDate: `requester.${index}.birthDate`,
});
