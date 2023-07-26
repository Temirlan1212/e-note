import { number, object, string } from "yup";

export const applicationSchema = object().shape({
  id: number(),
  version: number(),
  name: string().required("required"),
});
