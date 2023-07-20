import * as yup from "yup";

export const userProfileSchema = yup.object().shape({
  username: yup.string().required("Full name is required!"),
  name: yup.string().required("Login is required!"),
  email: yup.string().email().required("E-mail is required!"),
  "partner.mobilePhone": yup.string().length(12, "Введите номер телефона").required("Введите номер телефона"),
  password: yup
    .string()
    .required("Password is required")
    .min(4, "Password length should be at least 4 characters")
    .max(16, "Password cannot exceed more than 16 characters"),
  cpassword: yup
    .string()
    .required("Confirm Password is required")
    .min(4, "Password length should be at least 4 characters")
    .max(16, "Password cannot exceed more than 16 characters")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});
