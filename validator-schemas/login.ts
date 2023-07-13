import * as yup from "yup";

export const login = (t: (v: string) => string) => {
  return yup.object().shape({
    username: yup.string().required(t("This field is required!")),
    password: yup
      .string()
      .required(t("This field is required!"))
      .min(6, t("The password must be at least 6 characters long"))
      .max(40, t("The password must be no more than 40 characters")),
  });
};
