import * as yup from "yup";
import { InferType } from "yup";

export const emailSchema = yup.object().shape({
  email: yup.string().email("email").required("required"),
});

export type IEmailSchema = InferType<typeof emailSchema>;
