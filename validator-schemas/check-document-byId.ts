import * as yup from "yup";
import { InferType } from "yup";

export type ICheckDocumentById = InferType<typeof checkDocumentById>;

export const checkDocumentById = yup.object().shape({
  keyword: yup.string().matches(/^[a-zA-Z0-9]*$/, "Enter only Latin letters and numbers"),
});
