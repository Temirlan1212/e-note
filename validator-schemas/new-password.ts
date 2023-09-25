import * as yup from "yup";
import { InferType } from "yup";

export type INewPasswordSchema = InferType<typeof newPasswordSchema>;

export const newPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .trim()
    .min(8, "minCharacters")
    .matches(/[a-z]/, "lowCase")
    .matches(/[A-Z]/, "upperCase")
    .matches(/[0-9]/, "digit")
    .required("required"),
  newPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref("password")], "password")
    .required("required"),
});
