import * as yup from "yup";

export const userProfileSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required!"),
  login: yup.string().required("Login is required!"),
  email: yup.string().email().required("E-mail is required!"),
  mobilePhone: yup
    .string()
    .matches(/^[996]\d{11}$/, { message: "Please enter valid number.", excludeEmptyString: false }),
});

export const userProfilePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required("Password is required").min(4, "Password length should be at least 4 characters"),
  newPassword: yup
    .string()
    .required("Confirm Password is required")
    .min(4, "Password length should be at least 4 characters")
    .oneOf([yup.ref("password")], "Passwords do not match"),
  confirmNewpassword: yup
    .string()
    .required("Confirm Password is required")
    .min(4, "Password length should be at least 4 characters")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});
