import { number, object, InferType, string } from "yup";

export const applicationSchema = object().shape({
  id: number().optional(),
  version: number().optional(),
  region: number().optional(),
  district: number().optional(),
  city: number().optional(),
  notaryDistrict: number().optional(),
  company: number().required("required"),
  object: string().required("This field is required!"),
  objectType: string().required("This field is required!"),
  notarialAction: string().required("This field is required!"),
  typeNotarialAction: string().required("This field is required!"),
  action: string().required("This field is required!"),
});

export type IApplicationSchema = InferType<typeof applicationSchema>;
