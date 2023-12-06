import * as yup from "yup";
import { InferType } from "yup";

export type ICheckDocumentByNumber = InferType<typeof checkDocumentByNumber>;

export const checkDocumentByNumber = yup.object().shape({
  keyword: yup.string().matches(/^[0-9\-]*$/, "onlyNumbers"),
});
