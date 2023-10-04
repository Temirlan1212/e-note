import { number, object, InferType, string, boolean } from "yup";
import { addressSchema } from "./address";

export type IVehicleSchema = InferType<typeof vehicleSchema>;

export const vehicleSchema = object()
  .shape({
    pin: string(),
    notaryLicensePlate: string(),
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
  })
  .concat(addressSchema.pick(["region", "district", "city"]));
