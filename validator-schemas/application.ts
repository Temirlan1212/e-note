import { number, object, string } from "yup";

export const applicationSchema = object().shape({
  id: number(),
  version: number(),
  region: number(),
  name: string().required("required"),
  object: number().required("required"),
  objectType: number().required("required"),
});
