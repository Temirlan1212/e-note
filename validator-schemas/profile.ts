import * as yup from "yup";
import { userAddressSchema } from "./user";

export type IUserProfileSchema = yup.InferType<typeof userProfileSchema>;

export const userProfileSchema = yup.object().shape({
  firstName: yup.string().required("First name is required!"),
  middleName: yup.string().required("Middle name is required!"),
  lastName: yup.string().required("Last name is required!"),
  login: yup.string().required("Login is required!"),
  email: yup.string().email().required("E-mail is required!"),
  mobilePhone: yup
    .string()
    .trim()
    .required("Mobile is required!")
    .matches(/^[0-9\+\-\s]*$/, { message: "Please enter valid number", excludeEmptyString: false }),
  activeCompany: yup.object({
    licenseNo: yup.string(),
    licenseStatus: yup.string(),
    licenseTermFrom: yup.string(),
    licenseTermUntil: yup.string(),
    longitude: yup
      .string()
      .trim()
      .required("required")
      .matches(/^\d+(\.\d+)?$/, "onlyNumbers"),
    latitude: yup
      .string()
      .trim()
      .required("required")
      .matches(/^\d+(\.\d+)?$/, "onlyNumbers"),
    address: userAddressSchema,
    notaryDistrict: yup.object({
      id: yup.number().integer().positive(),
    }),
  }),
});

export const userProfilePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required("Password is required").min(4, "Password length should be more than 4 characters"),
  newPassword: yup
    .string()
    .required("New Password is required")
    .min(4, "Password length should be more than 4 characters"),
  confirmNewPassword: yup
    .string()
    .required("Confirm Password is required")
    .min(4, "Password length should be more than 4 characters")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});
