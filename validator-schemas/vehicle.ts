import { object, InferType, string, boolean, array } from "yup";

export type IVehicleSchema = InferType<typeof vehicleSchema>;

export const vehicleSchema = object().shape({
  movable: array().of(
    object().shape({
      pin: string().required("required"),
      number: string().required("required"),
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
  ),
});
