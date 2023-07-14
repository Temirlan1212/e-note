import * as yup from "yup";

export const login = yup.object().shape({
  username: yup.string().required("This field is required!"),
  password: yup.string().required("This field is required!").max(40, "The password must be no more than 40 characters"),
});
