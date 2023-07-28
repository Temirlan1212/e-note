import { number, object, InferType, string } from "yup";

export const applicationSchema = object().shape({
  id: number().optional(),
  version: number().optional(),
  region: number().optional(),
  district: number().optional(),
  city: number().optional(),
  notaryDistrict: number().optional(),
  company: number().required("required"),
  object: string().required(),
  objectType: string().required(),
  notarialAction: string().required(),
  typeNotarialAction: string().required(),
  action: string().required(),
});

export type IApplicationSchema = InferType<typeof applicationSchema>;
