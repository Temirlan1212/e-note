import * as yup from "yup";

export type IUserProfileSchema = yup.InferType<typeof userProfileSchema>;

export const userProfileSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required!"),
  login: yup.string().required("Login is required!"),
  email: yup.string().email().required("E-mail is required!"),
  partner: yup.object({
    mobilePhone: yup
      .string()
      .trim()
      .required("Mobile is required!")
      .matches(/^[0-9\+\-\s]*$/, { message: "Please enter valid number", excludeEmptyString: false }),
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
