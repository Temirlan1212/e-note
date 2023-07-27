import { number, object, string, InferType } from "yup";

export const applicationSchema = object().shape({
  id: number().positive().optional(),
  version: number().optional(),
  name: string().required("required"),
  region: number().optional(),
});

export type IApplicationSchema = InferType<typeof applicationSchema>;
