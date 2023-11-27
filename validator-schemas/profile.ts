import * as yup from "yup";
import { addressSchema } from "./address";

export type IUserProfileSchema = yup.InferType<typeof userProfileSchema>;

export const userProfileSchema = yup.object().shape({
  code: yup.string().required("Login is required!"),
  partner: yup.object({
    firstName: yup.string().required("First name is required!"),
    middleName: yup.string().required("Middle name is required!"),
    lastName: yup.string().required("Last name is required!"),
    emailAddress: yup.object({
      address: yup.string().email().required("E-mail is required!"),
    }),
    mobilePhone: yup
      .string()
      .trim()
      .required("Mobile is required!")
      .matches(/^[0-9\+\-\s]*$/, { message: "Please enter valid number", excludeEmptyString: false }),
  }),
  activeCompany: yup.object({
    licenseNo: yup.string().trim().nullable(),
    licenseStatus: yup.string().trim().nullable(),
    licenseTermFrom: yup.string().trim().nullable(),
    licenseTermUntil: yup.string().trim().nullable(),
    longitude: yup
      .string()
      .trim()
      .matches(/^\d+(\.\d+)?$/, "onlyNumbers"),
    latitude: yup
      .string()
      .trim()
      .matches(/^\d+(\.\d+)?$/, "onlyNumbers"),
    address: addressSchema,
    notaryDistrict: yup
      .object({
        id: yup.number().integer().positive(),
      })
      .required("required"),
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
