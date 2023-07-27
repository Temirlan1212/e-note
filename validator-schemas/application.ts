import { number, object, string, InferType } from "yup";

export const applicationSchema = object().shape({
  id: number().optional(),
  version: number().optional(),
  region: number().optional(),
  district: number().optional(),
  city: number().optional(),
  notaryDistrict: number().optional(),
  company: number().required("required"),
});

export type IApplicationSchema = InferType<typeof applicationSchema>;
