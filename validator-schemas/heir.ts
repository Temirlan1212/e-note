import * as yup from "yup";

export const heir = yup.object().shape({
  username: yup.string().required("This field is required!"),
  innNumber: yup.string().required("This field is required!").length(14),
});
