import * as yup from "yup";

export const userProfileSchema = yup.object().shape({
  username: yup.string().required("Full name is required!"),
  login: yup.string().required("Login is required!"),
  email: yup.string().email().required("E-mail is required!"),
  telephoneNumber: yup.string().length(12, "Введите номер телефона").required("Введите номер телефона"),
  password: yup
    .string()
    .required("Password is required")
    .min(4, "Password length should be at least 4 characters")
    .max(12, "Password cannot exceed more than 12 characters"),
  cpassword: yup
    .string()
    .required("Confirm Password is required")
    .min(4, "Password length should be at least 4 characters")
    .max(12, "Password cannot exceed more than 12 characters")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});
