import { object, InferType, string, boolean } from "yup";

export type IVehicleSchema = InferType<typeof vehicleSchema>;

export const vehicleSchema = object().shape({
  pin: string().required("required"),
  notaryLicensePlate: string().required("required"),
  notaryVehicleRegistrationCertificateNumber: string(),
  notaryTypeOfSteeringWheel: string(),
  notaryEngineCapacity: string(),
  notaryVehicleType: string(),
  firstName: string(),
  middleName: string(),
  lastName: string(),
  personalNumber: string(),
  tundukVehicleIsSuccess: boolean(),
  notaryVehicleColor: string(),
});
